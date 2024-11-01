import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { Component, HTMLAttributes, MouseEvent } from 'react';

import { t } from '../../models/Base/Translation';
import userStore from '../../models/Base/User';
import { captchaDialog } from '../Base/Captcha';
import { mobilePhoneDialog, signWithSMSCode } from '../Base/SMSCode';

export interface SessionBoxProps extends HTMLAttributes<HTMLDivElement> {
  autoCover?: boolean;
}

@observer
export default class SessionBox extends Component<SessionBoxProps> {
  componentDidMount() {
    const { autoCover } = this.props;

    if (autoCover) this.openModal();
  }

  async openModal() {
    const captcha = await captchaDialog.open();

    const smsCodeInput = await mobilePhoneDialog.open(captcha);

    await userStore.createSMSCode(smsCodeInput);

    const signInData = await signWithSMSCode.open(smsCodeInput);

    await userStore.signIn(signInData);

    alert(t('sign_in_successfully'));
  }

  captureInput = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    this.openModal();
  };

  render() {
    const { autoCover, children, ...props } = this.props,
      { uploading, session } = userStore;

    return (
      <>
        <captchaDialog.Component />
        <mobilePhoneDialog.Component />
        <signWithSMSCode.Component />
        <div
          {...props}
          onClickCapture={autoCover || session ? undefined : this.captureInput}
        >
          {(!autoCover || session) && children}
        </div>

        {uploading > 0 && <Loading />}
      </>
    );
  }
}
