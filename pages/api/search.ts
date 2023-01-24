import { parseURLData } from 'web-utility';
import { NextApiResponse } from 'next';

import { safeAPI } from './base';
import { getBITableList, MAIN_BASE_ID, makeFilter } from '../../models/Lark';
import {
  BaseArticle,
  ARTICLE_BASE_ID,
  ARTICLE_TABLE_ID,
} from '../../models/Article';
import { Member, MEMBER_TABLE_ID } from '../../models/Member';
import { Group, GROUP_TABLE_ID } from '../../models/Group';
import { Organization, ORGANIZATION_TABLE_ID } from '../../models/Organization';
import { Activity, ACTIVITY_TABLE_ID } from '../../models/Activity';

export type SearchQuery = Partial<Record<'keywords' | 'tag', string>>;

export interface SearchResult {
  activities: Activity[];
  articles: BaseArticle[];
  members: Member[];
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
          var [
            { items: articles },
            { items: activities },
            { items: groups },
            { items: organizations },
          ] = await Promise.all([
            getBITableList<BaseArticle>({
              database: ARTICLE_BASE_ID,
              table: ARTICLE_TABLE_ID,
              filter: makeFilter(
                {
                  title: keywordList,
                  author: keywordList,
                  tags: tag,
                  summary: keywordList,
                  alias: keywordList,
                },
                'OR',
              ),
            }),
            getBITableList<Activity>({
              database: MAIN_BASE_ID,
              table: ACTIVITY_TABLE_ID,
              filter: makeFilter(
                {
                  name: keywordList,
                  city: keywordList,
                  location: keywordList,
                  organizers: tag,
                },
                'OR',
              ),
            }),
            getBITableList<Group>({
              table: GROUP_TABLE_ID,
              filter: makeFilter(
                {
                  fullName: keywordList,
                  leader: keywordList,
                  members: keywordList,
                  tags: tag,
                  summary: keywordList,
                  link: keywordList,
                  codeLink: keywordList,
                },
                'OR',
              ),
            }),
            getBITableList<Organization>({
              table: ORGANIZATION_TABLE_ID,
              filter: makeFilter(
                {
                  name: keywordList,
                  tags: tag,
                  summary: keywordList,
                  city: keywordList,
                  link: keywordList,
                  codeLink: keywordList,
                  wechatName: keywordList,
                },
                'OR',
              ),
            }),
          ]);

        if (keywordList)
          var { items: members } = await getBITableList<Member>({
            table: MEMBER_TABLE_ID,
            filter: makeFilter(
              { name: keywordList, nickname: keywordList },
              'OR',
            ),
          });

        response.json({
          articles:
            // @ts-ignore
            articles?.map(({ id, fields }) => ({ ...fields, id: id! })) || [],
          activities:
            // @ts-ignore
            activities?.map(({ id, fields }) => ({ ...fields, id: id! })) || [],
          members:
            // @ts-ignore
            members?.map(({ id, fields }) => ({ ...fields, id: id! })) || [],
          groups:
            // @ts-ignore
            groups?.map(({ id, fields }) => ({ ...fields, id: id! })) || [],
          organizations:
            // @ts-ignore
            organizations
              ?.filter(({ fields: { verified } }) => verified === '是')
              .map(({ id, fields }) => ({ ...fields, id: id! })) || [],
        });
      }
    }
  },
);
