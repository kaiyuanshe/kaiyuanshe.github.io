import type { FC } from 'react';
import { Col, Row, RowProps } from 'react-bootstrap';

import type { Proposal } from '../../models/Governance/Proposal';
import { ProposalCard } from './Card';

export interface ProposalListProps {
  className?: string;
  rowCols?: Pick<RowProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
  defaultData: Proposal[];
}

export const ProposalList: FC<ProposalListProps> = ({
  className = '',
  rowCols,
  defaultData,
}) => (
  <Row as="section" {...rowCols} className={className}>
    {defaultData.map(item => (
      <Col key={item.id + ''}>
        <ProposalCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);
