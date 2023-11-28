import { NextApiResponse } from 'next';
import { parseURLData } from 'web-utility';

import { Activity, SearchActivityModel } from '../../models/Activity';
import { Community, SearchCommunityModel } from '../../models/Community';
import {
  Organization,
  SearchOrganizationModel,
} from '../../models/Community/Organization';
import {
  Department,
  SearchDepartmentModel,
} from '../../models/Personnel/Department';
import { Person, SearchPersonModel } from '../../models/Personnel/Person';
import { BaseArticle, SearchArticleModel } from '../../models/Product/Article';
import { safeAPI } from './base';

export type SearchQuery = Partial<Record<'keywords' | 'tag', string>>;

export interface SearchResult {
  activities?: Activity[];
  articles?: BaseArticle[];
  people?: Person[];
  departments?: Department[];
  organizations?: Organization[];
  communities?: Community[];
}

export default safeAPI(
  async ({ method, url }, response: NextApiResponse<SearchResult>) => {
    switch (method) {
      case 'GET': {
        const { keywords, tag } = parseURLData(url) as SearchQuery;
        const keywordList = keywords?.split(/\s+/);
        if (keywordList || tag)
          var [articles, activities, departments, organizations] =
            await Promise.all([
              new SearchArticleModel().getList({
                title: keywordList,
                author: keywordList,
                tags: tag,
                summary: keywordList,
                alias: keywordList,
              }),
              new SearchActivityModel().getList({
                name: keywordList,
                city: keywordList,
                location: keywordList,
                organizers: tag,
              }),
              new SearchDepartmentModel().getList({
                tags: tag,
                summary: keywordList,
                link: keywordList,
                codeLink: keywordList,
              }),
              new SearchOrganizationModel().getList({
                name: keywordList,
                tags: tag,
                summary: keywordList,
                city: keywordList,
                link: keywordList,
                codeLink: keywordList,
                wechatName: keywordList,
              }),
            ]);
        if (keywordList)
          var [people, communities] = await Promise.all([
            new SearchPersonModel().getList({
              name: keywordList,
              email: keywordList,
              summary: keywordList,
            }),
            new SearchCommunityModel().getList({
              name: keywordList,
              summary: keywordList,
            }),
          ]);

        //@ts-ignore
        const membersData = { people, communities };
        //@ts-ignore
        const articlesData = {
          articles,
          activities,
          departments,
          organizations,
        };
        //@ts-ignore
        response.json({ ...articlesData, ...membersData });
      }
    }
  },
);
