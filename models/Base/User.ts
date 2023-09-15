import { Guard } from '@authing/guard';
import { BaseModel } from 'mobx-restful';

import { API_Host } from '.';

export const guard = new Guard({
  mode: 'modal',
  appId: process.env.NEXT_PUBLIC_AUTHING_APP_ID!,
});
