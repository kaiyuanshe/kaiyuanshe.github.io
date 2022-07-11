import { stringify } from 'qs';
import { PropsWithoutRef, PureComponent } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import ArticleCard from './ArticleCard';
import { request } from '../pages/api/base';
import { Article } from '../pages/api/article';

export type ArticleRecommendProps = PropsWithoutRef<{
  className?: string;
  articles: number[];
  tags: number[];
}>;

export default class ArticleRecommend extends PureComponent<
  ArticleRecommendProps,
  { list: Article[] }
> {
  state: Readonly<{ list: Article[] }> = {
    list: [],
  };

  async componentDidMount() {
    const { articles, tags } = this.props;

    if (!tags[0]) return;

    const list = await request<Article[]>(
      `article/recommend?${stringify(
        { articles, tags },
        { arrayFormat: 'repeat' },
      )}`,
    );
    this.setState({ list });
  }

  render() {
    const { className, tags } = this.props,
      { list } = this.state;

    return (
      <aside className={className}>
        <h2 className="mt-4">相关文章</h2>

        {!list[0] ? (
          <div className="text-center p-4">
            {tags[0] ? (
              <Spinner animation="grow" variant="primary" />
            ) : (
              '暂无数据'
            )}
          </div>
        ) : (
          list.map(item => (
            <ArticleCard key={item.id} className="mt-3" {...item} />
          ))
        )}
      </aside>
    );
  }
}
