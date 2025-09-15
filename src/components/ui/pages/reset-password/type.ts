import React from 'react';
import { PageUIProps } from '../common-type';

export type ResetPasswordUIProps = Omit<PageUIProps, 'email' | 'setEmail'> & {
  password: string;
  token: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
