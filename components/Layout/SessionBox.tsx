import { Guard } from '@authing/guard';
import { observer } from 'mobx-react';
import Head from 'next/head';
import { Component, MouseEvent, PropsWithChildren } from 'react';

import userStore from '../../models/Base/User';

export const guard = new Guard({
  mode: 'modal',
  appId: process.env.NEXT_PUBLIC_AUTHING_APP_ID!,
});

export type SessionBoxProps = PropsWithChildren<{
  className?: string;
  autoCover?: boolean;
}>;

@observer
export default class SessionBox extends Component<SessionBoxProps> {
  componentDidMount() {
    const { autoCover } = this.props;

    if (autoCover) this.openModal();
  }

  closeModal = () => {
    guard.hide();

    document.scrollingElement?.classList.remove('overflow-hidden');
  };

  async openModal() {
    if (+new Date(localStorage.tokenExpiredAt) > Date.now()) return;

    document.scrollingElement?.classList.add('overflow-hidden');

    guard.on('close', this.closeModal);
    guard.on('login-error', this.closeModal);

    const { token, tokenExpiredAt } = await guard.start();

    localStorage.tokenExpiredAt = tokenExpiredAt;

    await userStore.signInAuthing(token!);

    this.closeModal();
  }

  captureInput = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    this.openModal();
  };

  render() {
    const { className, autoCover, children } = this.props,
      { session } = userStore;

    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.authing.co/packages/guard/5.3.0/guard.min.css"
          />
        </Head>
        <div
          className={className}
          onClickCapture={autoCover || session ? undefined : this.captureInput}
        >
          {(!autoCover || session) && children}
        </div>
      </>
    );
  }
}
