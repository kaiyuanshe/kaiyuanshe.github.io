import { SMSCodeInput } from '@kaiyuanshe/kys-service';
import { Dialog, DialogClose, Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { Component, useContext } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { I18nContext } from '../../models/Base/Translation';
import userStore from '../../models/Base/User';

@observer
export class CaptchaButton extends Component {
  componentDidMount() {
    this.refreshImage();
  }

  refreshImage() {
    userStore.createCaptcha();
  }

  render() {
    const { captcha } = userStore;

    return captcha ? (
      <>
        <input type="hidden" name="captchaToken" value={captcha.token} />

        <img src={captcha.link} role="button" onClick={this.refreshImage} />
      </>
    ) : (
      <Loading />
    );
  }
}

export type CaptchaTicket = Required<Omit<SMSCodeInput, 'mobilePhone'>>;

export const captchaDialog = new Dialog<{}, CaptchaTicket>(({ defer }) => {
  const { t } = useContext(I18nContext);

  return (
    <Modal backdrop="static" show={!!defer} onHide={() => defer?.reject(new DialogClose())}>
      <Modal.Header closeButton>
        <Modal.Title>{t('captcha')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={event => {
            event.preventDefault();

            defer?.resolve(formToJSON<CaptchaTicket>(event.currentTarget));
          }}
        >
          <InputGroup>
            <InputGroup.Text>
              <CaptchaButton />
            </InputGroup.Text>
            <Form.Control name="captchaCode" placeholder={t('captcha')} required />
            <Button type="submit" variant="primary">
              {t('confirm')}
            </Button>
          </InputGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
});
