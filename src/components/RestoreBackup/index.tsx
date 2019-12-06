import React, { Fragment, useState } from 'react';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from 'react-i18next';
import TextField from '../TextField';
import Button from '../Button';
import SeedInput from './SeedInput';
import PasswordInput from '../PasswordInput';
// import { importAddress } from '../../reduxContent/wallet/thunks';
import * as ADD_ADDRESS_TYPES from '../../constants/AddAddressTypes';
import seedJson from './seed.json';

const MainContainer = styled.div`
  position: relative;
  min-height: 300px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
`;
const RestoreHeader = styled.div`
  font-size: 18px;
  font-weight: 300;
  display: flex;
  margin-bottom: 30px;
  color: ${({ theme: { colors } }) => colors.gray0};
`;
const RestoreTabContainer = styled.div`
  display: flex;
  border-radius: 35px;
  width: 284px;
  font-size: 12px;
  line-height: 31px;
  text-align: center;
  overflow: hidden;
  margin-left: 10px;
  font-weight: 500;
`;

const RestoreTabItem = styled.div<{ active: boolean }>`
  background-color: ${({ theme: { colors }, active }) =>
    active ? colors.accent : 'rgba(148, 169, 209, 0.13)'};
  color: ${({ theme: { colors }, active }) => (active ? colors.white : colors.index0)};
  flex: 1;
`;
const ToggleContainer = styled.div`
  max-width: 60%;
  margin-top: 35px;
  display: flex;
  align-items: center;
`;
const ToggleLabel = styled.div`
  font-size: 16px;
  color: ${({ theme: { colors } }) => colors.black2};
  font-weight: 300;
`;

const RestoreFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  padding-top: 50px;
`;
const RestoreButton = styled(Button)`
  width: 194px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  padding: 0 !important;
`;
interface Props1 {
  type: string;
  changeFunc: (val: string) => void;
  t: any;
}

const RestoreTabs = (props: Props1) => {
  const { type, changeFunc, t } = props;

  return (
    <RestoreTabContainer>
      <RestoreTabItem active={type === 'phrase'} onClick={() => changeFunc('phrase')}>
        {t('components.restoreBackup.seed_phrase')}
      </RestoreTabItem>
      <RestoreTabItem active={type === 'key'} onClick={() => changeFunc('key')}>
        {t('components.restoreBackup.private_key')}
      </RestoreTabItem>
    </RestoreTabContainer>
  );
};

interface OwnProps {
  importAddress?: () => void;
}

type Props = OwnProps & WithTranslation;

function RestoreBackup(props: Props) {
  const { t } = props;
  const [type, setType] = useState('phrase');
  const [seeds, setSeeds] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);

  const importAddress = () => {
    const str = '';

    // if (seeds.length) {
    //   str = seeds.join(' ');
    // }

    // if (inputValue) {
    //   if (seeds.length) {
    //     str += ` ${inputValue}`;
    //   } else {
    //     str = inputValue;
    //   }
    // }

    // this.props.importAddress(
    //   ADD_ADDRESS_TYPES.RESTORE,
    //   str,
    //   '',
    //   '',
    //   '',
    //   password,
    //   key
    // );
  };

  const onEnterPress = (keyValue, disabled) => {
    if (keyValue === 'Enter' && !disabled && (seeds.length === 15 || seeds.length === 24)) {
      importAddress();
    }
  };

  let isdisabled = false;
  if (type === 'phrase') {
    isdisabled = ![12, 15, 18, 21, 24].includes(seeds.length) || error;
  } else {
    isdisabled = !key;
  }
  return (
    <MainContainer onKeyDown={event => onEnterPress(event.key, isdisabled)}>
      <RestoreHeader>
        {t('components.restoreBackup.restore_from')}
        <RestoreTabs type={type} t={t} changeFunc={val => setType(val)} />
      </RestoreHeader>
      {type === 'phrase' && (
        <Fragment>
          <SeedInput
            placeholder={t('containers.homeAddAddress.secret_key_15')}
            seeds={seeds}
            onChange={val => setSeeds(val)}
            onError={err => setError(err)}
          />

          <ToggleContainer>
            <ToggleLabel>{t('components.restoreBackup.seed_encrypted_label')}</ToggleLabel>
            <Switch color="secondary" onChange={() => setIsPassword(!isPassword)} />
          </ToggleContainer>

          {isPassword && (
            <PasswordInput
              label={t('components.restoreBackup.seed_phrase_password')}
              password={password}
              changFunc={val => setPassword(val)}
              containerStyle={{ width: '60%' }}
            />
          )}
        </Fragment>
      )}
      {type === 'key' && (
        <TextField
          label={t('components.restoreBackup.enter_private_key')}
          value={key}
          onChange={val => setKey(val)}
        />
      )}
      <RestoreFooter>
        <RestoreButton buttonTheme="primary" disabled={isdisabled} onClick={importAddress}>
          {t('general.verbs.restore')}
        </RestoreButton>
      </RestoreFooter>
    </MainContainer>
  );
}

export default withTranslation()(RestoreBackup);