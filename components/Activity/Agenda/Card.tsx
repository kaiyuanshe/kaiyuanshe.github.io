import { text2color } from 'idea-react';
import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';

import { blobURLOf } from '../../../models/Base';
import { ScoreBar } from '../../Base/ScoreBar';
import { ActivityPeople } from '../People';
import { AgendaToolbar, AgendaToolbarProps } from './Toolbar';

@observer
export class AgendaCard extends Component<AgendaToolbarProps> {
  render() {
    const {
      activityId,
      id,
      type,
      title,
      mentors,
      mentorOrganizations,
      startTime,
      endTime,
      score,
      mentorAvatars,
    } = this.props;

    return (
      <Row
        as="ul"
        className="list-unstyled border border-success rounded m-2"
        style={{ height: '18rem' }}
      >
        <Col className="col-4 d-flex justify-content-center">
          <ActivityPeople
            className="flex-column"
            size={5}
            names={mentors as string[]}
            avatars={(mentorAvatars as TableCellValue[]).map(file =>
              blobURLOf([file] as TableCellValue),
            )}
          />
        </Col>

        <Col as="li" className="w-75">
          <ul className="list-unstyled d-flex flex-column justify-content-center h-100">
            <li className="m-1">
              🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
              {new Date(+endTime!).toLocaleString()}
            </li>

            <li className="m-1">
              <a
                className="text-decoration-none text-secondary"
                href={`/activity/${activityId}/agenda/${id}`}
                title={title as string}
              >
                {title}
              </a>
            </li>

            <li className="m-1">
              <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>
            </li>

            <li className="m-1">
              🏙 {(mentorOrganizations as string[])?.join(' ')}
            </li>

            {score && (
              <li className="m-1">
                <ScoreBar value={score + ''} />
              </li>
            )}

            <li className="m-1">
              <AgendaToolbar {...{ ...this.props, activityId }} />
            </li>
          </ul>
        </Col>
      </Row>
    );
  }
}
