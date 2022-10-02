import { FC, ReactNode } from 'react';
import { Nav, Tab } from 'react-bootstrap';

export interface TabItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
}

export interface PillTabProps {
  list: TabItem[];
}

export const PillTab: FC<PillTabProps> = ({ list }) => (
  <Tab.Container>
    <div className="d-flex">
      <Nav variant="pills" className="flex-column">
        {list.map(({ key, title }) => (
          <Nav.Item key={key}>
            <Nav.Link eventKey={key}>{title}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content>
        {list.map(({ key, content }) => (
          <Tab.Pane key={key} eventKey={key}>
            {content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </div>
  </Tab.Container>
);
