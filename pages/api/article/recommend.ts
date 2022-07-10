import type { NextApiResponse } from 'next';
import { stringify } from 'qs';

import { DataBox } from '../base';
import { request, safeAPI } from '../core';
import { Article } from './index';

export default safeAPI(async (req, res: NextApiResponse<Article[]>) => {
  switch (req.method) {
    case 'GET': {
      const { articles, tags } = req.query;

      const { data } = await request<DataBox<Article[]>>(
        `articles?${stringify({
          'tags.id': tags,
          sort: 'updatedAt:desc',
        })}`,
      );
      res.send(
        data.filter(({ id }) => ![articles!].flat().find(ID => id === +ID)),
      );
    }
  }
});
