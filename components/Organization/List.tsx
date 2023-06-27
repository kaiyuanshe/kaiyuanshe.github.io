import { FC } from 'react';
import { Row, Col } from 'react-bootstrap';

import { OrganizationCard, OrganizationCardProps } from './Card';
import { Organization } from '../../models/Organization';

export interface OrganizationListLayoutProps
  extends Pick<OrganizationCardProps, 'onSwitch'> {
  defaultData: Organization[];
}

export const OrganizationListLayout: FC<OrganizationListLayoutProps> = ({
  defaultData,
  onSwitch,
}) => (
  <Row xs={1} sm={2} lg={3} xxl={4} className="g-4 my-2">
    {defaultData.map(({ id, ...org }) => (
      <Col key={org.name as string}>
        <OrganizationCard className="h-100" {...org} onSwitch={onSwitch} />
      </Col>
    ))}
  </Row>
);
