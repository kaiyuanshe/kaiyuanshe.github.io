import { Base, call } from './base';
import { User } from './user';

const Host = process.env.NEXT_PUBLIC_API_HOST;
var token = '';

export interface Media extends Base {
  created_by?: string;
  updated_by?: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  hash: string;
  ext?: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  related?: string;
}

export async function uploadFile(
  files: Blob | string,
  ref?: string,
  refId?: number,
  field?: string,
  source?: string,
) {
  if (typeof files === 'string') files = await (await fetch(files)).blob();

  const form = new FormData();

  for (const [key, value] of Object.entries({
    files,
    ref,
    refId,
    field,
    source,
  }))
    if (value) form.append(key, typeof value === 'number' ? value + '' : value);

  if (!token) {
    const user = await call<User>('user/session');

    token = user.token!;
  }

  const [saved] = await call<Media[]>(
    `${Host}upload`,
    'POST',
    form,
    undefined,
    { Authorization: `Bearer ${token}` },
  );
  return saved;
}
