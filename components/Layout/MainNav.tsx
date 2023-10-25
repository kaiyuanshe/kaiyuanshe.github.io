import { computed } from 'mobx';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { NextRouter, withRouter } from 'next/router';
import { PureComponent } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { API_Host } from '../../models/Base';
import { i18n } from '../../models/Base/Translation';
import { SearchBar } from '../Base/SearchBar';
import styles from './MainNav.module.less';

const LanguageMenu = dynamic(() => import('../Base/LanguageMenu'), {
    ssr: false,
  }),
  UserMenu = dynamic(() => import('../Base/UserMenu'), { ssr: false });

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
  @computed
  get expandable() {
    const language = i18n.currentLanguage;

    return !language || language.startsWith('zh');
  }

  renderRight() {
    const { expandable } = this,
      { links } = this.props,
      { pathname } = this.props.router;

    return (
      <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 ms-auto">
        <Nav className="flex-fill ms-3">
          {links.map(({ title, path, subs }) =>
            path ? (
              <Nav.Link
                key={title}
                className="text-nowrap text-center"
                href={path}
                target={
                  new URL(path, API_Host).origin !== API_Host ? '_blank' : ''
                }
                active={pathname.startsWith(path)}
              >
                {title}
              </Nav.Link>
            ) : (
              <NavDropdown key={title} title={title} className="text-center">
                {subs?.map(({ title, path }) => (
                  <NavDropdown.Item
                    key={title}
                    href={path}
                    className="text-center"
                  >
                    {title}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ),
          )}
        </Nav>
        <div
          className={`flex-fill d-flex flex-column ${
            expandable ? 'flex-xxl-row' : ''
          } justify-content-around gap-3`}
        >
          <SearchBar />
          <LanguageMenu />
          <UserMenu />
        </div>
      </div>
    );
  }

  render() {
    const { title, logo } = this.props,
      { expandable } = this;

    return (
      <Navbar
        className="py-3"
        bg="primary"
        variant="dark"
        fixed="top"
        expand={expandable ? 'xxl' : false}
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand href="/">
            <Image className="me-3" width={40} src={logo} alt={title} />

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
