import type { NextApiRequest, NextApiResponse } from 'next';
import { stringify } from 'qs';

import { DataBox, call } from '../base';
import { Article } from './index';

export default async (
  request: NextApiRequest,
  response: NextApiResponse<Article[]>,
) => {
  switch (request.method) {
    case 'GET': {
      const { articles, tags } = request.query;

      const { data } = await call<DataBox<Article[]>>(
        `articles?${stringify({
          'tags.id': tags,
          sort: 'updatedAt:desc',
        })}`,
      );
      response.send(
        data.filter(({ id }) => ![articles].flat().find(ID => id === +ID)),
      );
    }
  }
};
