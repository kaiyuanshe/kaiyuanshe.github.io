import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { NextRouter, withRouter } from 'next/router';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import { Option, Select } from 'idea-react';

import { SearchBar } from './SearchBar';
import styles from '../styles/MainNav.module.less';
import { i18n, LanguageName } from '../models/Translation';

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

@observer
class MainNav extends PureComponent<MainNavProps> {
  render() {
    const { currentLanguage } = i18n,
      {
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
            <svg className={styles.logoTitle} viewBox="0 0 96 32">
              <text x="0" y="68%">
                {title}
              </text>
            </svg>
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-end">
            <Nav className="ms-3 align-items-center">
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

            <SearchBar className="mx-3" />

            <Select
              value={currentLanguage}
              onChange={code =>
                i18n.changeLanguage(code as typeof currentLanguage)
              }
            >
              {Object.entries(LanguageName).map(([code, name]) => (
                <Option key={code} value={code}>
                  {name}
                </Option>
              ))}
            </Select>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(MainNav);
