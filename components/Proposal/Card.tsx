import { TimeDistance } from 'idea-react';
import type { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import type { Proposal } from '../../models/Governance/Proposal';
import { TagNav } from '../Base/TagNav';
import { TimeOption } from '../data';

export interface ProposalCardProps extends Proposal {
  className?: string;
}

export const ProposalCard: FC<ProposalCardProps> = ({
  className = '',
  title,
  type,
  issues,
  createdBy,
  meetings,
  voteURL,
  passed,
}) => (
  <Card
    className={`shadow-sm ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicHeight: '20rem' }}
  >
    <Card.Body className="d-flex-column">
      <Card.Title as="h3" className="h5 flex-fill">
        <a href={voteURL as string} target="_blank" rel="noreferrer">
          {title as string}
        </a>
      </Card.Title>
      <Row className="mt-2 flex-fill">
        <Col className="text-decoration-none text-end text-truncate align-self-end">
          {createdBy as string}
        </Col>
      </Row>
      <Row as="footer" className="flex-fill small mt-1">
        <TagNav className="col-8" model="proposal" list={type as string[]} />
      </Row>
    </Card.Body>
  </Card>
);
