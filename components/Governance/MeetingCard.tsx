import { Nameplate } from 'idea-react';
import { TableCellGroup, TableCellUser } from 'mobx-lark';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { t } from '../../models/Base/Translation';
import { Meeting } from '../../models/Governance/Meeting';
import { DefaultImage } from '../../pages/api/lark/file/[id]';

export const MeetingCard: FC<Meeting> = observer(
  ({
    title,
    startedAt,
    endedAt,
    location,
    participants,
    groups,
    summary,
    videoCallURL,
    minutesURL,
  }) => (
    <Card>
      <Card.Header>
        ⏱️{' '}
        <time dateTime={new Date(startedAt as number).toJSON()}>
          {formatDate(startedAt as number, 'YYYY-MM-DD HH:mm')}
        </time>{' '}
        ~{' '}
        <time dateTime={new Date(endedAt as number).toJSON()}>
          {formatDate(endedAt as number, 'YYYY-MM-DD HH:mm')}
        </time>
      </Card.Header>
      <Card.Body>
        <Card.Title as="h2" className="h3">
          {title + ''}
        </Card.Title>

        {summary && <Card.Text>{summary + ''}</Card.Text>}

        <div className="d-flex gap-3">
          👨‍👩‍👧‍👦
          <ul className="list-unstyled d-flex flex-wrap gap-3">
            {(participants as TableCellUser[])?.map(({ id, name }) => (
              <li key={id}>
                <a className="text-decoration-none" href={`/member/${name}`}>
                  <Nameplate name={name} avatar={DefaultImage} />
                </a>
              </li>
            ))}
            {(groups as TableCellGroup[])?.map(({ id, name, avatar_url }) => (
              <li key={id}>
                <a
                  className="text-decoration-none"
                  href={`/department/${name}`}
                >
                  <Nameplate name={name} avatar={avatar_url} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="d-flex gap-3">
          {videoCallURL && (
            <Button
              className="flex-fill"
              variant="warning"
              target="_blank"
              href={videoCallURL + ''}
            >
              {t('video_call')}
            </Button>
          )}
          {minutesURL && (
            <Button
              className="flex-fill"
              variant="info"
              target="_blank"
              href={minutesURL + ''}
            >
              {t('meeting_minutes')}
            </Button>
          )}
        </div>
      </Card.Body>
      {location && <Card.Footer>🗺️ {location + ''}</Card.Footer>}
    </Card>
  ),
);
