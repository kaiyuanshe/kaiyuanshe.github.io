import { TableCellAttachment } from 'mobx-lark';
import { FilePreview } from 'mobx-restful-table';
import { FC } from 'react';
import { Badge } from 'react-bootstrap';

import { i18n } from '../../../models/Base/Translation';

const { t } = i18n;

export const FileList: FC<{ data: TableCellAttachment[] }> = ({ data }) => (
  <section>
    <h2>{t('file_download')}</h2>
    <ol>
      {data.map(({ id, name, mimeType, attachmentToken }) => (
        <li key={id + ''}>
          <FilePreview
            type={mimeType}
            path={`/api/lark/file/${attachmentToken}`}
          />
          <Badge>{name}</Badge>
        </li>
      ))}
    </ol>
  </section>
);
