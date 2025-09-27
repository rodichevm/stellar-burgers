import reducer, {
  createOrder,
  fetchOrder,
  fetchOrders,
  initialState
} from '../orderSlice';
import { TOrder } from '@utils-types';

const wrongOrderNumber = -123;

const ordersData: TOrder[] = [
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
];

describe('Тестирование редьюсеров заказов', () => {
  describe('Запрос списка заказов', () => {
    test('Старт запроса списка заказов: pending', () => {
      const state = reducer(initialState, fetchOrders.pending('pending'));
      expect(state.error).toBe(null);
    });
    test('Результат запроса списка заказов: fulfilled', () => {
      const state = reducer(
        initialState,
        fetchOrders.fulfilled(ordersData, 'fulfilled')
      );
      expect(state.error).toBe(null);
      expect(state.data).toEqual(ordersData);
    });
    test('Ошибка запроса списка заказов: rejected', () => {
      const error = 'fetchOrders.rejected';
      const state = reducer(
        initialState,
        fetchOrders.rejected(new Error(error), 'rejected')
      );
      expect(state.error?.message).toBe(error);
    });
  });
  describe('Запрос заказа', () => {
    test('Старт запроса заказа: pending', () => {
      const state = reducer(
        initialState,
        fetchOrder.pending('pending', ordersData[0].number)
      );
      expect(state.orderModalData).toBe(null);
    });
    test('Результат запроса заказа: fulfilled', () => {
      const state = reducer(
        initialState,
        fetchOrder.fulfilled(ordersData[0], 'fulfilled', ordersData[0].number)
      );
      expect(state.orderModalData).toEqual(ordersData[0]);
    });
    test('Ошибка запроса заказа: rejected', () => {
      const error = 'fetchOrder.rejected';
      const state = reducer(
        initialState,
        fetchOrder.rejected(new Error(error), 'rejected', wrongOrderNumber)
      );
      expect(state.error?.message).toBe(error);
    });
  });
  describe('Создание заказа', () => {
    test('Старт запроса создания заказа: pending', () => {
      const state = reducer(
        initialState,
        createOrder.pending('pending', ordersData[0].ingredients)
      );
      expect(state.orderRequest).toBe(true);
    });
    test('Результат запроса создания заказа: fulfilled', () => {
      const state = reducer(
        initialState,
        createOrder.fulfilled(
          { order: ordersData[0], name: 'EXAMPLE' },
          'fulfilled',
          ordersData[0].ingredients
        )
      );
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(ordersData[0]);
    });
    test('Ошибка запроса заказа: rejected', () => {
      const error = 'createOrder.rejected';
      const state = reducer(
        initialState,
        createOrder.rejected(new Error(error), 'rejected', [])
      );
      expect(state.orderRequest).toBe(false);
      expect(state.error?.message).toBe(error);
    });
  });
  describe('Сброс данных модального окна заказа', () => {
    test('Сброс данных модального окна заказа', () => {
      const state = {
        ...initialState,
        orderModalData: ordersData[0]
      };
      const newState = reducer(state, {
        type: 'orders/resetOrderModalData'
      });
      expect(newState.orderModalData).toBe(null);
    });
  });
});
