import { Lark, RowData } from 'lark-ts-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const Lark_APP_ID = process.env.Lark_APP_ID!,
  Lark_APP_SECRET = process.env.Lark_APP_SECRET!,
  Lark_SPREADSHEET_ID = process.env.Lark_SPREADSHEET_ID!;

const keys = [
  'verified',
  'name',
  'type',
  'tags',
  'startDate',
  'city',
  'email',
  'link',
  'codeLink',
  'wechatName',
  'logos',
  'summary',
] as const;

export type Organization = RowData<typeof keys>;

export default async (
  request: NextApiRequest,
  response: NextApiResponse<Organization[]>,
) => {
  switch (request.method) {
    case 'GET': {
      const lark = new Lark({
        appId: Lark_APP_ID,
        appSecret: Lark_APP_SECRET,
      });
      const {
        sheets: [sheet],
      } = await lark.getSpreadSheet(Lark_SPREADSHEET_ID);

      const data = await sheet.getData({
        columnRange: ['G', 'R'],
        keys,
        pageSize: sheet.meta.rowCount - 1,
      });
      const list = data.filter(({ verified }) => verified);

      response.json(list);
    }
  }
};
