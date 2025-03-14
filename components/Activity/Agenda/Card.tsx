import { HorizontalMarqueeBox, text2color } from 'idea-react';
import { TableCellAttachment } from 'mobx-lark';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { Component } from 'react';
import { Badge, Carousel, Col, Container, Row } from 'react-bootstrap';

import { LarkImage } from '../../Base/LarkImage';
import { ScoreBar } from '../../Base/ScoreBar';
import { TimeRange } from '../../Base/TimeRange';
import { ActivityPeople } from '../People';
import { AgendaToolbarProps } from './Toolbar';

const AgendaToolbar = dynamic(() => import('./Toolbar'), { ssr: false });

@observer
export class AgendaCard extends Component<AgendaToolbarProps> {
  renderCardImage = (file: TableCellAttachment) => (
    <LarkImage
      key={file.attachmentToken}
      className="m-auto object-fit-cover"
      style={{ width: '6rem', height: '6rem' }}
      src={[file]}
      roundedCircle
    />
  );

  renderAvatarImages() {
    const { type, mentors, mentorAvatars, organizationLogos } = this.props;
    const images = (type === 'Booth' && organizationLogos) || mentorAvatars;

    return (mentors as string[])?.[1] ? (
      <Carousel indicators={false}>
        {(images as TableCellAttachment[])?.map(file => (
          <Carousel.Item key={file.attachmentToken}>
            {this.renderCardImage(file)}
          </Carousel.Item>
        ))}
      </Carousel>
    ) : (
      <ActivityPeople size={5} avatars={images} />
    );
  }

  render() {
    const {
      activityId,
      id,
      type,
      title,
      mentors,
      mentorOrganizations,
      mentorPositions,
      startTime,
      endTime,
      score,
    } = this.props;

    return (
      <Container
        className="h-100"
        style={{ contentVisibility: 'auto', containIntrinsicHeight: '13rem' }}
      >
        <Row className="border shadow-sm rounded h-100">
          <Col
            xs={4}
            className="d-flex flex-column justify-content-around align-items-center"
          >
            <Badge bg={text2color(type + '', ['light'])}>
              <HorizontalMarqueeBox maxWidth="80px" height="12px">
                {type + ''}
              </HorizontalMarqueeBox>
            </Badge>

            {this.renderAvatarImages()}
          </Col>

          <Col xs={8} className="d-flex flex-column py-3">
            <h3 className="fs-5">
              <a
                className="text-decoration-none text-secondary"
                href={`/activity/${activityId}/agenda/${id}`}
                title={title as string}
              >
                <HorizontalMarqueeBox
                  duration="20s"
                  maxWidth="330px"
                  height="24px"
                >
                  {title as string}
                </HorizontalMarqueeBox>
              </a>
            </h3>
            <ul className="list-unstyled flex-fill d-flex flex-column justify-content-between gap-2">
              <li>
                <TimeRange {...{ startTime, endTime }} />
              </li>
              {(mentors as string[])?.map((name, index) => (
                <li key={name}>
                  {name} {(mentorOrganizations as string[])?.[index]}{' '}
                  {(mentorPositions as string[])?.[index]}
                </li>
              ))}
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
