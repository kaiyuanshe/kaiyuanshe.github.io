import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { isEmpty } from 'web-utility';

import { ElectionCard } from '../../../components/Election/ElectorCard';
import PageHead from '../../../components/PageHead';
import { ElectionTarget } from '../../../models/Elector';
import { PersonnelModel } from '../../../models/Personnel';
import { i18n } from '../../../models/Translation';
import { withErrorLog, withRoute, withTranslation } from '../../api/base';

export const getServerSideProps = withRoute<
  { year: string },
  Pick<PersonnelModel, 'group'>
>(
  withErrorLog(
    withTranslation(async ({ params }) => {
      const group = await new PersonnelModel().getGroup(+params!.year);

      return {
        notFound: isEmpty(group),
        props: JSON.parse(JSON.stringify({ group })),
      };
    }),
  ),
);

const { t } = i18n;

const ElectionPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ route, group }) => {
    const { year } = route.params!;

    const title = `${year} ${t('election')}`;

    const passed = +year < new Date().getFullYear();

    return (
      <Container>
        <PageHead title={title} />

        <h1 className="my-5 text-center">{title}</h1>

        <div className="d-flex justify-content-center gap-3 my-3">
          <Button
            variant="warning"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnVxuTa41nb80lCy7H9GXrkb?prefill_%E6%8F%90%E5%90%8D%E7%B1%BB%E5%9E%8B=%E4%BB%BB%E5%91%BD&prefill_%E7%9B%AE%E6%A0%87%E9%83%A8%E9%97%A8=%E7%90%86%E4%BA%8B%E4%BC%9A&prefill_%E7%9B%AE%E6%A0%87%E8%81%8C%E4%BD%8D=%E7%90%86%E4%BA%8B"
            disabled={passed}
          >
            理事提名
          </Button>
          <Button
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcn20SIKJgdsHH9AEGEMYFPwf?prefill_%E7%94%B3%E8%AF%B7%E7%B1%BB%E5%9E%8B=%E4%BB%BB%E5%91%BD&prefill_%E7%94%B3%E8%AF%B7%E8%81%8C%E4%BD%8D=%E6%AD%A3%E5%BC%8F%E6%88%90%E5%91%98"
            disabled={passed}
          >
            正式成员申请
          </Button>
          <Button
            variant="danger"
            target="_blank"
            href="https://kaiyuanshe.feishu.cn/share/base/form/shrcnVYqyX5w8wTNiCLeH7Ziy1g"
            disabled={passed}
          >
            选举投票
          </Button>
        </div>

        {Object.entries(group).map(([target, list]) => (
          <section key={target}>
            <h2 className="my-5 text-center">
              {textJoin(t(target as ElectionTarget) || '', t('candidate'))}
            </h2>

            <Row as="ul" className="list-unstyled g-4" xs={1} sm={2} lg={3}>
              {list
                .sort(
                  (
                    { approvers: a1, rejecters: a2 },
                    { approvers: b1, rejecters: b2 },
                  ) =>
                    (b1 as string[])?.length - (a1 as string[])?.length ||
                    (a2 as string[])?.length - (b2 as string[])?.length,
                )
                .map(({ id, ...item }) => (
                  <Col as="li" key={id + ''}>
                    <ElectionCard className="h-100" {...item} />
                  </Col>
                ))}
            </Row>
          </section>
        ))}
      </Container>
    );
  });

export default ElectionPage;
