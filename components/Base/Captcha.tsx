import { SMSCodeInput } from '@kaiyuanshe/kys-service';
import { Dialog, DialogClose, Loading } from 'idea-react';
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

export const captchaDialog = new Dialog<{}, CaptchaTicket>(({ defer }) => (
  <Modal show={!!defer} onHide={() => defer?.reject(new DialogClose())}>
    <Modal.Header closeButton>
      <Modal.Title>🔒</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form
        id="captcha-form"
        onSubmit={event => {
          event.preventDefault();

          defer?.resolve(formToJSON<CaptchaTicket>(event.currentTarget));
        }}
      >
        <InputGroup>
          <InputGroup.Text>
            <CaptchaButton />
          </InputGroup.Text>
          <Form.Control name="captchaCode" required />
        </InputGroup>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button type="submit" variant="primary" form="captcha-form">
        √
      </Button>
    </Modal.Footer>
  </Modal>
));
