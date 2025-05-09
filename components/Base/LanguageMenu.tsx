import { Option, Select } from 'idea-react';
import { observer } from 'mobx-react';
import { FC, useContext } from 'react';

import { I18nContext, LanguageName } from '../../models/Base/Translation';

const LanguageMenu: FC = observer(() => {
  const i18n = useContext(I18nContext);
  const { currentLanguage } = i18n;

  return (
    <Select
      value={currentLanguage}
      onChange={code => i18n.loadLanguages(code as typeof currentLanguage)}
    >
      {Object.entries(LanguageName).map(([code, name]) => (
        <Option key={code} value={code}>
          {name}
        </Option>
      ))}
    </Select>
  );
});
export default LanguageMenu;
