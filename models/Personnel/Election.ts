import { VoteTicket } from '@kaiyuanshe/kys-service';
import { observable } from 'mobx';
import { BaseModel, persist, restore, toggle } from 'mobx-restful';

import { isServer } from '../Base';
import userStore from '../Base/User';

export const buffer2hex = (buffer: ArrayBufferLike) =>
  Array.from(new Uint8Array(buffer), x => x.toString(16).padStart(2, '0')).join(
    '',
  );

export class ElectionModel extends BaseModel {
  client = userStore.client;
  algorithm = { name: 'ECDSA', namedCurve: 'P-384', hash: { name: 'SHA-256' } };

  @persist()
  @observable
  accessor privateKey: CryptoKey | undefined;

  @persist()
  @observable
  accessor publicKey = '';

  @persist()
  @observable
  accessor ticketMap = {} as Record<string, VoteTicket>;

  restored = !isServer() && restore(this, 'Electron');

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
    await userStore.restored;

    const { body } = await this.client.post(
      `election/${electionName}/public-key`,
      { jsonWebKey },
    );
    return body!;
  }

  @toggle('uploading')
  async signVoteTicket(electionName: string) {
    await this.restored;

    let ticket = this.ticketMap[electionName];

    if (ticket) return ticket;

    if (!this.publicKey) await this.makePublicKey();

    await this.savePublicKey(electionName);

    const signature = await crypto.subtle.sign(
      this.algorithm,
      this.privateKey!,
      new TextEncoder().encode(electionName),
    );
    ticket = {
      electionName,
      publicKey: this.publicKey,
      signature: buffer2hex(signature),
    };
    this.ticketMap = { ...this.ticketMap, [electionName]: ticket };

    return ticket;
  }
}
