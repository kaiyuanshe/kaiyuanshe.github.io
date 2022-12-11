import { observer } from 'mobx-react';
import { FC } from 'react';
import { Row, Col } from 'react-bootstrap';

import { ScrollList, ScrollListProps } from '../ScrollList';
import { OrganizationCard, OrganizationCardProps } from './Card';
import { Organization, OrganizationModel } from '../../models/Organization';

export interface OrganizationListLayoutProps
  extends Pick<OrganizationCardProps, 'onSwitch'> {
  data: Organization[];
}

export const OrganizationListLayout: FC<OrganizationListLayoutProps> = ({
  data,
  onSwitch,
}) => (
  <Row xs={1} sm={2} lg={3} xxl={4} className="g-4 my-2">
    {data.map(({ id, ...org }) => (
      <Col key={org.name as string}>
        <OrganizationCard className="h-100" {...org} onSwitch={onSwitch} />
      </Col>
    ))}
  </Row>
);

export interface OrganizationListProps
  extends ScrollListProps<Organization>,
    Pick<OrganizationCardProps, 'onSwitch'> {
  store: OrganizationModel;
}

@observer
export class OrganizationList extends ScrollList<OrganizationListProps> {
  store = this.props.store;

  constructor(props: OrganizationListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <OrganizationListLayout
        data={this.store.allItems}
        onSwitch={this.props.onSwitch}
      />
    );
  }
}
