import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import { AgenDaFileList } from '../components/Activity/Agenda/FileList';
import PageHead from '../components/Layout/PageHead';
import { AgendaFile, AgendaFileModel } from '../models/Activity/AgendaFile';
import { i18n } from '../models/Base/Translation';

export const getServerSideProps = compose<{}, { list: AgendaFile[] }>(
  translator(i18n),
  async () => {
    const list = await new AgendaFileModel().getAll();
    return { props: { list: JSON.parse(JSON.stringify(list)) } };
  },
);

const { t } = i18n;

const FileListPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ list }) => (
    <Container className="py-5 text-center">
      <PageHead title={t('community_list')} />
      <h1 className="mb-5 text-center">{t('community_list')}</h1>
      {console.log(JSON.stringify(list))}
      <AgenDaFileList list={list} />
    </Container>
  ));

export default FileListPage;
