import { TUser } from '@utils-types';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  user: TUser;
  error: SerializedError | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  error: null,
  user: {
    name: '',
    email: ''
  }
};

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('refreshToken', String(refreshToken));
  setCookie('accessToken', String(accessToken));
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data) => {
    const response = await registerUserApi(data);
    const { user, refreshToken, accessToken } = response;
    setTokens(accessToken, refreshToken);
    return user;
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data) => {
    const response = await loginUserApi(data);
    const { user, refreshToken, accessToken } = response;
    setTokens(accessToken, refreshToken);
    return user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    getIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.isAuthChecked = true;
      state.user = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      state.error = action.error;
    });
    builder.addCase(register.pending, (state) => {
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(login.pending, (state) => {
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.error;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = { name: '', email: '' };
      state.error = null;
      state.isAuthChecked = true;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.error;
    });
  }
});

export const { getIsAuthChecked } = userSlice.selectors;
export const { setIsAuthChecked } = userSlice.actions;
