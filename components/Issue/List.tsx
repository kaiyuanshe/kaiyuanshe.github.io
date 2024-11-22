import { FC } from 'react';
import { Col, Row, RowProps } from 'react-bootstrap';

import { Issue } from '../../models/Governance/Issue';
import { IssueCard } from './Card';

export interface IssueListLayoutProps {
  className?: string;
  rowCols?: Pick<RowProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>;
  defaultData: Issue[];
}

export const IssueListLayout: FC<IssueListLayoutProps> = ({
  className = 'g-3 my-4',
  rowCols = { xs: 1, sm: 2, xl: 3 },
  defaultData,
}) => (
  <Row as="section" {...rowCols} className={className}>
    {defaultData.map(item => (
      <Col key={item.id + ''}>
        <IssueCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);
