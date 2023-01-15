import { NewData } from 'mobx-restful';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Row, Col, RowProps } from 'react-bootstrap';
import { ScrollListProps } from 'mobx-restful-table';

import { XScrollList } from '../ScrollList';
import { ArticleCard } from './Card';
import { BaseArticle } from '../../pages/api/article';
import { Article, ArticleModel } from '../../models/Article';

export interface ArticleListLayoutProps {
  className?: string;
  rowCols?: Pick<RowProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>;
  data: BaseArticle[];
}

export const ArticleListLayout: FC<ArticleListLayoutProps> = ({
  className = 'g-3 my-4',
  rowCols = { xs: 1, sm: 2, xl: 3 },
  data,
}) => (
  <Row as="section" {...rowCols} className={className}>
    {data.map(item => (
      <Col key={item.id + ''}>
        <ArticleCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);

export interface ArticleListProps
  extends Omit<ArticleListLayoutProps, 'data'>,
    ScrollListProps<Article> {
  store: ArticleModel;
  filter?: NewData<Article>;
}

@observer
export class ArticleList extends XScrollList<ArticleListProps> {
  store = this.props.store;
  filter = this.props.filter || {};

  constructor(props: ArticleListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <ArticleListLayout
        rowCols={this.props.rowCols}
        data={this.store.allItems}
      />
    );
  }
}
