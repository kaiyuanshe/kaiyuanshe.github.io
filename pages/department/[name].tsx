import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import { CommentBox } from '../../components/Base/CommentBox';
import { GroupCard } from '../../components/Department/Card';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Department, DepartmentModel } from '../../models/Personnel/Department';

export const getServerSideProps = compose<
  { name: string },
  { department: Department }
>(errorLogger, translator(i18n), async ({ params: { name } = {} }) => {
  const [department] = await new DepartmentModel().getList({ name });

  if (!department) return { notFound: true, props: {} };

  return {
    props: JSON.parse(JSON.stringify({ department })),
  };
});

export default class DepartmentDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const { department } = this.props;
    const { name } = department;

    return (
      <Container className="py-5">
        <PageHead title={name as string} />
        <GroupCard {...department} />
        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
