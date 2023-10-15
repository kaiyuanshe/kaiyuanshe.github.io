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
      <Row as="ul" className="list-unstyled">
        <Col as="li" className="w-25">
          <Row as="ul" className="list-unstyled" xs={1}>
            {(mentors as string[]).map((mentor, index) => (
              <Col key={mentor}>
                <ActivityPeople
                  size={6}
                  names={mentor.split(',')}
                  avatars={[
                    blobURLOf(
                      (mentorAvatars as TableCellValue[])[
                        index
                      ] as TableCellValue,
                    ),
                  ]}
                />
              </Col>
            ))}
          </Row>
        </Col>

        <Col as="li" className="w-75">
          <Row as="ul" className="list-unstyled justify-content-center" xs={1}>
            <Col as="li" className="text-center">
              🕒{' '}
              {new Date(+startTime!).toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}{' '}
              ~{' '}
              {new Date(+endTime!).toLocaleString('en-US', {
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </Col>

            <Col as="li">
              <a
                className="text-decoration-none text-secondary"
                href={`/activity/${activityId}/agenda/${id}`}
                title={title as string}
              >
                {title}
              </a>
            </Col>
            <Col as="li">
              <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>
            </Col>
            <Col as="li">🏙 {(mentorOrganizations as string[])?.join(' ')}</Col>
            <Col as="li">
              {score ? <ScoreBar value={score + ''} /> : <div />}
            </Col>
            <Col as="li">
              <AgendaToolbar {...{ ...this.props, activityId }} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
