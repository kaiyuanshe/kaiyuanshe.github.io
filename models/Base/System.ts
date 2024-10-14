import { observable } from 'mobx';
import { BiSearchModelClass } from 'mobx-lark';
import { BaseModel, toggle } from 'mobx-restful';
import { parseURLData, URLData } from 'web-utility';

import { SearchActivityModel } from '../Activity';
import { SearchCommunityModel } from '../Community';
import {
  SearchNGOModel,
  SearchOrganizationModel,
} from '../Community/Organization';
import { SearchMeetingModel } from '../Governance/Meeting';
import { SearchDepartmentModel } from '../Personnel/Department';
import { SearchPersonModel } from '../Personnel/Person';
import { SearchArticleModel } from '../Product/Article';
import { client } from './index';

export type CityCoordinateMap = Record<string, [number, number]>;

export class SystemModel extends BaseModel {
  @observable
  accessor hashQuery: URLData<string> = {};

  @observable
  accessor screenNarrow = false;

  @observable
  accessor cityCoordinate: CityCoordinateMap = {};

  constructor() {
    super();

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
      'https://idea2app.github.io/public-meta-data/china-city-coordinate.json',
    );
    return (this.cityCoordinate = body!);
  }

  searchMap: Record<string, BiSearchModelClass> = {
    member: SearchPersonModel,
    department: SearchDepartmentModel,
    meeting: SearchMeetingModel,
    article: SearchArticleModel,
    activity: SearchActivityModel,
    community: SearchCommunityModel,
    organization: SearchOrganizationModel,
    NGO: SearchNGOModel,
  };
}

export default new SystemModel();
