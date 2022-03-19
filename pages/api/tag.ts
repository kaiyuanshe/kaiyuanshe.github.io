import { NextApiRequest, NextApiResponse } from 'next';

import { Base, DataBox, call } from './base';

export interface Tag extends Base {
  name: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      const { keyword } = req.query;

      const { data } = await call<DataBox<Tag[]>>(
        `tags?name_contains=${keyword}`,
        'GET',
        null,
        { req, res },
      );
      return res.send(data);
    }
  }
};
