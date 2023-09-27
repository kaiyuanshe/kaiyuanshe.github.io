import { text2color, TimeDistance } from 'idea-react';
import type { FC } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';

import type { BaseArticle } from '../../models/Product/Article';
import { LarkImage } from '../Base/LarkImage';
import { TimeOption } from '../data';

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
    <LarkImage
      className="card-img-top object-fit-cover"
      style={{ aspectRatio: '2.35 / 1' }}
      src={image}
    />
    <Card.Body className="d-flex flex-column">
      <Card.Title as="h3" className="h5 flex-fill">
        <a
          className="text-decoration-none text-secondary text-truncate-lines"
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
          {(tags as string[])?.map(name => (
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
