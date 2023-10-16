import { text2color } from 'idea-react';
import { TableCellAttachment, TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Badge, Carousel, Col, Row } from 'react-bootstrap';

import { blobURLOf } from '../../../models/Base';
import { LarkImage } from '../../Base/LarkImage';
import { ScoreBar } from '../../Base/ScoreBar';
import { ActivityPeople } from '../People';
import { AgendaToolbar, AgendaToolbarProps } from './Toolbar';

@observer
export class AgendaCard extends Component<AgendaToolbarProps> {
  renderCardImage = (file: TableCellAttachment) => (
    <LarkImage
      key={file.attachmentToken}
      className="card-img-top m-auto object-fit-cover"
      style={{ height: '25rem' }}
      src={[file]}
    />
  );

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
        className="list-unstyled border border-light rounded m-2 h-100"
      >
        <Col as="li" className="col-4 d-flex justify-content-center">
          {(mentors as string[])?.[1] ? (
            <div className="d-flex justify-content-center align-items-center">
              <Carousel>
                {(mentorAvatars as TableCellAttachment[]).map(file => (
                  <Carousel.Item key={file.attachmentToken}>
                    <span
                      role="img"
                      className="d-inline-block rounded-circle"
                      style={{
                        width: '6rem',
                        height: '6rem',
                        background: `url(${blobURLOf([
                          file,
                        ] as TableCellValue)}) center no-repeat`,
                        backgroundSize: 'cover',
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          ) : (
            <ActivityPeople
              className="flex-column"
              size={5}
              names={mentors as string[]}
              avatars={(mentorAvatars as TableCellValue[]).map(file =>
                blobURLOf([file] as TableCellValue),
              )}
            />
          )}
        </Col>

        <Col as="li" className="col-8">
          <ul className="list-unstyled d-flex flex-column justify-content-center h-100 gap-1">
            <li>
              🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
              {new Date(+endTime!).toLocaleString()}
            </li>

            <li>
              <a
                className="text-decoration-none text-secondary"
                href={`/activity/${activityId}/agenda/${id}`}
                title={title as string}
              >
                {title}
              </a>
            </li>

            <li>
              <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>
            </li>

            <li>{(mentorOrganizations as string[])?.join(' ')}</li>

            {score && (
              <li>
                <ScoreBar value={score + ''} />
              </li>
            )}

            <li>
              <AgendaToolbar {...{ ...this.props, activityId }} />
            </li>
          </ul>
        </Col>
      </Row>
    );
  }
}
