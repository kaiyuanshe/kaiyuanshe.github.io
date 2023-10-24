import { githubClient } from '../../../models/Base';
import { safeAPI } from '../base';

export const proxyGithub = <T>(dataFilter?: (path: string, data: T) => T) =>
  safeAPI(async ({ method, url, headers, body }, response) => {
    delete headers.host;

    const path = url!.slice(`/api/github/`.length);

    const { status, body: data } = await githubClient.request<T>({
      // @ts-ignore
      method,
      path,
      // @ts-ignore
      headers,
      body: body || undefined,
    });

    response.status(status);
    response.send(dataFilter?.(path, data as T) || data);
  });
