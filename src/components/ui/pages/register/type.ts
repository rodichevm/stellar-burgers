import React from 'react';
import { PageUIProps } from '../common-type';

export type RegisterUIProps = PageUIProps & {
  password: string;
  userName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
