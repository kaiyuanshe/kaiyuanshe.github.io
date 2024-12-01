import { Dialog, Loading } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { splitArray } from 'web-utility';

import { Organization } from '../../models/Community/Organization';
import { LarkImage } from '../Base/LarkImage';
import { OrganizationCard } from './Card';
import { OpenCollaborationMapProps } from './index';

@observer
export default class OpenCollaborationLandscape extends Component<OpenCollaborationMapProps> {
  @observable
  accessor itemSize = 5;

  componentDidMount() {
    this.props.store.groupAllByTags();
  }

  modal = new Dialog<{ name?: string }>(({ defer, name }) => (
    <Modal show={!!defer} onHide={() => defer?.resolve()}>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{this.renderCard(name!)}</Modal.Body>
    </Modal>
  ));

  renderCard(name: string) {
    const organization = this.props.store.allItems.find(
      ({ name: n }) => n === name,
    );
    if (!organization) return <></>;

    const { id, ...data } = organization;

    return <OrganizationCard {...data} />;
  }

  renderLogo = ({ name, logos }: Organization) => (
    <li
      key={name as string}
      className="border"
      onClick={() => this.modal.open({ name: name as string })}
    >
      <LarkImage
        className="object-fit-contain"
        style={{ width: this.itemSize + 'rem', height: this.itemSize + 'rem' }}
        src={logos}
      />
    </li>
  );

  render() {
    const { downloading, tagMap } = this.props.store;
    const rows = splitArray(Object.entries(tagMap), 2);

    return (
      <>
        {downloading > 0 && <Loading />}

        {rows.map(row => (
          <ul className="list-unstyled d-flex gap-2">
            {row.map(([name, list]) => (
              <li key={name} className="flex-fill">
                <h2
                  className="h5 p-2 text-white"
                  style={{ backgroundColor: 'rgb(52,112,159)' }}
                >
                  {name}
                </h2>

                <ol className="list-unstyled d-flex flex-wrap gap-2">
                  {list.map(this.renderLogo)}
                </ol>
              </li>
            ))}
          </ul>
        ))}
        <this.modal.Component />
      </>
    );
  }
}
