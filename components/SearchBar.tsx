import { Icon } from 'idea-react';
import { FC } from 'react';
import { Form, FormProps, InputGroup } from 'react-bootstrap';

import styles from '../styles/SearchBar.module.less';

export const SearchBar: FC<FormProps> = props => (
  <Form action="/search" {...props}>
    <InputGroup className="flex-nowrap">
      <InputGroup.Text>
        <Icon name="search" />
      </InputGroup.Text>
      <Form.Control className={styles.input} type="search" name="keywords" />
    </InputGroup>
  </Form>
);
