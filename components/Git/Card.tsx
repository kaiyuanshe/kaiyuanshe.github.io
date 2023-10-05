import { text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';
import { GitRepository } from '../../models/Repository';
import { GitLogo } from './Logo';

const { t } = i18n;

export interface GitCardProps
  extends Pick<GitRepository, 'full_name' | 'html_url' | 'languages'>,
    Partial<Pick<GitRepository, 'topics' | 'description' | 'homepage'>> {
  className?: string;
}

export const GitCard: FC<GitCardProps> = observer(
  ({
    className = 'shadow-sm',
    full_name,
    html_url,
    languages = [],
    topics = [],
    description,
    homepage,
  }) => (
    <Card className={className}>
      <Card.Body className="d-flex flex-column gap-3">
        <Card.Title as="h3" className="h5">
          <a target="_blank" href={html_url} rel="noreferrer">
            {full_name}
          </a>
        </Card.Title>

        <nav className="flex-fill">
          {topics.map(topic => (
            <Badge
              key={topic}
              className="me-1"
              bg={text2color(topic, ['light'])}
              as="a"
              target="_blank"
              href={`https://github.com/topics/${topic}`}
            >
              {topic}
            </Badge>
          ))}
        </nav>
        <Row as="ul" className="list-unstyled g-4" xs={4}>
          {languages.map(language => (
            <Col as="li" key={language}>
              <GitLogo name={language} />
            </Col>
          ))}
        </Row>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center">
        {homepage && (
          <Button variant="success" target="_blank" href={homepage}>
            {t('home_page')}
          </Button>
        )}
      </Card.Footer>
    </Card>
  ),
);
