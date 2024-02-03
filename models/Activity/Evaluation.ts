import { computed } from 'mobx';
import { BiDataQueryOptions, BiDataTable, TableCellValue } from 'mobx-lark';
import { averageOf } from 'web-utility';

import { larkClient } from '../Base';
import userStore from '../Base/User';

export type Evaluation = Record<
  | 'id'
  | 'createdAt'
  | 'phone'
  | 'agenda'
  | `${'content' | 'speech' | 'document' | 'mentor' | 'device'}Score`
  | 'score'
  | 'suggestion',
  TableCellValue
>;

export class EvaluationModel extends BiDataTable<Evaluation>() {
  client = larkClient;
  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @computed
  get currentScore() {
    return averageOf(...this.allItems.map(({ score }) => score as number)) || 0;
  }

  async getUserCount() {
    try {
      const { length } = await this.getAll({
        phone: userStore.session?.mobilePhone,
      });
      return length;
    } catch {}
  }
}
