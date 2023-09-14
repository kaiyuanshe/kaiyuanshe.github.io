import { Icon, text2color } from 'idea-react';
import { FC, useState } from 'react';
import { Badge, Card, Col, Collapse, Row, Stack } from 'react-bootstrap';

import type { GitRepository } from '../../models/Repository';
import { IssueCard } from './Card';

export const IssueModule: FC<GitRepository> = ({ name, language, issues }) => {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <Card className="p-0" bg="light" text="dark">
      <Card.Header
        style={{ cursor: 'pointer' }}
        onClick={() => setIsExpand(!isExpand)}
      >
        <Row className="align-items-center gx-3">
          <Col xs={4}>
            {language && (
              <Badge className="fs-6" bg={text2color(language, ['light'])}>
                {language}
              </Badge>
            )}
          </Col>
          <Col xs={6} as="h3" className="m-0 text-truncate">
            {name}
          </Col>
          <Col xs={1}>
            <Badge className="fs-6" pill bg="info">
              {issues.length}
            </Badge>
          </Col>
          <Col xs={1}>
            <Icon
              size={1.5}
              name={isExpand ? 'arrows-collapse' : 'arrows-expand'}
            />
          </Col>
        </Row>
      </Card.Header>

      <Collapse in={isExpand}>
        <Card.Body as={Row} xs={1} sm={2} xl={2} className="g-3">
          {issues.map(issue => (
            <Col key={issue.title}>
              <IssueCard className="h-100" {...issue} />
            </Col>
          ))}
        </Card.Body>
      </Collapse>
    </Card>
  );
};
