import { FC, FormEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { login } from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [values, handleChange] = useForm({ email: '', password: '' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ email: values.email, password: values.password }));
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      password={values.password}
      onChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
