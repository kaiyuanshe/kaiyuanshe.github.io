import classNames from 'classnames';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Col, Container, Image, ListGroup, Row } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { blobURLOf } from '../../models/Base';
import { Cooperation, CooperationModel } from '../../models/Cooperation';
import { i18n } from '../../models/Translation';
import { compose, translator } from '../api/base';
import { fileURLOf } from '../api/lark/file/[id]';

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
  '亮点赞助',
  '成员赞助',
  '讲师赞助',
  '国际讲师差旅赞助',
  '元宇宙会场赞助',
  '网站支持',
  '报名平台伙伴',
  '视频直播伙伴',
  '战略合作媒体',
  '媒体伙伴',
  '社区伙伴',
] as const;

export const getServerSideProps = compose<
  {},
  { yearGroup: CooperationModel['yearGroup'] }
>(translator, async () => {
  const cooperationStore = new CooperationModel();

  await cooperationStore.getGroup();

  const yearGroup = JSON.parse(JSON.stringify(cooperationStore.yearGroup));

  return { props: { yearGroup } };
});

@observer
export default class CooperationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderGroup(level: (typeof Levels)[number], list: Cooperation[]) {
    const { t } = i18n;

    return (
      <section key={level}>
        <h3 className="my-5">{t(level)}</h3>

        <Row
          as="ul"
          className="list-unstyled align-items-center justify-content-center"
          xs={1}
          sm={2}
          md={4}
        >
          {list.map(({ organization, link, logos }) => (
            <Col as="li" key={organization + ''}>
              <a target="_blank" href={link ? link + '' : ''} rel="noreferrer">
                <Image
                  fluid
                  title={organization + ''}
                  alt={organization + ''}
                  loading="lazy"
                  src={blobURLOf(logos)}
                  onError={({ currentTarget: image }) => {
                    const logo = fileURLOf(logos);

                    if (logo && !image.src.endsWith(logo)) image.src = logo;
                  }}
                />
              </a>
            </Col>
          ))}
        </Row>
      </section>
    );
  }

  render() {
    const { t } = i18n,
      { yearGroup } = this.props;

    return (
      <Container className="my-4 text-center">
        <PageHead title={t('our_partners')} />

        <h1 className="my-5">{t('our_partners')}</h1>

        <ListGroup
          as="nav"
          horizontal
          className="sticky-top justify-content-center overflow-auto"
          style={{ top: '5rem' }}
        >
          {yearGroup.map(([year]) => (
            <ListGroup.Item as="a" key={year} href={'#' + year}>
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
