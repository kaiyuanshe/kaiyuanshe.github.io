import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Spinner } from 'react-bootstrap';

import { ArticleCard } from './Card';
import { BaseArticle } from '../../pages/api/article';
import articleStore, { Article } from '../../models/Article';
import { i18n } from '../../models/Translation';

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
      { downloading, currentRecommend } = articleStore,
      { t } = i18n;

    return (
      <aside className={className}>
        <h2 className="mt-4">{t('related_articles')}</h2>

        {!currentRecommend[0] ? (
          <div className="text-center p-4">
            {downloading > 0 ? (
              <Spinner animation="grow" variant="primary" />
            ) : (
              t('no_data')
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
