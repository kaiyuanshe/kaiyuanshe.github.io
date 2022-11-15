import { FC } from 'react';
import { FormProps, Form, InputGroup } from 'react-bootstrap';
import { Icon } from 'idea-react';

import styles from '../styles/SearchBar.module.less';

export const SearchBar: FC<FormProps> = props => (
  <Form action="/search" {...props}>
    <InputGroup>
      <InputGroup.Text>
        <Icon name="search" />
      </InputGroup.Text>
      <Form.Control className={styles.input} type="search" name="keywords" />
    </InputGroup>
  </Form>
);
