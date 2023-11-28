import { text2color } from 'idea-react';
import { marked } from 'marked';
import { InferGetServerSidePropsType } from 'next';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Badge, Col, Container, Row } from 'react-bootstrap';

import { CommentBox } from '../../components/Base/CommentBox';
import { LarkImage } from '../../components/Base/LarkImage';
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
  renderProfile = ({ name, tags, email, logo }: Department) => (
    <>
      {logo && (
        <div className="d-flex justify-content-center align-items-center">
          <LarkImage
            className="mb-3 flex-fill object-fit-contain"
            style={{ maxWidth: '10rem' }}
            src={logo}
            alt={name as string}
          />
        </div>
      )}
      <h1>{name}</h1>
      <ul>
        <li>
          {(tags as string[])?.map(tag => (
            <Badge
              as="a"
              key={tag}
              className="text-decoration-none mx-1"
              bg={text2color(tag, ['light'])}
              href={`/search?tag=${tag}`}
            >
              {tag}
            </Badge>
          ))}
        </li>

        {email && (
          <li>
            📬 <a href={email as string}>{(email as string)?.split(':')[1]}</a>
          </li>
        )}
      </ul>
    </>
  );

  render() {
    const { name, summary } = this.props.department;
    const { department } = this.props;

    return (
      <Container className="py-5">
        <PageHead title={name as string} />

        <Row>
          <Col xs={12} sm={4}>
            {this.renderProfile(department)}
          </Col>
          <Col xs={12} sm={8} as="ol" className="list-unstyled">
            {summary && (
              <article
                dangerouslySetInnerHTML={{
                  __html: marked(summary as string),
                }}
              />
            )}
          </Col>
        </Row>

        <CommentBox category="General" categoryId="DIC_kwDOB88JLM4COLSV" />
      </Container>
    );
  }
}
