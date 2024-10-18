import {
  Captcha,
  SignInData,
  SMSCodeInput,
  User,
} from '@kaiyuanshe/kys-service';
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

  @observable
  accessor smsCodeInput: Partial<SMSCodeInput> = {};

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

  @toggle('uploading')
  async createCaptcha() {
    const { body } = await this.client.post<Captcha>('session/captcha');

    return (this.captcha = body!);
  }

  saveSMSCodeInput(data: Partial<SMSCodeInput>) {
    return (this.smsCodeInput = { ...this.smsCodeInput, ...data });
  }

  @toggle('uploading')
  async createSMSCode(data: SMSCodeInput) {
    await this.client.post('session/code', data);

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
  }
}

export default new UserModel();
