import { Base, DataBox } from './base';
import { request, safeAPI } from './core';

export interface Tag extends Base {
  name: string;
}

export default safeAPI(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const { keyword } = req.query;

      const { data } = await request<DataBox<Tag[]>>(
        `tags?name_contains=${keyword}`,
        'GET',
        null,
        { req, res },
      );
      return res.send(data);
    }
  }
});
