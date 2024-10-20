import { SignInData, SMSCodeInput } from '@kaiyuanshe/kys-service';
import { Dialog, DialogClose } from 'idea-react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { t } from '../../models/Base/Translation';

export const mobilePhoneDialog = new Dialog<
  Partial<SMSCodeInput>,
  SMSCodeInput
>(({ defer, captchaToken, captchaCode, mobilePhone }) => (
  <Modal show={!!defer} onHide={() => defer?.reject(new DialogClose())}>
    <Modal.Header closeButton>
      <Modal.Title>{t('mobile_phone_number')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form
        onSubmit={event => {
          event.preventDefault();

          defer?.resolve(formToJSON<SMSCodeInput>(event.currentTarget));
        }}
      >
        <input type="hidden" name="captchaToken" value={captchaToken} />
        <input type="hidden" name="captchaCode" value={captchaCode} />
        {mobilePhone && (
          <input type="hidden" name="mobilePhone" value={mobilePhone} />
        )}
        <InputGroup>
          {!mobilePhone && (
            <Form.Control
              type="tel"
              name="mobilePhone"
              placeholder={t('mobile_phone_number')}
              required
            />
          )}
          <Button type="submit" variant="outline-primary">
            {t('SMS_code')}
          </Button>
        </InputGroup>
      </Form>
    </Modal.Body>
  </Modal>
));

export const signWithSMSCode = new Dialog<Partial<SMSCodeInput>, SignInData>(
  ({ defer, mobilePhone }) => (
    <Modal show={!!defer} onHide={() => defer?.reject(new DialogClose())}>
      <Modal.Header closeButton>
        <Modal.Title>{t('SMS_code')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          id="SMS-code-form"
          onSubmit={event => {
            event.preventDefault();

            defer?.resolve(formToJSON<SignInData>(event.currentTarget));
          }}
        >
          <input type="tel" hidden name="mobilePhone" value={mobilePhone} />
          <Form.Control name="code" placeholder={t('SMS_code')} required />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant="primary" form="SMS-code-form">
          {t('sign_in')}
        </Button>
      </Modal.Footer>
    </Modal>
  ),
);
