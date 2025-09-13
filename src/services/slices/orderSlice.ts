import { TOrder } from '@utils-types';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';

type TOrdersState = {
  data: TOrder[];
  error: null | SerializedError;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export const initialState: TOrdersState = {
  data: [],
  error: null,
  orderRequest: false,
  orderModalData: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => await getOrdersApi()
);

export const fetchOrder = createAsyncThunk<TOrder, number>(
  'orders/fetchOrder',
  async (data) => {
    const response = await getOrderByNumberApi(data);
    return response.orders[0];
  }
);

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('orders/create', async (data) => {
  const response = await orderBurgerApi(data);

  return { order: response.order, name: response.name };
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.error = null;
      state.data = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(fetchOrder.pending, (state) => {
      state.orderModalData = null;
    });
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.orderModalData = action.payload;
    });
    builder.addCase(fetchOrder.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(createOrder.pending, (state) => {
      state.orderRequest = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload.order;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error;
    });
  }
});

export const { resetOrderModalData } = ordersSlice.actions;
