import { NextApiResponse } from 'next';
import { parseURLData } from 'web-utility';

import { Activity, SearchActivityModel } from '../../models/Activity';
import { BaseArticle, SearchArticleModel } from '../../models/Article';
import { SearchExpertModel } from '../../models/Expert';
import { Group, SearchGroupModel } from '../../models/Group';
import { Member, SearchMemberModel } from '../../models/Member';
import {
  Organization,
  SearchOrganizationModel,
} from '../../models/Organization';
import { safeAPI } from './base';

export type SearchQuery = Partial<Record<'keywords' | 'tag', string>>;

export interface SearchResult {
  activities: Activity[];
  articles: BaseArticle[];
  members: Member[];
  expert: Member[];
  groups: Group[];
  organizations: Organization[];
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
              new SearchGroupModel().getList({
                fullName: keywordList,
                leader: keywordList,
                members: keywordList,
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
          var [members, expert] = await Promise.all([
            new SearchMemberModel().getList({
              name: keywordList,
              nickname: keywordList,
            }),
            new SearchExpertModel().getList({
              name: keywordList,
              nickname: keywordList,
            }),
          ]);
        //@ts-ignore
        const membersData = { members, expert };
        //@ts-ignore
        const articlesData = { articles, activities, groups, organizations };
        //@ts-ignore
        response.json({ ...articlesData, ...membersData });
      }
    }
  },
);
