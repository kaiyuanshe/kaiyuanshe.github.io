import dynamic from 'next/dynamic';
import Container from 'react-bootstrap/Container';
import {
  TimeDistance,
  PaginationBar,
  Icon,
  Avatar,
  Nameplate,
  FilterInput,
  FilePicker,
  EditorHTML,
} from 'idea-react';

import PageHead from '../components/PageHead';
import RichEditData from './api/rich-edit.json';

const Editor = dynamic(() => import('../components/Editor'), { ssr: false });

export default function ComponentPage() {
  const title = 'Component examples',
    content = JSON.stringify(RichEditData);

  return (
    <>
      <PageHead title={title} />

      <Container>
        <h1 className="my-4 text-center">{title}</h1>

        <h2 className="mt-3">Time Distance</h2>
        <TimeDistance date="1989-06-04" />

        <h2 className="mt-3">Pagination Bar</h2>
        <PaginationBar
          pathResolver={index => `/test?page=${index}`}
          total={10}
          current={5}
        />
        <h2 className="mt-3">Icon</h2>
        <Icon name="heart" className="text-danger" />

        <h2 className="mt-3">Avatar</h2>
        <Avatar src="https://github.com/idea2app.png" />

        <h2 className="mt-3">Nameplate</h2>
        <Nameplate avatar="https://github.com/idea2app.png" name="idea2app" />

        <h2 className="mt-3">Filter Input</h2>
        <FilterInput name="tags" />

        <h2 className="mt-3">File Picker</h2>
        <FilePicker accept="image/*" multiple name="images" />

        <h2 className="mt-3">Editor</h2>
        <Editor name="content" defaultValue={content} />

        <h2 className="mt-3">Editor HTML</h2>
        <EditorHTML data={content} />
      </Container>
    </>
  );
}
