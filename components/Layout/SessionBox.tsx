import { Loading } from 'idea-react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { HTMLAttributes, MouseEvent } from 'react';

import { i18n, I18nContext } from '../../models/Base/Translation';
import userStore from '../../models/Base/User';
import { captchaDialog } from '../Base/Captcha';
import { mobilePhoneDialog, signWithSMSCode } from '../Base/SMSCode';

export interface SessionBoxProps extends HTMLAttributes<HTMLDivElement> {
  autoCover?: boolean;
}

@observer
export default class SessionBox extends ObservedComponent<SessionBoxProps, typeof i18n> {
  static contextType = I18nContext;

  componentDidMount = () => this.props.autoCover && !userStore.session && this.openModal();

  componentWillUnmount = reaction(() => userStore.session, this.componentDidMount);

  async openModal() {
    const captcha = await captchaDialog.open();

    const smsCodeInput = await mobilePhoneDialog.open(captcha);

    await userStore.createSMSCode(smsCodeInput);

    const signInData = await signWithSMSCode.open(smsCodeInput);

    await userStore.signIn(signInData);

    alert(this.observedContext.t('sign_in_successfully'));
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

        <div {...props} onClickCapture={autoCover || session ? undefined : this.captureInput}>
          {(!autoCover || session) && children}
        </div>
        {uploading > 0 && <Loading />}
      </>
    );
  }
}
