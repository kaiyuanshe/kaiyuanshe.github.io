import { PureComponent } from 'react';
import { NextRouter, withRouter } from 'next/router';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';

export interface Link {
  path: string;
  title: string;
}

export interface MainNavProps {
  title: string;
  logo: string;
  links: Link[];
  router: NextRouter;
}

class MainNav extends PureComponent<MainNavProps> {
  render() {
    const {
      title,
      logo,
      links,
      router: { pathname },
    } = this.props;

    return (
      <Navbar
        bg="primary"
        variant="dark"
        fixed="top"
        expand="lg"
        className="py-3"
      >
        <Container>
          <Navbar.Brand href="/">
            <Image className="me-3" width={40} src={logo} alt="logo" />
            <svg className="logoTitle" viewBox="0 0 96 32">
              <text x="0" y="68%">
                {title}
              </text>
            </svg>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="align-items-center">
              {links.map(({ path, title }) => (
                <Nav.Link
                  key={path}
                  href={path}
                  active={pathname.startsWith(path)}
                >
                  {title}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(MainNav);
