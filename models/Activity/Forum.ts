import {
  BiDataQueryOptions,
  BiDataTable,
  makeSimpleFilter,
  normalizeTextArray,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';

import { larkClient } from '../Base';

export type Forum = Record<
  | 'id'
  | 'name'
  | `organization${'' | 'Logo' | 'Link' | 'Summary'}`
  | `producer${'' | 'Avatar' | 'Position' | 'Organization'}s`
  | `volunteer${'' | 'Avatar'}s`
  | `${'start' | 'end'}Time`
  | 'location'
  | 'summary'
  | 'standard'
  | 'type'
  | 'status',
  TableCellValue
>;

export class ForumModel extends BiDataTable<Forum>() {
  client = larkClient;

  requiredKeys = ['name', 'summary', 'producers', 'status'] as const;

  sort = { type: 'ASC', startTime: 'ASC' } as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  makeFilter(filter: Partial<NewData<Forum>>) {
    return makeSimpleFilter({ ...filter, status: 'approved' });
  }

  normalize({
    id,
    fields: {
      organization,
      producers,
      volunteers,
      producerPositions,
      producerOrganizations,
      organizationLink,
      organizationSummary,
      location,
      ...data
    },
  }: TableRecord<Forum>) {
    return {
      ...data,
      id: id!,
      organization: (organization as TableCellRelation[])?.[0].text_arr,
      producers: (producers as TableCellRelation[])?.flatMap(
        ({ text_arr }) => text_arr,
      ),
      volunteers: (volunteers as TableCellRelation[])?.flatMap(
        ({ text_arr }) => text_arr,
      ),
      producerPositions:
        producerPositions &&
        normalizeTextArray(producerPositions as TableCellText[]),
      producerOrganizations:
        producerOrganizations &&
        normalizeTextArray(producerOrganizations as TableCellText[]),
      organizationLink:
        organizationLink &&
        normalizeTextArray(organizationLink as TableCellText[]),
      organizationSummary:
        organizationSummary &&
        normalizeTextArray(organizationSummary as TableCellText[]),
      location: location && normalizeTextArray(location as TableCellRelation[]),
    };
  }
}
