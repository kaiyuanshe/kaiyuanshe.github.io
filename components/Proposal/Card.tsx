import { TimeDistance } from 'idea-react';
import type { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import Issue from '../../models/Governance/Issue';
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
  issues,
}) => (
  <Card
    className={`shadow-sm ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicHeight: '20rem' }}
  >
    <Card.Body className="d-flex-column">
      <Card.Title as="h3" className="h5 flex-fill">
        <a
          href={contentURL as string}
          className="text-decoration-none"
          target="_blank"
          rel="noreferrer"
        >
          {title as string}
        </a>
      </Card.Title>
      <Row>
        <a
          href={`/member/${createdBy}`}
          className="text-decoration-none text-muted hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {createdBy as string}
        </a>
      </Row>
    </Card.Body>
    <Card.Footer className="d-flex flex-wrap justify-content-between align-items-center">
      <Row>
        <Col className="text-decoration-none align-self-end" xs={10}>
          {`相关会议: ${meetings as string}`}
        </Col>
      </Row>
      <Row>
        <Col className="text-decoration-none align-self-end" xs={10}>
          {`相关提议: ${issues as string}`}
        </Col>
      </Row>
    </Card.Footer>
  </Card>
);
