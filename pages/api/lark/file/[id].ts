import { fileTypeFromStream } from 'file-type';
import MIME from 'mime';
import { TableCellAttachment, TableCellMedia, TableCellValue } from 'mobx-lark';
import { parse } from 'path';
import { Readable } from 'stream';

import { safeAPI } from '../../base';
import { lark } from '../core';

export const DefaultImage = process.env.NEXT_PUBLIC_LOGO!;

export function fileURLOf(field: TableCellValue, cache = false) {
  if (!(field instanceof Array) || !field[0]) return field + '';

  const file = field[0] as TableCellMedia | TableCellAttachment;

  let URI = `/api/lark/file/${'file_token' in file ? file.file_token : file.attachmentToken}`;

  if (cache)
    URI += '.' + MIME.getExtension('type' in file ? file.type : file.mimeType);

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
      const { id } = query,
        token = await lark.getAccessToken();

      const response = await fetch(
        lark.client.baseURI + `drive/v1/medias/${id}/download`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const { ok, status, headers, body } = response;

      if (!ok) return void res.status(status).send(await response.json());

      const mime = headers.get('Content-Type'),
        [stream1, stream2] = body!.tee();

      const contentType = mime?.startsWith('application/octet-stream')
        ? (await fileTypeFromStream(stream1))?.mime
        : mime;
      res.setHeader('Content-Type', contentType || 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        headers.get('Content-Disposition') || '',
      );
      res.setHeader('Content-Length', headers.get('Content-Length') || '');

      return void (method === 'GET'
        ? // @ts-expect-error Web type compatibility
          Readable.fromWeb(stream2).pipe(res)
        : res.end());
    }
  }
  res.status(405).end();
});
