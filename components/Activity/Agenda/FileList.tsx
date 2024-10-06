import { text2color } from 'idea-react';
import { TableCellAttachment } from 'mobx-lark';
import { observer } from 'mobx-react';
import { FilePreview } from 'mobx-restful-table';
import { FC } from 'react';
import { Badge } from 'react-bootstrap';

import { t } from '../../../models/Base/Translation';

export const FileList: FC<{ data: TableCellAttachment[] }> = observer(
  ({ data }) => (
    <section>
      <h2>{t('file_download')}</h2>
      <ol className="mt-3 mb-5">
        {data.map(({ id, name, mimeType, attachmentToken }) => (
          <li key={id + ''}>
            <FilePreview
              type={mimeType}
              path={`/api/lark/file/${attachmentToken}`}
            />

            <Badge bg={text2color(name, ['light'])}>{name}</Badge>
          </li>
        ))}
      </ol>
    </section>
  ),
);
