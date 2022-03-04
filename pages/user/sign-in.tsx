import { Row, Col, Form, Button } from 'react-bootstrap';

import PageHead from '../../components/PageHead';

const Name = process.env.NEXT_PUBLIC_SITE_NAME;

export default function SignInPage() {
  return (
    <Form
      className="mx-auto my-5 p-5 rounded-3 shadow-sm"
      style={{ maxWidth: '30rem' }}
      method="POST"
      action="/api/user/session"
    >
      <PageHead title="登录" />

      <h1 className="mb-5 text-center">登录 {Name}</h1>

      <Form.Group as={Row} className="mb-3" controlId="Email">
        <Form.Label column sm="3">
          电子邮件
        </Form.Label>
        <Col sm="9">
          <Form.Control type="email" name="identifier" required />
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

      <Button type="submit" className="w-100 mt-5">
        确定
      </Button>
    </Form>
  );
}
