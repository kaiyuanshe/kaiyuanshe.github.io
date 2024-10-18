import { observer } from 'mobx-react';
import { Component, MouseEvent, PropsWithChildren } from 'react';

import userStore from '../../models/Base/User';
import { captchaDialog } from '../Base/Captcha';
import { signWithSMSCode } from '../Base/SMSCode';

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

  async openModal() {
    await captchaDialog.open();

    await signWithSMSCode.open();
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
        <captchaDialog.Component />
        <signWithSMSCode.Component />
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
