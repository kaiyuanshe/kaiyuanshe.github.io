import { FC } from 'react';
import { Col, Row } from 'react-bootstrap';

import { AgendaFile } from '../../../models/Activity/AgendaFile';
import { fileURLOf } from '../../../pages/api/lark/file/[id]';

export const AgenDaFileList: FC<{ list: AgendaFile[] }> = ({ list }) => (
  <Row
    as="section"
    className="justify-content-center text-center"
    xs={1}
    sm={3}
    xl={5}
  >
    {console.log(list)}
    {list.map(({ id, file }) => (
      <Col key={id + ''} className="my-3"></Col>
    ))}
  </Row>
);

export enum TeamWorkType {
  IMAGE = 'image',
  WEBSITE = 'website',
  VIDEO = 'video',
  Document = 'Document',
  POWERPOINT = 'powerpoint',
}
