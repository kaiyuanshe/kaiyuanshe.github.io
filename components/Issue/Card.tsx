import { TimeDistance } from 'idea-react';
import { marked } from 'marked';
import { textJoin } from 'mobx-i18n';
import { TableCellRelation } from 'mobx-lark';
import type { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { t } from '../../models/Base/Translation';
import type { Issue } from '../../models/Governance/Issue';
import { TagNav } from '../Base/TagNav';
import { TimeOption } from '../data';

export interface IssueCardProps extends Issue {
  className?: string;
}

export const IssueCard: FC<IssueCardProps> = ({
  className = '',
  title,
  detail,
  type,
  deadline,
  createdBy,
  createdAt,
  meetings,
  proposals,
  department,
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
      <Row className="flex-fill small mt-1">
        <TagNav className="col-8" model="issue" list={type as string[]} />

        <Col className="text-end" xs={4}>
          {typeof deadline === 'number' && deadline > 0 ? (
            <TimeDistance {...TimeOption} date={deadline} />
          ) : (
            '🕐'
          )}
        </Col>
      </Row>
      {textJoin(t('related'), t('department'))}: {department as string}
      <details>
        <summary>{textJoin(t('related'), t('meeting'))}</summary>
        <ol>
          {Array.isArray(meetings) &&
            (meetings[0] as TableCellRelation).text_arr.map((text, index) => (
              <li key={text} className="mt-2">
                <a
                  href={`/governance/meeting/${(meetings[0] as TableCellRelation).record_ids[index]}`}
                  className="text-decoration-none"
                  target="_blank"
                  rel="noreferrer"
                >
                  {text}
                </a>
              </li>
            ))}
        </ol>
      </details>
      <details>
        <summary>{textJoin(t('related'), t('proposal'))}</summary>
        <ol>
          {Array.isArray(proposals) &&
            (proposals[0] as TableCellRelation).text_arr.map((text, index) => (
              <li
                key={(proposals[0] as TableCellRelation).record_ids[index]}
                className="mt-2"
              >
                {text}
              </li>
            ))}
        </ol>
      </details>
      <details>
        <summary>{t('detail')}</summary>
        {detail && (
          <div dangerouslySetInnerHTML={{ __html: marked(detail as string) }} />
        )}
      </details>
    </Card.Body>
    <Card.Footer className="d-flex flex-wrap justify-content-between align-items-center">
      <a
        href={`/member/${createdBy}`}
        className="text-decoration-none text-truncate"
        target="_blank"
        rel="noopener noreferrer"
      >
        {createdBy as string}
      </a>
      <TimeDistance {...TimeOption} date={createdAt as number} />
    </Card.Footer>
  </Card>
);
