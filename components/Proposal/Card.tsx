import { TimeDistance } from 'idea-react';
import { TableCellRelation } from 'mobx-lark';
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
      <details>
        <summary>{'相关会议'}</summary>
        {Array.isArray(meetings) &&
          (meetings[0] as TableCellRelation).text_arr.map((text, index) => (
            <Row key={index} className="mt-2">
              <a
                href={`/governance/meeting/${(meetings[0] as TableCellRelation).record_ids[index]}`}
                className="text-decoration-none"
                target="_blank"
                rel="noreferrer"
              >
                <Col>{text}</Col>
              </a>
            </Row>
          ))}
      </details>
      <details>
        <summary>{'相关提议'}</summary>
        {Array.isArray(issues) &&
          (issues[0] as TableCellRelation).text_arr.map((text, index) => (
            <Row key={index} className="mt-2">
              <a
                href={`/governance/issue/${(issues[0] as TableCellRelation).record_ids[index]}`}
                className="text-decoration-none"
                target="_blank"
                rel="noreferrer"
              >
                <Col>{text}</Col>
              </a>
            </Row>
          ))}
      </details>
    </Card.Body>
    <Card.Footer className="d-flex flex-wrap justify-content-between align-items-center"></Card.Footer>
  </Card>
);
