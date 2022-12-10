import { groupBy } from 'web-utility';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, ListGroup, Image } from 'react-bootstrap';
import { Loading } from 'idea-react';

import PageHead from '../../components/PageHead';
import { i18n } from '../../models/Translation';
import { isServer, fileBaseURI } from '../../models/Base';
import organizationStore, { Cooperation } from '../../models/Organization';

const Levels = [
  '战略赞助',
  '白金赞助',
  '金牌赞助',
  '银牌赞助',
  '铜牌赞助',
  '亮点赞助',
  '成员赞助',
  '国际讲师差旅赞助',
  '报名平台伙伴',
  '视频直播伙伴',
  '指导单位',
  '大会合作单位',
  '社区伙伴',
  '媒体伙伴',
];

@observer
export default class CooperationPage extends PureComponent {
  @computed
  get yearGroup() {
    const { cooperation } = organizationStore;

    return Object.entries(cooperation)
      .sort(([x], [y]) => +y - +x)
      .map(([year, list]) => [+year, groupBy(list, 'level')]) as [
      number,
      Record<string, Cooperation[]>,
    ][];
  }

  componentDidMount() {
    if (!isServer()) organizationStore.getCooperation();
  }

  renderGroup(level: string, list: Cooperation[], size = 1) {
    return (
      <section key={level}>
        <h3 className="my-5">{level}</h3>

        <ul className="list-inline">
          {list.map(({ organization, link }) => (
            <li className="list-inline-item" key={organization + ''}>
              <a target="_blank" href={link + ''} rel="noreferrer">
                <Image
                  style={{ maxWidth: size * 10 + 'rem' }}
                  title={organization + ''}
                  alt={organization + ''}
                  loading="lazy"
                  src={`${fileBaseURI}/${organization}.png`}
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  render() {
    const { yearGroup } = this,
      { t } = i18n,
      { downloading } = organizationStore;

    return (
      <Container className="d-flex flex-wrap my-4 text-center">
        {downloading > 0 && <Loading />}

        <PageHead title={t('partner')} />

        <h1 className="w-100 my-5">{t('partner')}</h1>

        <article className="flex-fill">
          {yearGroup.map(([year, group]) => (
            <section key={year}>
              <h2 className="my-4" id={year + ''}>
                {year}
              </h2>

              {Levels.map(
                (level, index) =>
                  group[level] &&
                  this.renderGroup(level, group[level], index < 5 ? 1.5 : 1),
              )}
            </section>
          ))}
        </article>

        <ListGroup as="nav">
          {yearGroup.map(([year]) => (
            <ListGroup.Item as="a" key={year} href={'#' + year}>
              {year}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    );
  }
}
