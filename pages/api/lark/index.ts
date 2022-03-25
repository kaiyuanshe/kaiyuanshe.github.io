import { Lark } from 'lark-ts-sdk';

const LARK_APP_ID = process.env.LARK_APP_ID!,
  LARK_APP_SECRET = process.env.LARK_APP_SECRET!;

export const lark = new Lark({
  appId: LARK_APP_ID,
  appSecret: LARK_APP_SECRET,
});
