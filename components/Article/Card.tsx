import type { FC } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { TimeDistance, text2color } from 'idea-react';

import { TimeOption } from '../data';
import { blobURLOf } from '../../models/Base';
import type { BaseArticle } from '../../models/Article';

export interface ArticleCardProps extends BaseArticle {
  className?: string;
}

export const ArticleCard: FC<ArticleCardProps> = ({
  className = '',
  alias,
  title,
  author,
  tags,
  image,
  publishedAt,
}: ArticleCardProps) => (
  <Card className={`shadow-sm ${className}`}>
    <div className="position-relative w-100" style={{ paddingBottom: '56%' }}>
      <div className="position-absolute top-0 left-0 w-100 h-100">
        <Card.Img
          className="h-100 object-fit-cover"
          style={{ objectPosition: 'top left' }}
          src={blobURLOf(image)}
        />
      </div>
    </div>
    <Card.Body className="d-flex flex-column">
      <Card.Title as="h3" className="h5 flex-fill">
        <a
          className="text-decoration-none text-secondary text-truncation-lines"
          href={`/article/${alias}`}
        >
          {title}
        </a>
      </Card.Title>

      <Row className="mt-2 flex-fill">
        <Col
          as="a"
          className="text-decoration-none text-end text-truncate align-self-end"
          href={`/search?keywords=${author}`}
        >
          {author}
        </Col>
      </Row>
      <Row as="footer" className="flex-fill small mt-1">
        <Col xs={8}>
          {(tags + '').split(/\s+/).map(name => (
            <Badge
              as="a"
              key={name}
              className="text-decoration-none me-2"
              bg={text2color(name, ['light'])}
              href={`/search?tag=${name}`}
            >
              {name}
            </Badge>
          ))}
        </Col>
        <Col className="text-end" xs={4}>
          <TimeDistance {...TimeOption} date={publishedAt as number} />
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
