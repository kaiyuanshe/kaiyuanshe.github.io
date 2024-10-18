import { SMSCodeInput } from '@kaiyuanshe/kys-service';
import { Dialog, SpinnerButton } from 'idea-react';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Form, InputGroup, Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import userStore from '../../models/Base/User';

export interface SMSCodeFormProps extends Partial<SMSCodeInput> {
  onSend?: (data: SMSCodeInput) => any;
}

export const SMSCodeForm: FC<SMSCodeFormProps> = observer(
  ({ captchaToken, captchaCode, mobilePhone, onSend }) => (
    <Form
      onSubmit={async event => {
        event.preventDefault();

        const data = formToJSON<SMSCodeInput>(event.currentTarget);

        await userStore.createSMSCode(data);

        onSend?.(data);
      }}
    >
      <input type="hidden" name="captchaToken" value={captchaToken} />
      <input type="hidden" name="captchaCode" value={captchaCode} />
      {mobilePhone && (
        <input type="hidden" name="mobilePhone" value={mobilePhone} />
      )}
      <InputGroup>
        {!mobilePhone && (
          <Form.Control type="tel" name="mobilePhone" required />
        )}
        <SpinnerButton
          type="submit"
          loading={userStore.uploading > 0}
          disabled={!userStore.captcha}
        >
          ✉️
        </SpinnerButton>
      </InputGroup>
    </Form>
  ),
);

export const signWithSMSCode = new Dialog(({ defer }) => {
  const { captchaToken, captchaCode, mobilePhone } = userStore.smsCodeInput;

  return (
    <Modal show={!!defer}>
      <Modal.Body>
        <SMSCodeForm
          {...{ captchaToken, captchaCode }}
          onSend={defer?.resolve}
        />

        <Form
          onSubmit={async event => {
            event.preventDefault();

            await userStore.signIn(formToJSON(event.currentTarget));

            defer?.resolve();
          }}
        >
          <input type="hidden" name="mobilePhone" value={mobilePhone} />
          <Form.Control name="code" required />

          <SpinnerButton type="submit" loading={userStore.uploading > 0}>
            √
          </SpinnerButton>
        </Form>
      </Modal.Body>
    </Modal>
  );
});
