import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { feedSlice } from './slices/feedSlice';
import { builderSlice } from './slices/builderSlice';
import { ordersSlice } from './slices/orderSlice';
import { userSlice } from './slices/userSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  feedSlice,
  builderSlice,
  ordersSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
