import { fileTypeFromBuffer } from 'file-type';
import MIME from 'mime';
import { TableCellMedia, TableCellValue } from 'mobx-lark';
import { parse } from 'path';

import { safeAPI } from '../../base';
import { lark } from '../core';

export const DefaultImage = process.env.NEXT_PUBLIC_LOGO!;

export function fileURLOf(field: TableCellValue, cache = false) {
  if (!(field instanceof Array) || !field[0]) return field + '';

  const { file_token, type } = field[0] as TableCellMedia;

  let URI = `/api/Lark/file/${file_token}`;

  if (cache) URI += '.' + MIME.getExtension(type);

  return URI;
}

export const CACHE_HOST = process.env.NEXT_PUBLIC_CACHE_HOST!;

export default safeAPI(async ({ method, url, query, headers }, res) => {
  const { ext } = parse(url!);

  if (ext)
    return void res.redirect(
      new URL(new URL(url!, `http://${headers.host}`).pathname, CACHE_HOST) +
        '',
    );
  switch (method) {
    case 'HEAD':
    case 'GET': {
      const { id } = query;

      const file = await lark.downloadFile(id as string);

      const { mime } = (await fileTypeFromBuffer(file)) || {};

      res.setHeader('Content-Type', mime as string);

      return void (method === 'GET' ? res.send(Buffer.from(file)) : res.end());
    }
  }
  res.status(405).end();
});
