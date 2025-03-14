import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { FC } from 'react';

import { MDXLayout } from '../../components/Layout/MDX';

interface ArticleMeta {
  name: string;
  path?: string;
  subs: ArticleMeta[];
}

const MDX_pattern = /\.mdx?$/;

export const getStaticProps: GetStaticProps<{
  list: ArticleMeta[];
}> = async () => {
  const { readdirSync } = await import('fs');

  const pageListOf = (path: string, prefix = 'pages'): ArticleMeta[] =>
    readdirSync(prefix + path, { withFileTypes: true })
      .map(node => {
        let { name, path } = node;

        if (name.startsWith('.')) return;

        const isMDX = MDX_pattern.test(name);

        name = name.replace(MDX_pattern, '');
        path = `${path}/${name}`.replace(new RegExp(`^${prefix}`), '');

        if (node.isFile()) return isMDX && { name, path };

        if (!node.isDirectory()) return;

        const subs = pageListOf(path, prefix);

        return subs[0] && { name, subs };
      })
      .filter(Boolean) as ArticleMeta[];

  try {
    const list = pageListOf('/article/original');

    return { props: { list } };
  } catch {
    return { props: { list: [] } };
  }
};

const renderTree = (list: ArticleMeta[]) => (
  <ol>
    {list.map(({ name, path, subs }) => (
      <li key={name}>
        {path ? (
          <a className="h4" href={path}>
            {name}
          </a>
        ) : (
          <details>
            <summary className="h4">{name}</summary>
            {renderTree(subs)}
          </details>
        )}
      </li>
    ))}
  </ol>
);

const OriginalIndexPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  list,
}) => (
  <MDXLayout className="" title="Original articles">
    {renderTree(list)}
  </MDXLayout>
);

export default OriginalIndexPage;
