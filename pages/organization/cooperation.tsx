import { groupBy } from 'web-utility';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, ListGroup, Image } from 'react-bootstrap';
import { InferGetServerSidePropsType } from 'next';

import PageHead from '../../components/PageHead';
import { StaticRoot } from '../../models/Base';
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

export async function getServerSideProps() {
  const cooperation = await organizationStore.getCooperation();

  const yearGroup = Object.entries(cooperation)
    .sort(([x], [y]) => +y - +x)
    .map(([year, list]) => [+year, groupBy(list, 'level')]) as [
    number,
    Record<string, Cooperation[]>,
  ][];

  return { props: { yearGroup } };
}

@observer
export default class CooperationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
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
                  src={`${StaticRoot}/${organization}.png`}
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  render() {
    const { yearGroup } = this.props;

    return (
      <Container className="d-flex flex-wrap my-4 text-center">
        <PageHead title="合作伙伴" />

        <h1 className="w-100 my-5">合作伙伴</h1>

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
