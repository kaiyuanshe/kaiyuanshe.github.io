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
  renderRight() {
    const { currentLanguage } = i18n,
      { links } = this.props,
      { pathname } = this.props.router;

    return (
      <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 ms-auto">
        <Nav className="flex-fill ms-3 align-items-center">
          {links.map(({ path, title }) => (
            <Nav.Link
              key={path}
              href={path}
              style={{ whiteSpace: 'nowrap' }}
              active={pathname.startsWith(path)}
            >
              {title}
            </Nav.Link>
          ))}
        </Nav>
        <div className="flex-fill d-flex flex-column flex-xxl-row justify-content-around gap-3">
          <SearchBar />

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
        </div>
      </div>
    );
  }

  render() {
    const { title, logo } = this.props;

    return (
      <Navbar
        bg="primary"
        variant="dark"
        fixed="top"
        expand="xxl"
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

          <Navbar.Collapse>{this.renderRight()}</Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(MainNav);
