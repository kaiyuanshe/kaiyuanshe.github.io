import { fileTypeFromBuffer } from 'file-type';
import { TableCellMedia, TableCellValue } from 'lark-ts-sdk';

import { lark } from '../../../../models/Lark';
import { safeAPI } from '../../base';

export const DefaultImage = '/image/KaiYuanShe.png';

export const fileURLOf = (field: TableCellValue) =>
  field instanceof Array
    ? field[0]
      ? `/api/lark/file/${(field[0] as TableCellMedia).file_token}`
      : field + ''
    : field + '';

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
