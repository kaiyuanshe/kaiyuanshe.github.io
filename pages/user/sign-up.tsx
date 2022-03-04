import { formToJSON } from 'web-utility';
import { FormEvent, PureComponent } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

import PageHead from '../../components/PageHead';

const Name = process.env.NEXT_PUBLIC_SITE_NAME;

export default class SignUpPage extends PureComponent {
  checkPassword(event: FormEvent<HTMLFormElement>) {
    const { password, password_repeat } = formToJSON(event.currentTarget);

    if (password === password_repeat) return;

    event.preventDefault();
    alert('请重新输入一致的密码！');
  }

  render() {
    return (
      <Form
        className="mx-auto my-5 p-5 rounded-3 shadow-sm"
        style={{ maxWidth: '30rem' }}
        method="POST"
        action="/api/user"
        onSubmit={this.checkPassword}
      >
        <PageHead title="注册" />

        <h1 className="mb-5 text-center">注册 {Name}</h1>

        <Form.Group as={Row} className="mb-3" controlId="UserName">
          <Form.Label column sm="3">
            昵称
          </Form.Label>
          <Col sm="9">
            <Form.Control name="username" required />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="Email">
          <Form.Label column sm="3">
            电子邮件
          </Form.Label>
          <Col sm="9">
            <Form.Control type="email" name="email" required />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="Password">
          <Form.Label column sm="3">
            密码
          </Form.Label>
          <Col sm="9">
            <Form.Control type="password" name="password" required />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="RepeatPassword">
          <Form.Label column sm="3">
            重复密码
          </Form.Label>
          <Col sm="9">
            <Form.Control type="password" name="password_repeat" required />
          </Col>
        </Form.Group>

        <Button type="submit" className="w-100 mt-5">
          确定
        </Button>
      </Form>
    );
  }
}
