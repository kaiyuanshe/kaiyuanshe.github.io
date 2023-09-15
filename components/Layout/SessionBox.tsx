import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { observePropsState } from 'mobx-react-helper';
import { Component, MouseEvent, PropsWithChildren } from 'react';

import { guard } from '../../models/Base/User';

export type SessionBoxProps = PropsWithChildren<{
  className?: string;
  autoCover?: boolean;
}>;

@observer
@observePropsState
export default class SessionBox extends Component<SessionBoxProps> {
  declare observedProps: SessionBoxProps;

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

    const { token, tokenExpiredAt } = await guard.start('#authing-modal');

    localStorage.tokenExpiredAt = tokenExpiredAt;

    this.closeModal();
  }

  captureInput = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    this.openModal();
  };

  render() {
    const { className, autoCover, children } = this.props;

    return (
      <>
        <head>
          <link
            rel="stylesheet"
            href="https://cdn.authing.co/packages/guard/5.2.0/guard.min.css"
          />
        </head>
        <div
          className={className}
          onClickCapture={autoCover ? undefined : this.captureInput}
        >
          {!autoCover && children}
        </div>
      </>
    );
  }
}
