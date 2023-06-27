import { Filter } from 'mobx-restful';
import { FC } from 'react';
import { Row, Col, RowProps } from 'react-bootstrap';

import { ArticleCard } from './Card';
import { BaseArticle, Article } from '../../models/Article';

export interface ArticleListLayoutProps {
  className?: string;
  rowCols?: Pick<RowProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>;
  defaultData: BaseArticle[];
}

export const ArticleListLayout: FC<ArticleListLayoutProps> = ({
  className = 'g-3 my-4',
  rowCols = { xs: 1, sm: 2, xl: 3 },
  defaultData,
}) => (
  <Row as="section" {...rowCols} className={className}>
    {defaultData.map(item => (
      <Col key={item.id + ''}>
        <ArticleCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);
