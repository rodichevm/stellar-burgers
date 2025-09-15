import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { register } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, handleChange] = useForm({
    email: '',
    password: '',
    name: ''
  });
  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      register({
        name: values.name,
        email: values.email,
        password: values.password
      })
    );
    navigate('/profile', { replace: true });
  };

  return (
    <RegisterUI
      errorText={error?.message}
      email={values.email}
      userName={values.name}
      password={values.password}
      handleSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
};
