import { makeObservable, observable } from 'mobx';
import { normalizeText, TableCellLink, TableCellText } from 'mobx-lark';
import { BaseModel, toggle } from 'mobx-restful';
import { buildURLData, parseURLData, URLData } from 'web-utility';

import { SearchQuery, SearchResult } from '../../pages/api/search';
import { client } from './index';

export type CityCoordinateMap = Record<string, [number, number]>;

export class SystemModel extends BaseModel {
  @observable
  hashQuery: URLData<string> = {};

  @observable
  screenNarrow = false;

  @observable
  cityCoordinate: CityCoordinateMap = {};

  constructor() {
    super();
    makeObservable(this);

    this.updateHashQuery();
    this.updateScreen();

    globalThis.addEventListener?.('hashchange', this.updateHashQuery);
    globalThis.addEventListener?.('resize', this.updateScreen);
  }

  updateHashQuery = () =>
    (this.hashQuery = parseURLData(
      globalThis.location?.hash.split('?')[1] || '',
    ) as URLData<string>);

  updateScreen = () =>
    (this.screenNarrow =
      globalThis.innerWidth < globalThis.innerHeight ||
      globalThis.innerWidth < 992);

  @toggle('downloading')
  async getCityCoordinate() {
    const { body } = await client.get<CityCoordinateMap>(
      'https://ideapp.dev/public-meta-data/china-city-coordinate.json',
    );
    return (this.cityCoordinate = body!);
  }

  @toggle('downloading')
  async search(query: SearchQuery) {
    const { body } = await client.get<SearchResult>(
      `search?${buildURLData(query)}`,
    );
    const activities = body!.activities?.map(
      ({ link, organizers, ...activity }) => ({
        ...activity,
        link: (link as TableCellLink)?.link,
        organizers: (organizers as TableCellText[])?.map(normalizeText),
      }),
    );
    return { ...body!, activities };
  }
}

export default new SystemModel();
