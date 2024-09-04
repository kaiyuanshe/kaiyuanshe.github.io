import { HTTPError } from 'koajax';
import { action, computed, observable } from 'mobx';
import {
  BiDataQueryOptions,
  BiDataTable,
  BITable,
  BiTable,
  BiTableView,
  LarkPageData,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { Filter, NewData, toggle } from 'mobx-restful';
import { buildURLData, cache, countBy, Hour, isEmpty } from 'web-utility';

import {
  LarkFormData,
  MAIN_BASE_ID,
  TableFormViewItem,
} from '../../pages/api/lark/core';
import { larkClient } from '../Base';
import { AgendaModel } from './Agenda';
import { BillModel } from './Bill';
import { EvaluationModel } from './Evaluation';
import { ForumModel } from './Forum';
import { GiftModel } from './Gift';
import { PlaceModel } from './Place';
import { StaffModel } from './Staff';

export const ACTIVITY_TABLE_ID = process.env.NEXT_PUBLIC_ACTIVITY_TABLE_ID!;

export type Activity = Record<
  | 'id'
  | 'name'
  | 'startTime'
  | 'endTime'
  | 'city'
  | 'location'
  | 'organizers'
  | 'link'
  | 'image'
  | 'cardImage'
  | 'database'
  | 'alias',
  TableCellValue
>;

export type ActivityStatistic = Record<'city', Record<string, number>>;

export class ActivityViewModel extends BiTableView() {
  client = larkClient;
}

export class ActivityTableModel extends BiTable() {
  constructor(
    id = '',
    public loadForm = false,
  ) {
    super(id);
  }

  client = larkClient;

  @observable
  accessor formMap = {} as Record<string, TableFormViewItem[]>;

  async *loadFormStream() {
    for (const { table_id, name } of this.allItems) {
      const views = await new ActivityViewModel(this.id, table_id).getAll(),
        forms: TableFormViewItem[] = [];

      for (const { view_type, view_id } of views)
        if (view_type === 'form') {
          const { body } = await this.client.get<LarkFormData>(
            `${this.baseURI}/${table_id}/forms/${view_id}`,
          );
          forms.push(body!.data!.form);
        }
      yield [name, forms] as const;
    }
  }

  @action
  @toggle('downloading')
  // @ts-ignore
  async getAll(filter?: Filter<BITable>, pageSize?: number) {
    // @ts-ignore
    const tables = await super.getAll(filter, pageSize);

    if (this.loadForm) {
      const formList: (readonly [string, TableFormViewItem[]])[] = [];

      for await (const item of this.loadFormStream()) formList.push(item);

      this.formMap = Object.fromEntries(formList);
    }
    return tables;
  }
}

export class ActivityModel extends BiDataTable<Activity>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = ACTIVITY_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['name', 'startTime', 'image'] as const;

  sort = { startTime: 'DESC' } as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @observable
  accessor formMap = {} as ActivityTableModel['formMap'];

  static SubModel = {
    Person: StaffModel,
    Forum: ForumModel,
    Agenda: AgendaModel,
    Evaluation: EvaluationModel,
    Place: PlaceModel,
    Gift: GiftModel,
    Bill: BillModel,
  };

  currentPerson?: StaffModel;
  currentForum?: ForumModel;

  @observable
  accessor currentAgenda: AgendaModel | undefined;

  @observable
  accessor currentEvaluation: EvaluationModel | undefined;

  currentPlace?: PlaceModel;
  currentGift?: GiftModel;
  currentBill?: BillModel;

  declare statistic: ActivityStatistic;

  @computed
  get currentMeta() {
    const list =
      this.currentAgenda?.allItems.filter(
        ({ startTime, endTime }) => startTime && endTime,
      ) || [];
    const { startTime } = list[0] || {},
      { endTime } = list.slice(-1)[0] || {};
    const { Person, Agenda, Evaluation, File, Bill } = this.formMap;

    return {
      startTime,
      endTime,
      personForms: Person?.filter(({ shared_url }) => shared_url),
      agendaForms: Agenda?.filter(({ shared_url }) => shared_url),
      evaluationForms: Evaluation?.filter(({ shared_url }) => shared_url),
      fileForms: File?.filter(({ shared_url }) => shared_url),
      billForms: Bill?.filter(({ shared_url }) => shared_url),
    };
  }

  normalize({
    id,
    fields: { organizers, link, database, ...fields },
  }: TableRecord<Activity>) {
    return {
      ...fields,
      id: id!,
      organizers: (organizers as TableCellRelation[])?.map(normalizeText),
      link: (link as TableCellLink)?.link,
      database: (database as TableCellLink)?.link,
    };
  }

  static getLink({
    id,
    alias,
    link,
    database,
  }: Pick<Activity, 'id' | 'alias' | 'link' | 'database'>) {
    return database ? `/activity/${alias || id}` : link + '';
  }

  @toggle('downloading')
  async getOneByAlias(alias: string) {
    const path = `${this.baseURI}?${buildURLData({
      filter: makeSimpleFilter({ alias }, '='),
    })}`;
    const { body } =
      await this.client.get<LarkPageData<TableRecord<Activity>>>(path);
    const [item] = body!.data!.items || [];

    if (!item)
      throw new HTTPError(
        `Activity "${alias}" is not found`,
        { method: 'GET', path },
        { status: 404, statusText: 'Not found', headers: {} },
      );
    return (this.currentOne = this.normalize(item));
  }

  @toggle('downloading')
  async getOne(id: string, loadForm = false) {
    try {
      await super.getOne(id);
    } catch (error) {
      await this.getOneByAlias(id);
    }

    const { database } = this.currentOne;

    if (database) {
      const dbName = new URL(database + '').pathname.split('/').at(-1)!;

      const table = new ActivityTableModel(dbName, loadForm);

      for (const [name, Class] of Object.entries(ActivityModel.SubModel)) {
        // @ts-ignore
        await table.getOne(name, Class);

        Reflect.set(this, `current${name}`, table.currentDataTable);
      }

      this.formMap = table.formMap;
    }
    return this.currentOne;
  }

  getStatistic = cache(async clean => {
    const list = await this.getAll();

    setTimeout(clean, Hour / 2);

    return (this.statistic = { city: countBy(list, 'city') });
  }, 'Activity Statistic');
}

export type StatisticTrait = Pick<ActivityModel, 'statistic' | 'getStatistic'>;

export class SearchActivityModel extends ActivityModel {
  makeFilter(filter: NewData<Activity>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}

export default new ActivityModel();
