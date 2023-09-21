import { FilePreview } from 'mobx-restful-table';
import { FC } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';

import { AgendaFile } from '../../../models/Activity/AgendaFile';

export const AgenDaFileList: FC<{ list: AgendaFile[] }> = ({ list }) => (
  <Row as="section" className="flex-start" xs={1}>
    {console.log(list)}
    <p>相关资料</p>
    {list.map(
      ({ file }) =>
        file?.map(({ file_token, name }, index) => (
          <>
            <ol key={file_token}>
              <li key={index}>
                <a href={`/api/lark/file/${file_token}`} download={name}>
                  <Badge bg="success">{name}</Badge>
                </a>
              </li>
            </ol>
          </>
        )),
    )}
  </Row>
);
