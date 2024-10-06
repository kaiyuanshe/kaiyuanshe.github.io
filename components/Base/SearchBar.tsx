import { observer } from 'mobx-react';
import { FC } from 'react';
import {
  Button,
  Form,
  FormControlProps,
  FormProps,
  InputGroup,
  InputGroupProps,
} from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';
import styles from './SearchBar.module.less';

export interface SearchBarProps
  extends FormProps,
    Pick<InputGroupProps, 'size'>,
    Pick<FormControlProps, 'name' | 'placeholder'> {
  expanded?: boolean;
}

export const SearchBar: FC<SearchBarProps> = observer(
  ({
    action = '/search',
    size,
    name = 'keywords',
    placeholder = i18n.t('keyword'),
    expanded = true,
    ...props
  }) => (
    <Form {...{ action, ...props }}>
      <InputGroup size={size}>
        <Form.Control
          className={expanded ? '' : styles.input}
          type="search"
          {...{ name, placeholder }}
        />
        <Button type="submit" variant="light">
          🔍
        </Button>
      </InputGroup>
    </Form>
  ),
);
