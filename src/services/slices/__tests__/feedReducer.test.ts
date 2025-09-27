import reducer, { fetchFeed, initialState } from '../feedSlice';

const feedData = {
  success: true,
  orders: [
    {
      _id: '68d4e1e0673086001ba89c4f',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный био-марсианский бургер',
      createdAt: '2025-09-25T06:32:00.768Z',
      updatedAt: '2025-09-25T06:32:01.951Z',
      number: 89551
    }
  ],
  total: 0,
  totalToday: 0
};

describe('Тестирование редьюсера ленты заказов', () => {
  test('Старт запроса ленты заказов: pending', () => {
    const state = reducer(initialState, fetchFeed.pending('pending'));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });
  test('Результат запроса ленты заказов: fulfilled', () => {
    const state = reducer(
      initialState,
      fetchFeed.fulfilled(feedData, 'fulfilled')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.data).toEqual(feedData);
  });
  test('Ошибка запроса ленты заказов: rejected', () => {
    const error = 'fetchFeed.rejected';
    const state = reducer(
      initialState,
      fetchFeed.rejected(new Error(error), 'rejected')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error?.message).toBe(error);
  });
});
