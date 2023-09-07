import html2canvas from 'html2canvas';
import { makeObservable, observable } from 'mobx';
import { normalizeText, TableCellLink, TableCellText } from 'mobx-lark';
import { BaseModel, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { SearchQuery, SearchResult } from '../../pages/api/search';
import { client } from './index';

export type CityCoordinateMap = Record<string, [number, number]>;

export class SystemModel extends BaseModel {
  @observable
  screenNarrow = false;

  @observable
  cityCoordinate: CityCoordinateMap = {};

  constructor() {
    super();
    makeObservable(this);

    this.updateScreen();

    globalThis.addEventListener?.('resize', this.updateScreen);
  }

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

  @toggle('uploading')
  async convertToImageURI(
    element: HTMLElement,
    type?: string,
    quality?: number,
  ) {
    const canvas = await html2canvas(element, { useCORS: true });

    return new Promise<string>((resolve, reject) =>
      canvas.toBlob(
        blob => (blob ? resolve(URL.createObjectURL(blob)) : reject()),
        type,
        quality,
      ),
    );
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
