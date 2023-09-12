import { NextApiResponse } from 'next';
import { parseURLData } from 'web-utility';

import { Activity, SearchActivityModel } from '../../models/Activity';
import {
  Organization,
  SearchOrganizationModel,
} from '../../models/Organization/Organization';
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
}

export default safeAPI(
  async ({ method, url }, response: NextApiResponse<SearchResult>) => {
    switch (method) {
      case 'GET': {
        const { keywords, tag } = parseURLData(url) as SearchQuery;
        const keywordList = keywords?.split(/\s+/);

        if (keywordList || tag)
          var [articles, activities, groups, organizations] = await Promise.all(
            [
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
            ],
          );
        if (keywordList)
          var people = await new SearchPersonModel().getList({
            name: keywordList,
            email: keywordList,
            summary: keywordList,
          });
        //@ts-ignore
        const membersData = { people };
        //@ts-ignore
        const articlesData = { articles, activities, groups, organizations };
        //@ts-ignore
        response.json({ ...articlesData, ...membersData });
      }
    }
  },
);
