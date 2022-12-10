import { observer } from 'mobx-react';
import { FC } from 'react';
import { Row, Col } from 'react-bootstrap';

import { ScrollList, ScrollListProps } from '../ScrollList';
import { ArticleCard } from './Card';
import { BaseArticle } from '../../pages/api/article';
import articleStore, { Article } from '../../models/Article';

export type ArticleListProps = ScrollListProps<Article>;

export const ArticleListLayout: FC<{ data: BaseArticle[] }> = ({ data }) => (
  <Row as="section" xs={1} sm={2} xl={3} xxl={4} className="g-3 my-4">
    {data.map(item => (
      <Col key={item.id + ''}>
        <ArticleCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);

@observer
export class ArticleList extends ScrollList<ArticleListProps> {
  store = articleStore;

  constructor(props: ArticleListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return <ArticleListLayout data={this.store.allItems} />;
  }
}
