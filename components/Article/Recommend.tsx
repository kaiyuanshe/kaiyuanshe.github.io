import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Spinner } from 'react-bootstrap';

import { ArticleCard } from './Card';
import { BaseArticle } from '../../pages/api/article';
import articleStore, { Article } from '../../models/Article';

export interface ArticleRecommendProps extends Pick<Article, 'alias'> {
  className?: string;
}

@observer
export default class ArticleRecommend extends PureComponent<
  ArticleRecommendProps,
  { list: BaseArticle[] }
> {
  componentDidMount() {
    articleStore.getRecommendList(this.props.alias + '');
  }

  render() {
    const { className } = this.props,
      { downloading, currentRecommend } = articleStore;

    return (
      <aside className={className}>
        <h2 className="mt-4">相关文章</h2>

        {!currentRecommend[0] ? (
          <div className="text-center p-4">
            {downloading > 0 ? (
              <Spinner animation="grow" variant="primary" />
            ) : (
              '暂无数据'
            )}
          </div>
        ) : (
          currentRecommend.map(item => (
            <ArticleCard key={item.id + ''} className="mt-3" {...item} />
          ))
        )}
      </aside>
    );
  }
}
