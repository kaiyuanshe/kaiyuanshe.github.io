import { TimeDistance } from 'idea-react';
import type { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import type { Proposal } from '../../models/Governance/Proposal';

export interface ProposalCardProps extends Proposal {
  className?: string;
}

export const ProposalCard: FC<ProposalCardProps> = ({
  className = '',
  title,
  contentURL,
  createdBy,
  meetings,
}) => (
  <Card
    className={`shadow-sm ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicHeight: '20rem' }}
  >
    <Card.Body className="d-flex-column">
      <Card.Title as="h3" className="h5 flex-fill">
        <a href={contentURL as string} target="_blank" rel="noreferrer">
          {title as string}
        </a>
      </Card.Title>
    </Card.Body>
    <Card.Footer className="d-flex flex-wrap justify-content-between align-items-center">
      <div>{createdBy as string}</div>
      <div>{meetings as string}</div>
    </Card.Footer>
  </Card>
);
