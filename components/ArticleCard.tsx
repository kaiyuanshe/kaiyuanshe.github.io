import type { PropsWithoutRef } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { TimeDistance, Nameplate } from 'idea-react';

import type { Article } from '../pages/api/article';
import { TimeOption } from './data';

const { NEXT_PUBLIC_API_HOST } = process.env;

export type ArticleCardProps = PropsWithoutRef<
  Article & { className?: string }
>;

export default function ArticleCard({
  className = '',
  id,
  title,
  author,
  tags,
  image,
  updatedAt,
}: ArticleCardProps) {
  return (
    <Card className={`shadow-sm ${className}`}>
      <Card.Img
        variant="top"
        style={{ height: '30vh', objectFit: 'cover' }}
        src={image && new URL(image.url, NEXT_PUBLIC_API_HOST) + ''}
      />
      <Card.Body>
        <Card.Title as="h3" className="h4">
          <a
            className="text-decoration-none stretched-link text-secondary"
            href={`/article/${id}`}
          >
            {title}
          </a>
        </Card.Title>

        <Row className="mt-3">
          <Col className="text-end">
            <Nameplate
              avatar={
                author?.avatar
                  ? new URL(author.avatar.url, NEXT_PUBLIC_API_HOST) + ''
                  : '/typescript.png'
              }
              name={author?.username || ''}
            />
          </Col>
        </Row>
        <Row as="footer" className="small mt-3">
          <Col>
            {tags?.map(({ name }) => (
              <Badge key={name} className="me-2" color="primary">
                {name}
              </Badge>
            ))}
          </Col>
          <Col className="text-end">
            <TimeDistance className="me-3" {...TimeOption} date={updatedAt!} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
