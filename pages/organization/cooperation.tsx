import classNames from 'classnames';
import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { compose, translator } from 'next-ssr-middleware';
import { Component } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';

import { LarkImage } from '../../components/Base/LarkImage';
import { PageHead } from '../../components/Layout/PageHead';
import { i18n, t } from '../../models/Base/Translation';
import {
  Cooperation,
  CooperationModel,
} from '../../models/Community/Cooperation';

const Levels = [
  '主办单位',
  '承办单位',
  '协办单位',
  '指导单位',
  '大会合作单位',
  '战略赞助',
  '白金赞助',
  '金牌赞助',
  '银牌赞助',
  '铜牌赞助',
  '星牌赞助',
  '特别支持',
  '亮点赞助',
  '成员赞助',
  '讲师赞助',
  '国际讲师差旅赞助',
  '元宇宙会场赞助',
  '网站支持',
  '报名平台伙伴',
  '视频直播伙伴',
  '战略合作社区',
  '战略合作媒体',
  '媒体伙伴',
  '社区伙伴',
] as const;

const singleLineBenefitsLevels: TableCellValue[] = ['白金赞助'];

type CooperationPageProps = { yearGroup: CooperationModel['yearGroup'] };

export const getServerSideProps = compose<{}, CooperationPageProps>(
  translator(i18n),
  async () => {
    const cooperationStore = new CooperationModel();

    await cooperationStore.getGroup();

    const yearGroup = JSON.parse(JSON.stringify(cooperationStore.yearGroup));

    return { props: { yearGroup } };
  },
);

@observer
export default class CooperationPage extends Component<CooperationPageProps> {
  renderGroup(level: (typeof Levels)[number], list: Cooperation[]) {
    return (
      <section key={level}>
        <h3 className="my-5">{t(level)}</h3>

        <Row
          as="ul"
          className="list-unstyled align-items-center justify-content-center"
        >
          {list.map(({ organization, link, logos, level }) => {
            const isSingleLineBenefitsLevels =
              singleLineBenefitsLevels.includes(level);

            return (
              <Col
                key={organization + ''}
                as="li"
                className={isSingleLineBenefitsLevels ? 'w-50 mx-5 my-2' : ''}
                xs={12}
                sm={isSingleLineBenefitsLevels ? 12 : 6}
                md={isSingleLineBenefitsLevels ? 12 : 3}
              >
                <a
                  target="_blank"
                  href={link ? link + '' : ''}
                  rel="noreferrer"
                >
                  <LarkImage
                    title={organization + ''}
                    alt={organization + ''}
                    src={logos}
                  />
                </a>
              </Col>
            );
          })}
        </Row>
      </section>
    );
  }

  render() {
    const { yearGroup } = this.props;

    return (
      <Container className="my-4 text-center">
        <PageHead title={t('our_partners')} />

        <h1 className="my-5">{t('our_partners')}</h1>

        <ListGroup
          as="nav"
          className="sticky-top justify-content-center overflow-auto"
          style={{ top: '5rem' }}
          horizontal
        >
          {yearGroup.map(([year]) => (
            <ListGroup.Item key={year} as="a" href={'#' + year}>
              {year}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <article>
          {yearGroup.map(([year, group], index, { length }) => (
            <section
              key={year}
              className={classNames(
                index + 1 < length && 'border-bottom',
                'pb-5 mb-5',
              )}
            >
              <h2 className="my-4" id={year + ''}>
                {year}
              </h2>

              {Levels.map(
                level => group[level] && this.renderGroup(level, group[level]),
              )}
            </section>
          ))}
        </article>
      </Container>
    );
  }
}
