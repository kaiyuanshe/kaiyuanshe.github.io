import { Editor as Core, EditorProps } from 'idea-react';

import List from '@editorjs/list';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Image from '@editorjs/image';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';

const Tools = {
  list: List,
  code: Code,
  linkTool: LinkTool,
  image: Image,
  header: Header,
  quote: Quote,
};

export default function Editor(props: Omit<EditorProps, 'tools'>) {
  return <Core tools={Tools} {...props} />;
}
