import { TableCellAttachment } from 'mobx-lark';
import { FC } from 'react';
import { Badge, Col, Row } from 'react-bootstrap';

export const FileList: FC<{ fileInfo: TableCellAttachment[] }> = ({
  fileInfo,
}) => (
  <Row as="section" className="justify-content-center" xs={1}>
    <Col>资料下载</Col>
    {fileInfo.map(({ id, name, attachmentToken }) => (
      <Col key={id + ''}>
        <a href={`/api/lark/file/${attachmentToken}`} download={name}>
          <Badge bg="success">{name}</Badge>
        </a>
      </Col>
    ))}
  </Row>
);
