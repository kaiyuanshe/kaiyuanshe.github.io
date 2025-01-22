import { observable } from 'mobx';
import { BaseModel, persist, restore, toggle } from 'mobx-restful';

import userStore from '../Base/User';

export interface VoteTicket {
  electionName: string;
  publicKey: string;
  signature: string;
}

export class ElectionModel extends BaseModel {
  client = userStore.client;
  algorithm = { name: 'ECDSA', namedCurve: 'P-384' };

  @persist()
  @observable
  accessor privateKey: CryptoKey | undefined;

  @persist()
  @observable
  accessor publicKey = '';

  @persist()
  @observable
  accessor currentVoteTicket: VoteTicket | undefined;

  restored = restore(this, 'Electron');

  @toggle('uploading')
  async makePublicKey() {
    await this.restored;

    if (this.publicKey) return this.publicKey;

    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      this.algorithm,
      true,
      ['sign', 'verify'],
    );
    this.privateKey = privateKey;

    const JWK = await crypto.subtle.exportKey('jwk', publicKey);

    return (this.publicKey = btoa(JSON.stringify(JWK)));
  }

  @toggle('uploading')
  async savePublicKey(electionName: string, jsonWebKey = this.publicKey) {
    const { body } = await this.client.post(
      `election/${electionName}/public-key`,
      { jsonWebKey },
    );
    await userStore.getSession();

    return body!;
  }

  @toggle('uploading')
  async signVoteTicket(electionName: string) {
    await this.makePublicKey();
    await this.savePublicKey(electionName);

    const signature = await crypto.subtle.sign(
      this.algorithm,
      this.privateKey!,
      new TextEncoder().encode(electionName),
    );
    return (this.currentVoteTicket = {
      electionName,
      publicKey: this.publicKey,
      signature: new TextDecoder().decode(signature),
    });
  }
}
