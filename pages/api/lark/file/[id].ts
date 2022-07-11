import { fileTypeFromBuffer } from 'file-type';

import { safeAPI } from '../../base';
import { lark } from '../index';

export default safeAPI(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const { id } = req.query;

      await lark.getAccessToken();

      const file = await lark.downloadFile(id as string);

      const buffer = Buffer.alloc(file.byteLength),
        view = new Uint8Array(file);

      for (let i = 0; i < buffer.length; i++) buffer[i] = view[i];

      const { mime } = (await fileTypeFromBuffer(buffer)) || {};

      res.setHeader('Content-Type', mime as string);
      res.send(buffer);
    }
  }
});
