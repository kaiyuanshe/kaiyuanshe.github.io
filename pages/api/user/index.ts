import { NextApiRequest, NextApiResponse } from 'next';

import { Base, Media, call } from '../base';

export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other',
}

export const GenderName = {
  [Gender.Female]: '女',
  [Gender.Male]: '男',
  [Gender.Other]: '其他',
};

export interface Role extends Base {
  name: string;
  description?: string;
  type?: string;
  permissions?: [];
  users?: [];
}

export interface Address extends Base {
  country: string;
  province: string;
  city?: string;
  district?: string;
  street?: string;
  building?: string;
  room?: string;
}

export interface User extends Base {
  username: string;
  email: string;
  token?: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: Role;
  avatar?: Media;
  gender?: Gender;
  address?: Address;
  summary?: string;
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST')
    try {
      await call('auth/local/register', 'POST', request.body);

      response.writeHead(302, { Location: '/user/sign-in' }).end();
    } catch (error: any) {
      console.error(error);
      response.status(400).send(error.message);
    }
};
