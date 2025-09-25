import reducer, {
  fetchUser,
  initialState,
  login,
  logout,
  register,
  updateUser,
  setIsAuthChecked,
  getIsAuthChecked
} from '../userSlice';

const userData = {
  email: 'michael@example.mail',
  name: 'Michael'
};

const registerData = {
  email: 'michael@example.mail',
  name: 'Michael',
  password: 'Qwerty123'
};

const loginData = {
  email: 'michael@example.mail',
  password: 'Qwerty123'
};

describe('Тестирование редьюсера пользователя', () => {
  describe('Запрос пользователя', () => {
    test('Старт запроса пользователя: pending', () => {
      const state = reducer(initialState, fetchUser.pending('pending'));
      expect(state.error).toBe(null);
    });
    test('Результат запроса пользователя: fulfilled', () => {
      const state = reducer(
        initialState,
        fetchUser.fulfilled(userData, 'fulfilled')
      );
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(userData);
    });
    test('Ошибка запроса пользователя: rejected', () => {
      const error = 'fetchUser.rejected';
      const state = reducer(
        initialState,
        fetchUser.rejected(new Error(error), 'rejected')
      );
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error?.message).toBe(error);
    });
  });

  describe('Регистрация пользователя', () => {
    test('Старт запроса регистрации пользователя: pending', () => {
      const state = reducer(
        initialState,
        register.pending('pending', registerData)
      );
      expect(state.error).toBe(null);
    });
    test('Результат запроса регистрации пользователя: fulfilled', () => {
      const state = reducer(
        initialState,
        register.fulfilled(userData, 'fulfilled', registerData)
      );
      expect(state.error).toBe(null);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData);
    });
    test('Ошибка запроса регистрации пользователя: rejected', () => {
      const error = 'register.rejected';
      const state = reducer(
        initialState,
        register.rejected(new Error(error), 'rejected', registerData)
      );
      expect(state.error?.message).toEqual(error);
      expect(state.user).toEqual({ name: '', email: '' });
    });
  });

  describe('Вход в аккаунт', () => {
    test('Старт запроса авторизации: pending', () => {
      const state = reducer(initialState, login.pending('pending', loginData));
      expect(state.error).toBe(null);
    });
    test('Результат запроса авторизации: fulfilled', () => {
      const state = reducer(
        initialState,
        login.fulfilled(userData, 'fulfilled', loginData)
      );
      expect(state.error).toBe(null);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(userData);
    });
    test('Ошибка запроса авторизации: rejected', () => {
      const error = 'login.rejected';

      const state = reducer(
        initialState,
        login.rejected(new Error(error), 'rejected', loginData)
      );

      expect(state.error?.message).toEqual(error);
      expect(state.isAuthenticated).toBe(false);
    });
  });
  describe('Выход из аккаунта', () => {
    test('Старт запроса выхода из аккаунта: pending', () => {
      const state = reducer(initialState, logout.pending('pending'));
      expect(state).toEqual(initialState);
    });
    test('Результат запроса выхода из аккаунта: fulfilled', () => {
      const state = reducer(
        initialState,
        logout.fulfilled(undefined, 'fulfilled')
      );
      expect(state.error).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toEqual({ name: '', email: '' });
      expect(state.isAuthChecked).toBe(true);
    });
    test('Ошибка запроса выхода из аккаунта: rejected', () => {
      const error = 'logout.rejected';
      const state = reducer(
        initialState,
        logout.rejected(new Error(error), 'rejected')
      );
      expect(state).toEqual(initialState);
    });
  });
  describe('Обновление данных пользователя', () => {
    test('Старт запроса обновления данных пользователя: pending', () => {
      const state = reducer(
        initialState,
        updateUser.pending('pending', registerData)
      );
      expect(state.error).toBe(null);
    });
    test('Результат запроса обновления данных пользователя: fulfilled', () => {
      const state = reducer(
        initialState,
        updateUser.fulfilled(userData, 'fulfilled', registerData)
      );
      expect(state.error).toBe(null);
      expect(state.user).toEqual(userData);
    });
    test('Ошибка запроса обновления данных пользователя: rejected', () => {
      const error = 'updateUser.rejected';

      const state = reducer(
        initialState,
        updateUser.rejected(new Error(error), 'rejected', registerData)
      );

      expect(state.error?.message).toEqual(error);
    });
  });
  describe('Проверка смены флага isAuthChecked', () => {
    test('setIsAuthChecked устанавливает флаг', () => {
      const state = reducer(initialState, setIsAuthChecked(true));
      expect(state.isAuthChecked).toBe(true);
    });
    test('setIsAuthChecked сбрасывает флаг', () => {
      const state = reducer(initialState, setIsAuthChecked(false));
      expect(state.isAuthChecked).toBe(false);
    });
  });
  describe('Селектор getIsAuthChecked', () => {
    test('Возвращает true, когда флаг isAuthChecked установлен', () => {
      const state = reducer(initialState, setIsAuthChecked(true));
      const rootState = { user: state };
      expect(getIsAuthChecked(rootState)).toBe(true);
    });

    test('Возвращает false, когда флаг isAuthChecked сброшен', () => {
      const state = reducer(initialState, setIsAuthChecked(false));
      const rootState = { user: state };
      expect(getIsAuthChecked(rootState)).toBe(false);
    });
  });
});
