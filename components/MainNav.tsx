import { PureComponent } from 'react';
import { NextRouter, withRouter } from 'next/router';
import { Container, Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Nameplate } from 'idea-react';

import { MainRoute } from './data';
import { call } from '../pages/api/base';
import { User } from '../pages/api/user';
import { setSession, getSession } from '../pages/api/user/session';

export interface MainNavProps {
  title: string;
  router: NextRouter;
}

interface State {
  user: User;
}

const { NEXT_PUBLIC_API_HOST } = process.env;

class MainNav extends PureComponent<MainNavProps, State> {
  state: Readonly<State> = {
    user: getSession(),
  };

  async componentDidMount() {
    if (!this.state.user.username)
      try {
        const user = await call<User>('user/session');

        setSession(user);
        this.setState({ user });
      } catch {}
  }

  renderSession() {
    const { username, avatar } = this.state.user;

    return username === undefined ? (
      <>
        <Button className="mx-3" variant="outline-light" href="/user/sign-up">
          注册
        </Button>
        <Button variant="outline-light" href="/user/sign-in">
          登录
        </Button>
      </>
    ) : (
      <NavDropdown
        title={
          <span className="d-inline-block text-white">
            <Nameplate
              avatar={
                avatar
                  ? new URL(avatar.url, NEXT_PUBLIC_API_HOST) + ''
                  : '/typescript.png'
              }
              name={username}
            />
          </span>
        }
      >
        <NavDropdown.Item href="/user/me">个人资料</NavDropdown.Item>
        <NavDropdown.Item
          href="/api/user/session?delete=true"
          onClick={() => localStorage.clear()}
        >
          登出
        </NavDropdown.Item>
      </NavDropdown>
    );
  }

  render() {
    const {
      title,
      router: { pathname },
    } = this.props;

    return (
      <Navbar bg="primary" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="/">{title}</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end text-white">
            <Nav className="align-items-center">
              {Object.entries(MainRoute).map(([_, { path, title }]) => (
                <Nav.Link
                  key={path}
                  href={path}
                  active={pathname.startsWith(path)}
                >
                  {title}
                </Nav.Link>
              ))}
              {this.renderSession()}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(MainNav);
