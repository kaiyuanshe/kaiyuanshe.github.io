import { components } from '@octokit/openapi-types';
import { memoize } from 'lodash';
import { ListModel, toggle } from 'mobx-restful';
import { averageOf, buildURLData } from 'web-utility';

import { githubClient } from './Base';

type Repository = components['schemas']['minimal-repository'];

export interface GitRepository extends Repository {
  issues?: any;
}
export type Organization = components['schemas']['organization-full'];

const getGitIssues = memoize(async (URI: string) => {
  const { body: issuesList } = await githubClient.get<Record<string, number>>(
    `repos/${URI}/issues`,
  );
  console.log('issueCount====', issuesList);
  //   const issueAverage = averageOf(...Object.values(issueCount!));

  //   const issuesList = Object.entries(issueCount!)
  //     .filter(([_, score]) => score >= issueAverage)
  //     .sort(([_, a], [__, b]) => b - a);

  //   return issuesList.map(([name]) => name);
  return issuesList;
});

export class RepositoryModel extends ListModel<GitRepository> {
  client = githubClient;
  baseURI = 'orgs/kaiyuanshe/repos';
  indexKey = 'full_name' as const;

  @toggle('downloading')
  async getOne(URI: string) {
    const { body } = await this.client.get<Repository>(`repos/${URI}`);
    console.log('body ===', body);
    return (this.currentOne = {
      ...body!,
      issues: await getGitIssues(URI),
    });
  }

  async loadPage(page: number, per_page: number) {
    const { body: list } = await this.client.get<Repository[]>(
      `${this.baseURI}?${buildURLData({
        type: 'public',
        sort: 'pushed',
        page,
        per_page,
      })}`,
    );
    const pageData = await Promise.all(
      list!.map(async ({ full_name, ...item }) => {
        const issues = await getGitIssues(full_name);
        console.log('issues===', full_name, issues);
        return {
          ...item,
          full_name,
          issues,
        };
      }),
    );
    const [_, organization] = this.baseURI.split('/');

    const { body } = await this.client.get<Organization>(
      `orgs/${organization}`,
    );
    console.log('body===', pageData);
    return { pageData, totalCount: body!.public_repos };
  }
}

export default new RepositoryModel();
