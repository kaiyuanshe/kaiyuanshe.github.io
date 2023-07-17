import { Option, Select } from 'idea-react';
import { observer } from 'mobx-react';
import { NextRouter, withRouter } from 'next/router';
import { PureComponent } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { isXDomain } from 'web-utility';

import { i18n, LanguageName } from '../models/Translation';
import styles from '../styles/MainNav.module.less';
import { SearchBar } from './SearchBar';

export interface Link {
  title: string;
  path?: string;
  subs?: Link[];
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
          {links.map(({ title, path, subs }) =>
            path ? (
              <Nav.Link
                key={title}
                className="text-nowrap"
                href={path}
                target={isXDomain(path) ? '_blank' : ''}
                active={pathname.startsWith(path)}
              >
                {title}
              </Nav.Link>
            ) : (
              <NavDropdown key={title} title={title}>
                {subs?.map(({ title, path }) => (
                  <NavDropdown.Item key={title} href={path}>
                    {title}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ),
          )}
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
        className="py-3"
        bg="primary"
        variant="dark"
        fixed="top"
        expand="xxl"
        collapseOnSelect
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
