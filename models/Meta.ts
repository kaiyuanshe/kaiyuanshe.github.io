import { observable } from 'mobx';
import { BaseModel, toggle } from 'mobx-restful';

import { client } from './Base';

export type CityCoordinateMap = Record<string, [number, number]>;

export class MetaModel extends BaseModel {
  @observable
  cityCoordinate: CityCoordinateMap = {};

  @toggle('downloading')
  async getCityCoordinate() {
    const { body } = await client.get<CityCoordinateMap>(
      'https://ideapp.dev/public-meta-data/china-city-coordinate.json',
    );
    return (this.cityCoordinate = body!);
  }
}

export default new MetaModel();
