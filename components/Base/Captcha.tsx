import { SMSCodeInput } from '@kaiyuanshe/kys-service';
import { Dialog, Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { Component, MouseEvent } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import userStore from '../../models/Base/User';

@observer
export class CaptchaButton extends Component {
  componentDidMount() {
    this.refreshImage();
  }

  refreshImage(event?: MouseEvent<HTMLInputElement>) {
    event?.preventDefault();
    userStore.createCaptcha();
  }

  render() {
    const { captcha } = userStore;

    return captcha ? (
      <>
        <input type="hidden" name="captchaToken" value={captcha.token} />
        <input type="image" src={captcha.link} onClick={this.refreshImage} />
      </>
    ) : (
      <Loading />
    );
  }
}

export type CaptchaTicket = Required<Omit<SMSCodeInput, 'mobilePhone'>>;

export const captchaDialog = new Dialog(({ defer }) => (
  <Modal show={!!defer}>
    <Modal.Body>
      <Form
        onSubmit={event => {
          event.preventDefault();

          const data = formToJSON<CaptchaTicket>(event.currentTarget);

          userStore.saveSMSCodeInput(data);
          defer?.resolve(data);
        }}
      >
        <InputGroup>
          <InputGroup.Text>
            <CaptchaButton />
          </InputGroup.Text>
          <Form.Control name="captchaCode" required />
        </InputGroup>

        <Button type="submit">√</Button>
      </Form>
    </Modal.Body>
  </Modal>
));
