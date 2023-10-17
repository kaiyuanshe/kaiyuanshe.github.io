import { components } from '@octokit/openapi-types';
import { HTTPClient } from 'koajax';
import { memoize } from 'lodash';
import { Filter, ListModel, toggle } from 'mobx-restful';
import { averageOf, buildURLData } from 'web-utility';

import { API_Host } from './Base';

type Repository = components['schemas']['minimal-repository'];
export type Organization = components['schemas']['organization-full'];
export type Issue = components['schemas']['issue'];

export interface GitRepository extends Repository {
  issues: Issue[];
  languages?: string[];
}

export interface RepositoryFilter extends Filter<GitRepository> {
  relation: (keyof RepositoryModel['relation'])[];
}

type ReturnMap<T> = {
  [K in keyof T]: T[K] extends (...data: any[]) => Promise<any>
    ? Awaited<ReturnType<T[K]>>
    : T[K] extends (...data: any[]) => any
    ? ReturnType<T[K]>
    : never;
};

export class RepositoryModel extends ListModel<
  GitRepository,
  RepositoryFilter
> {
  client = new HTTPClient({
    baseURI: `${API_Host}/api/github/`,
    responseType: 'json',
  });
  baseURI = 'orgs/kaiyuanshe/repos';
  indexKey = 'full_name' as const;

  relation = {
    issues: memoize(async (URI: string) => {
      const { body: issuesList } = await this.client.get<Issue[]>(
        `repos/${URI}/issues?per_page=100`,
      );
      return issuesList!.filter(({ pull_request }) => !pull_request);
    }),
    languages: memoize(async (URI: string) => {
      const { body: languageCount } = await this.client.get<
        Record<string, number>
      >(`repos/${URI}/languages`);

      const languageAverage = averageOf(...Object.values(languageCount!));

      const languageList = Object.entries(languageCount!)
        .filter(([_, score]) => score >= languageAverage)
        .sort(([_, a], [__, b]) => b - a);

      return languageList.map(([name]) => name);
    }),
  };

  async getOneRelation(
    URI: string,
    relation: RepositoryFilter['relation'] = [],
  ) {
    const relationData = await Promise.all(
      relation.map(async key => {
        const value = await this.relation[key](URI);
        return [key, value];
      }),
    );
    return Object.fromEntries(relationData) as ReturnMap<
      RepositoryModel['relation']
    >;
  }

  @toggle('downloading')
  async getOne(URI: string, relation: RepositoryFilter['relation'] = []) {
    const { body } = await this.client.get<Repository>(`repos/${URI}`);

    return (this.currentOne = {
      ...body!,
      ...(await this.getOneRelation(URI, relation)),
    });
  }

  async loadPage(
    page: number,
    per_page: number,
    { relation }: RepositoryFilter,
  ) {
    const { body: list } = await this.client.get<Repository[]>(
      `${this.baseURI}?${buildURLData({
        type: 'public',
        sort: 'pushed',
        page,
        per_page,
      })}`,
    );
    const pageData = await Promise.all(
      list!.map(async item => ({
        ...item,
        ...(await this.getOneRelation(item.full_name, relation)),
      })),
    );
    const [_, organization] = this.baseURI.split('/');

    const { body } = await this.client.get<Organization>(
      `orgs/${organization}`,
    );
    return { pageData, totalCount: body!.public_repos };
  }
}

export default new RepositoryModel();
