import { User } from '@kaiyuanshe/kys-service';
import { HTTPClient } from 'koajax';
import { makeObservable, observable } from 'mobx';
import { BaseListModel, toggle } from 'mobx-restful';

import { KYS_SERVICE_HOST } from './index';

const { localStorage } = globalThis;

export class UserModel extends BaseListModel<User> {
  constructor() {
    super();
    makeObservable(this);

    if (!this.session) globalThis.localStorage?.clear();
  }

  baseURI = 'user';

  @observable
  session?: User = localStorage?.session && JSON.parse(localStorage.session);

  client = new HTTPClient({
    baseURI: KYS_SERVICE_HOST,
    responseType: 'json',
  }).use(({ request }, next) => {
    if (this.session?.token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${this.session.token}`,
      };
    return next();
  });

  saveSession(user: User) {
    localStorage.session = JSON.stringify(user);

    return (this.session = user);
  }

  @toggle('uploading')
  async signInAuthing(token: string) {
    const { body } = await this.client.post<User>(
      `${this.baseURI}/session/authing`,
      {},
      { Authorization: `Bearer ${token}` },
    );
    return this.saveSession(body!);
  }

  signOut() {
    this.session = undefined;

    localStorage.clear();
  }
}

export default new UserModel();
