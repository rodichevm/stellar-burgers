import { rootReducer, RootState, store } from '../../store';

describe('Тестирование rootReducer', () => {
  test('Вызов rootReducer с UNKNOWN_ACTION и undefined возвращает предыдущее состояние хранилища', () => {
    const before: RootState = store.getState();

    const after: RootState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(after).toEqual(before);
  });
});
