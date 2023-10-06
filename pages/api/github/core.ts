import { components } from '@octokit/openapi-types';

import { githubClient } from '../../../models/Base';
import { safeAPI } from '../base';

type Repository = components['schemas']['minimal-repository'];
export type Issue = components['schemas']['issue'];
export interface GitRepository extends Repository {
  issues: Issue[];
  languages?: string[];
}

export const proxyGithub = <T extends GitRepository>(
  dataFilter?: (path: string ,data:T) => T,
) =>
  safeAPI(async ({  url, headers }, response) => {
    delete headers.host;

    const path = url!.slice(`/api/github/`.length);

    const { status, body:data} = await githubClient.get(path);
    
    response.status(status);
    response.send(dataFilter?.(path, data as T) || data);
  });
