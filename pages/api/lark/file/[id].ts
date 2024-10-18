import { fileTypeFromBuffer } from 'file-type';
import { TableCellMedia, TableCellValue } from 'mobx-lark';

import { safeAPI } from '../../base';
import { lark } from '../core';

export const DefaultImage = '/image/KaiYuanShe.png';

export const fileURLOf = (field: TableCellValue) =>
  field instanceof Array
    ? typeof field[0] === 'object'
      ? 'file_token' in field[0]
        ? `/api/lark/file/${field[0].file_token}`
        : 'attachmentToken' in field[0]
          ? `/api/lark/file/${field[0].attachmentToken}`
          : field + ''
      : field + ''
    : field + '';

export default safeAPI(async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const { id } = req.query;

      const file = await lark.downloadFile(id as string);

      const { mime } = (await fileTypeFromBuffer(file)) || {};

      res.setHeader('Content-Type', mime || 'application/octet-stream');
      res.send(Buffer.from(file));
    }
  }
});
