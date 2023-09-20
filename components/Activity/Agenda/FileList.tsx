import { FilePreview } from 'mobx-restful-table';
import { FC } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';

import { AgendaFile } from '../../../models/Activity/AgendaFile';

export const AgenDaFileList: FC<{ list: AgendaFile[] }> = ({ list }) => (
  <Row as="section" className="justify-content-center text-center" xs={1}>
    {console.log(list)}
    {list.map(
      ({ file }) =>
        file?.map(({ file_token, name }) => (
          <Col key={file_token}>
            <a href={`/api/lark/file/${file_token}`} download={name}>
              <Badge bg="success">{name}</Badge>
            </a>
          </Col>
        )),
    )}
  </Row>
);
