import 'core-js/full/array/from-async';

import {
  Captcha,
  SignInData,
  SMSCodeInput,
  User,
} from '@kaiyuanshe/kys-service';
import { clear } from 'idb-keyval';
import { HTTPClient } from 'koajax';
import { observable } from 'mobx';
import { BaseListModel, persist, restore, toggle } from 'mobx-restful';

import { isServer, KYS_SERVICE_HOST } from './index';

export class UserModel extends BaseListModel<User> {
  baseURI = 'user';
  restored = !isServer() && restore(this, 'User');

  @persist()
  @observable
  accessor session: User | undefined;

  @observable
  accessor captcha: Captcha | undefined;

  client = new HTTPClient({
    baseURI: KYS_SERVICE_HOST,
    responseType: 'json',
  }).use(async ({ request }, next) => {
    await this.restored;

    if (this.session?.token)
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${this.session.token}`,
      };
    return next();
  });

  @toggle('uploading')
  async createCaptcha() {
    const { body } = await this.client.post<Captcha>(
      `${this.baseURI}/session/captcha`,
    );
    return (this.captcha = body!);
  }

  @toggle('uploading')
  async createSMSCode(data: SMSCodeInput) {
    await this.client.post(`${this.baseURI}/session/SMS-code`, data);

    this.captcha = undefined;
  }

  @toggle('uploading')
  async signIn(data: SignInData) {
    const { body } = await this.client.post<User>(
      `${this.baseURI}/session`,
      data,
    );
    return (this.session = body!);
  }

  signOut() {
    this.session = undefined;

    return clear();
  }
}

export default new UserModel();
