import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { getIsAuthChecked } from '../../services/slices/userSlice';
import React from 'react';

export type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  if (onlyUnAuth && isAuthenticated) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }
  return <>{children}</>;
};
