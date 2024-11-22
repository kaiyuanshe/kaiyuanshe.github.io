import { TimeDistance } from 'idea-react';
import type { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import type { Issue } from '../../models/Governance/Issue';
import { TagNav } from '../Base/TagNav';
import { TimeOption } from '../data';

export interface IssueCardProps extends Issue {
  className?: string;
}

export const IssueCard: FC<IssueCardProps> = ({
  className = '',
  title,
  type,
  deadline,
  createdBy,
}) => (
  <Card
    className={`shadow-sm ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicHeight: '20rem' }}
  >
    <Card.Body className="d-flex flex-column">
      <Card.Title as="h3" className="h5 flex-fill">
        <a className="text-decoration-none text-secondary text-truncate-lines">
          {title as string}
        </a>
      </Card.Title>

      <Row className="mt-2 flex-fill">
        <Col className="text-decoration-none text-end text-truncate align-self-end">
          {createdBy as string}
        </Col>
      </Row>
      <Row as="footer" className="flex-fill small mt-1">
        <TagNav className="col-8" model="issue" list={type as string[]} />

        <Col className="text-end" xs={4}>
          {typeof deadline === 'number' && deadline > 0 ? (
            <TimeDistance {...TimeOption} date={deadline} />
          ) : (
            '🕐'
          )}
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
