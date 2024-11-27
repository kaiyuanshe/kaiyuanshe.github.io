import { TimeDistance } from 'idea-react';
import { textJoin } from 'mobx-i18n';
import { TableCellRelation } from 'mobx-lark';
import type { FC } from 'react';
import { Card } from 'react-bootstrap';

import { t } from '../../models/Base/Translation';
import type { Proposal } from '../../models/Governance/Proposal';
import { TimeOption } from '../data';

export interface ProposalCardProps extends Proposal {
  className?: string;
}

export const ProposalCard: FC<ProposalCardProps> = ({
  className = '',
  title,
  contentURL,
  createdBy,
  createdAt,
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
        <summary>{textJoin(t('related'), t('issue'))}</summary>
        <ol>
          {Array.isArray(issues) &&
            (issues[0] as TableCellRelation).text_arr.map(text => (
              <li key={text} className="mt-2">
                {text}
              </li>
            ))}
        </ol>
      </details>
    </Card.Body>
    <Card.Footer className="d-flex flex-wrap justify-content-between align-items-center">
      <a
        href={`/member/${createdBy}`}
        className="text-decoration-none text-muted"
        target="_blank"
        rel="noopener noreferrer"
      >
        {createdBy as string}
      </a>
      <TimeDistance {...TimeOption} date={createdAt as number} />
    </Card.Footer>
  </Card>
);
