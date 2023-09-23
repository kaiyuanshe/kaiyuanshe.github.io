import { Guard } from '@authing/guard';
import { User } from '@kaiyuanshe/kys-service';
import { HTTPClient } from 'koajax';
import { makeObservable, observable } from 'mobx';
import { BaseModel, toggle } from 'mobx-restful';

import { KYS_SERVICE_HOST } from './index';

const { localStorage } = globalThis;

export const guard = new Guard({
  mode: 'modal',
  appId: process.env.NEXT_PUBLIC_AUTHING_APP_ID!,
});

export class UserModel extends BaseModel {
  constructor() {
    super();
    makeObservable(this);
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

  @toggle('uploading')
  async signOut() {
    await guard.logout();

    this.session = undefined;

    localStorage.clear();
  }
}

export default new UserModel();
