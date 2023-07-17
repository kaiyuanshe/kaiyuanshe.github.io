import {
    BiDataTable,
    makeSimpleFilter,
    normalizeText,
    TableCellLink,
    TableCellValue,
    TableRecordList,
  } from 'mobx-lark';
  import { NewData } from 'mobx-restful';
  import { isEmpty } from 'web-utility';

  import { MAIN_BASE_ID } from '../pages/api/lark/core';
  import { larkClient } from './Base';
  
  export const HONORWALL_TABLE_ID = process.env.NEXT_PUBLIC_HONORWALL_TABLE_ID!;
  
  export type HonorWall = Record<
    | 'id'
    | 'member'
    | 'volunteer'
    | 'otherWinners'
    | 'reward'
    | 'relatedTweets'
    | 'project'
    | 'mGithubId'
    | 'vGithubId'
    | 'date',
    TableCellValue
  >;
  
  export class HonorWallModel extends BiDataTable<HonorWall>() {
    client = larkClient;
  
    constructor(appId = MAIN_BASE_ID, tableId = HONORWALL_TABLE_ID) {
      super(appId, tableId);
    }
  
    requiredKeys = ['date'] as const;
  
    normalize({
      id,
      fields: { ...fields },
    }: TableRecordList<HonorWall>['data']['items'][number]) {
      return {
        ...fields,
        id: id!,
        mGithubId: normalizeText(fields.mGithubId as TableCellLink),
      };
    }
  
    async getStatic() {
      const list = await this.getAll();
      list.forEach(item=>{
        console.log("ff",item);
        
      })
      this.clear();
      return ""
    }
  }
  
  export class SearchHonorWallModel extends HonorWallModel {
    makeFilter(filter: NewData<HonorWall>) {
      return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
    }
  }