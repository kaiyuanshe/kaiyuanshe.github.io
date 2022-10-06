import { FC, ReactNode } from 'react';
import { Nav, Tab } from 'react-bootstrap';

export interface TabItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
}

export interface PillTabProps {
  direction?: 'row' | 'column';
  list: TabItem[];
}

export const PillTab: FC<PillTabProps> = ({ direction = 'row', list }) => (
  <Tab.Container defaultActiveKey={list[0]?.key}>
    <div className={`d-flex flex-${direction}`}>
      <Nav
        variant="pills"
        className={`flex-${direction === 'row' ? 'column' : 'row'}`}
      >
        {list.map(({ key, title }) => (
          <Nav.Item className="text-nowrap" key={key}>
            <Nav.Link eventKey={key}>{title}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content className="ms-3 w-100">
        {list.map(({ key, content }) => (
          <Tab.Pane key={key} eventKey={key}>
            {content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </div>
  </Tab.Container>
);
