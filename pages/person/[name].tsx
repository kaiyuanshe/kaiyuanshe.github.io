import { text2color } from 'idea-react';
import { InferGetServerSidePropsType } from 'next';
import { Badge, Container, Image } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { Person, PersonModel } from '../../models/Person';
import { withErrorLog, withTranslation } from '../api/base';

export const getServerSideProps = withErrorLog<
  { name: string },
  { person: Person }
>(
  withTranslation(async ({ params }) => {
    const [person] = await new PersonModel().getList({ name: params!.name });

    return { props: JSON.parse(JSON.stringify({ person })) };
  }),
);

export default function PersonDetailPage({
  person,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container className="py-5">
      <PageHead title={person.name as string} />

      <Image src={`${person.github || 'https://github.com/kaiyuanshe'}.png`} />

      <h1>{person.name}</h1>
      <ul>
        <li>
          <Badge bg={text2color(person.gender as string, ['light'])}>
            {person.gender}
          </Badge>
        </li>
        <li>
          {(person.skills as string[]).map(skill => (
            <Badge
              key={skill}
              className="me-2"
              bg={text2color(skill, ['light'])}
            >
              {skill}
            </Badge>
          ))}
        </li>
        <li>🗺 {person.city}</li>
        <li>
          📬{' '}
          <a href={person.email as string}>
            {(person.email as string).split(':')[1]}
          </a>
        </li>
        <li>
          🖥{' '}
          <a target="_blank" href={person.website as string} rel="noreferrer">
            {person.website}
          </a>
        </li>
        <li>
          ⌨{' '}
          <a target="_blank" href={person.github as string} rel="noreferrer">
            {person.github}
          </a>
        </li>
      </ul>
      <article>{person.summary}</article>
    </Container>
  );
}
