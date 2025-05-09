import { marked } from 'marked';
import MIME from 'mime';
import {
  normalizeTextArray,
  TableCellAttachment,
  TableCellMedia,
  TableCellText,
  TableCellValue,
} from 'mobx-lark';

export const normalizeMarkdownArray = (list: TableCellText[]) =>
  normalizeTextArray(list).map(text => marked(text) as string);

export function fileURLOf(field: TableCellValue, cache = false) {
  if (!(field instanceof Array) || !field[0]) return field + '';

  const file = field[0] as TableCellMedia | TableCellAttachment;

  let URI = `/api/lark/file/${'file_token' in file ? file.file_token : file.attachmentToken}`;

  if (cache) URI += '.' + MIME.getExtension('type' in file ? file.type : file.mimeType);

  return URI;
}
