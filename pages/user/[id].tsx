import { formToJSON } from 'web-utility';
import { FormEvent, PureComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { TimeDistance, Avatar, FilePicker } from 'idea-react';

import { TimeOption } from '../../components/data';
import PageHead from '../../components/PageHead';

import { NewForm, call } from '../api/base';
import { Gender, GenderName, User } from '../api/user';
import { getSession, setSession } from '../api/user/session';
import { uploadFile } from '../api/file';

const { NEXT_PUBLIC_API_HOST } = process.env;

export async function getServerSideProps({
  req,
  res,
  params,
}: GetServerSidePropsContext<{ id: string }>) {
  const props = await call<User>(`users/${params?.id}`, 'GET', null, {
    req,
    res,
  });
  const full =
    params?.id === 'me' &&
    (await call<User>(`users/${props.id}`, 'GET', null, { req, res }));

  return { props: full || props };
}

interface State {
  editing?: boolean;
  updating?: boolean;
}

export default class UserProfilePage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>,
  State
> {
  state: Readonly<State> = {};

  save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      this.setState({ updating: true });

      const { avatar, ...data } = formToJSON<NewForm<User>>(
        event.currentTarget,
      );
      const user = await call<User>('user/session', 'PATCH', {
        ...data,
        avatar: avatar && this.props.avatar?.id,
      });
      const savedAvatar =
        avatar?.startsWith('blob:') &&
        (await uploadFile(
          avatar,
          'user',
          user.id,
          'avatar',
          'users-permissions',
        ));
      setSession(savedAvatar ? { ...user, avatar: savedAvatar } : user);

      if (savedAvatar) location.reload();
      else this.setState({ editing: false });
    } finally {
      this.setState({ updating: false });
    }
  };

  renderForm() {
    const { id, username, email, gender, summary, address, avatar, createdAt } =
        this.props,
      { editing, updating } = this.state;
    const isMe = getSession().id === id;

    return (
      <Form
        className="col-10 py-4 px-md-5"
        onSubmit={this.save}
        onReset={event => {
          event.preventDefault();
          this.setState({ editing: false });
        }}
      >
        <Form.Group as={Row} className="mb-3" controlId="avatar">
          <Form.Label column sm="2">
            头像
          </Form.Label>
          <Col sm="10">
            {editing ? (
              <FilePicker
                accept="image/*"
                name="avatar"
                defaultValue={
                  avatar &&
                  [avatar].map(
                    ({ url }) => new URL(url, NEXT_PUBLIC_API_HOST) + '',
                  )
                }
              />
            ) : (
              <Avatar
                size={5}
                src={avatar && new URL(avatar.url, NEXT_PUBLIC_API_HOST) + ''}
              />
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="username">
          <Form.Label column sm="2">
            用户名
          </Form.Label>
          <Col sm="10">
            <Form.Control
              name="username"
              required
              defaultValue={username}
              readOnly={!editing}
              plaintext={!editing}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="email">
          <Form.Label column sm="2">
            电子邮件
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="email"
              name="email"
              required
              defaultValue={email}
              readOnly={!editing}
              plaintext={!editing}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="gender">
          <Form.Label column sm="2">
            性别
          </Form.Label>
          <Col sm="10">
            <Form.Control as="select" disabled={!editing} plaintext={!editing}>
              {Object.entries(GenderName).map(([value, name]) => (
                <option
                  key={value}
                  value={value}
                  selected={value === (gender || Gender.Other)}
                >
                  {name}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="summary">
          <Form.Label column sm="2">
            个人简介
          </Form.Label>
          <Col sm="10">
            <Form.Control
              as="textarea"
              name="summary"
              defaultValue={summary}
              readOnly={!editing}
              plaintext={!editing}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="address">
          <Form.Label column sm="2">
            常居地
          </Form.Label>
          <Col sm="10">
            <InputGroup as="fieldset" name="address">
              <Form.Control
                name="country"
                required
                defaultValue={address?.country}
                placeholder="国家/地区"
                readOnly={!editing}
                plaintext={!editing}
              />
              <Form.Control
                name="province"
                required
                defaultValue={address?.province}
                placeholder="省/州/特区"
                readOnly={!editing}
                plaintext={!editing}
              />
              <Form.Control
                name="city"
                defaultValue={address?.city}
                placeholder="市"
                readOnly={!editing}
                plaintext={!editing}
              />
            </InputGroup>
          </Col>
        </Form.Group>

        {!editing && (
          <Form.Group
            as={Row}
            className="mb-3 align-items-center"
            controlId="address"
          >
            <Form.Label column sm="2">
              入驻时间
            </Form.Label>
            <Col sm="10">
              <TimeDistance {...TimeOption} date={createdAt} />
            </Col>
          </Form.Group>
        )}

        <footer className="text-center">
          {editing ? (
            <>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={updating}
              >
                提交
              </Button>
              <Button className="ms-4" type="reset" variant="danger" size="lg">
                取消
              </Button>
            </>
          ) : (
            isMe && (
              <Button
                type="button"
                variant="warning"
                size="lg"
                onClick={event => {
                  event.preventDefault();
                  this.setState({ editing: true });
                }}
              >
                编辑
              </Button>
            )
          )}
        </footer>
      </Form>
    );
  }

  render() {
    const { id, username } = this.props;

    return (
      <Container>
        <PageHead title={`${username}的个人资料`} />

        <Row>
          {this.renderForm()}

          <ListGroup className="col-2 py-4 text-center">
            <ListGroup.Item active>个人资料</ListGroup.Item>
            <ListGroup.Item as="a" href={`/article?author=${id}`}>
              个人作品
            </ListGroup.Item>
            <ListGroup.Item as="a" href={`/article?like=${id}`}>
              个人收藏
            </ListGroup.Item>
          </ListGroup>
        </Row>
      </Container>
    );
  }
}
