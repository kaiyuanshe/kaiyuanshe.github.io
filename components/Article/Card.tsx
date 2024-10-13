import { TimeDistance } from 'idea-react';
import type { FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import type { Article } from '../../models/Product/Article';
import { LarkImage } from '../Base/LarkImage';
import { TagNav } from '../Base/TagNav';
import { TimeOption } from '../data';

export interface ArticleCardProps extends Article {
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
}) => (
  <Card
    className={`shadow-sm ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicHeight: '20rem' }}
  >
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
          {title as string}
        </a>
      </Card.Title>

      <Row className="mt-2 flex-fill">
        <Col
          as="a"
          className="text-decoration-none text-end text-truncate align-self-end"
          href={`/search?keywords=${author}`}
        >
          {author as string}
        </Col>
      </Row>
      <Row as="footer" className="flex-fill small mt-1">
        <TagNav className="col-8" list={tags as string[]} />

        <Col className="text-end" xs={4}>
          <TimeDistance {...TimeOption} date={publishedAt as number} />
        </Col>
      </Row>
    </Card.Body>
  </Card>
);
