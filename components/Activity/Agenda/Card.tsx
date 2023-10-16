import { text2color } from 'idea-react';
import { TableCellAttachment, TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Badge, Carousel, Col, Container, Row } from 'react-bootstrap';

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
      roundedCircle
      className="m-auto object-fit-cover"
      style={{ width: '6rem', height: '6rem' }}
      src={[file]}
    />
  );

  renderAvatarImages() {
    const { mentors, mentorAvatars } = this.props;

    return (mentors as string[])?.[1] ? (
      <Carousel indicators={false}>
        {(mentorAvatars as TableCellAttachment[]).map(file => (
          <Carousel.Item key={file.attachmentToken}>
            {this.renderCardImage(file)}
          </Carousel.Item>
        ))}
      </Carousel>
    ) : (
      <ActivityPeople
        size={5}
        names={mentors as string[]}
        avatars={(mentorAvatars as TableCellValue[]).map(file =>
          blobURLOf([file] as TableCellValue),
        )}
      />
    );
  }

  render() {
    const {
      activityId,
      id,
      type,
      title,
      mentorOrganizations,
      startTime,
      endTime,
      score,
    } = this.props;

    return (
      <Container className="h-100">
        <Row className="border shadow-sm rounded h-100">
          <Col
            xs={4}
            className="d-flex flex-column justify-content-around align-items-center"
          >
            <Badge bg={text2color(type as string, ['light'])}>{type}</Badge>

            {this.renderAvatarImages()}
          </Col>

          <Col xs={8} className="d-flex flex-column py-3">
            <h3 className="fs-5">
              <a
                className="text-decoration-none text-secondary"
                href={`/activity/${activityId}/agenda/${id}`}
                title={title as string}
              >
                {title}
              </a>
            </h3>
            <ul className="list-unstyled flex-fill d-flex flex-column justify-content-between gap-2">
              <li>
                🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
                {new Date(+endTime!).toLocaleString()}
              </li>
              <li>{(mentorOrganizations as string[])?.join(' ')}</li>

              {score && (
                <li>
                  <ScoreBar value={score + ''} />
                </li>
              )}
              <AgendaToolbar
                as="li"
                className="justify-content-end"
                {...{ ...this.props, activityId }}
              />
            </ul>
          </Col>
        </Row>
      </Container>
    );
  }
}
