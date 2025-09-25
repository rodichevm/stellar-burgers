import reducer, { fetchIngredients, initialState } from '../ingredientsSlice';

const ingredientData = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  }
];

describe('Тестирование редьюсера ингредиентов', () => {
  test('Старт запроса ингредиентов: pending', () => {
    const state = reducer(initialState, fetchIngredients.pending('pending'));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });
  test('Результат запроса ингредиентов: fulfilled', () => {
    const state = reducer(
      initialState,
      fetchIngredients.fulfilled(ingredientData, 'fulfilled')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.data).toEqual(ingredientData);
  });
  test('Ошибка запроса ингредиентов: rejected', () => {
    const error = 'fetchIngredients.rejected';
    const state = reducer(
      initialState,
      fetchIngredients.rejected(new Error(error), 'rejected')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error?.message).toBe(error);
  });
});
