import { TableCellAttachment } from 'mobx-lark';
import { FC } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';

import { i18n } from '../../../models/Base/Translation';

const { t } = i18n;

export const FileList: FC<{ fileInfo: TableCellAttachment[] }> = ({
  fileInfo,
}) => (
  <Row as="section" className="justify-content-center" xs={1}>
    <h2>{t('data_download')}</h2>
    {fileInfo.map(({ id, name, attachmentToken }) => (
      <Col key={id + ''}>
        <a href={`/api/lark/file/${attachmentToken}`} download={name}>
          <Badge bg="success">{name}</Badge>
        </a>
      </Col>
    ))}
  </Row>
);
