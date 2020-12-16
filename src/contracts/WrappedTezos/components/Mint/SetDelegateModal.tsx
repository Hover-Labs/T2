import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { OperationKindType } from 'conseiljs';
import IconButton from '@material-ui/core/IconButton';
import TextField from '../../../../components/TextField';
import TezosNumericInput from '../../../../components/TezosNumericInput';
import { setDelegateForOven } from '../../thunks';

import Modal from '../../../../components/CustomModal';
import Tooltip from '../../../../components/Tooltip/';
import { ms } from '../../../../styles/helpers';
import TezosIcon from '../../../../components/TezosIcon';
import Button from '../../../../components/Button';
import Loader from '../../../../components/Loader';
import Fees from '../../../../components/Fees/';
import PasswordInput from '../../../../components/PasswordInput';
import InputAddress from '../../../../components/InputAddress';
import TezosAmount from '../../../../components/TezosAmount';
import AddDelegateLedgerModal from '../../../../components/ConfirmModals/AddDelegateLedgerModal';

import { originateContractThunk } from '../../../../reduxContent/originate/thunks';
import { useFetchFees } from '../../../../reduxContent/app/thunks';
import { setIsLoadingAction } from '../../../../reduxContent/app/actions';

import { RootState } from '../../../../types/store';

const InputAddressContainer = styled.div`
    padding: 0 76px;
`;

const AmountFeePassContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 43%;
    justify-content: center;
`;

const AmountSendContainer = styled.div`
    width: 100%;
    position: relative;
`;

const FeeContainer = styled.div`
    width: 100%;
    display: flex;
    height: 64px;
`;

const PasswordButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 42px;
    padding: 0 76px 15px 76px;
    background-color: ${({ theme: { colors } }) => colors.gray1};
    height: 100px;
`;

const DelegateButton = styled(Button)`
    width: 194px;
    height: 50px;
    margin-bottom: 10px;
    margin-left: auto;
`;

const MainContainer = styled.div`
    display: flex;
    padding: 20px 76px 0 76px;
`;
const BalanceContainer = styled.div`
    padding: 0 0px 0 20px;
    flex: 1;
    position: relative;
    margin: 0 0 0px 35px;
`;

const BalanceArrow = styled.div`
    top: 50%;
    left: 4px;
    margin-top: -17px;
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
    border-right: 20px solid ${({ theme: { colors } }) => colors.gray1};
    width: 0;
    height: 0;
    position: absolute;
`;

const BalanceContent = styled.div`
    padding: ${ms(1)} ${ms(1)} ${ms(1)} ${ms(4)};
    color: #123262;
    text-align: left;
    height: 100%;
    background-color: ${({ theme: { colors } }) => colors.gray1};
`;

const GasInputContainer = styled.div`
    width: 100%;
    position: relative;
`;

const TezosIconInput = styled(TezosIcon)`
    position: absolute;
    left: 70px;
    top: 25px;
    display: block;
`;

const UseMax = styled.div`
    position: absolute;
    right: 23px;
    top: 24px;
    font-size: 12px;
    font-weight: 500;
    display: block;
    color: ${({ theme: { colors } }) => colors.accent};
    cursor: pointer;
`;
const TotalAmount = styled(TezosAmount)`
    margin-bottom: 22px;
`;

const BalanceAmount = styled(TezosAmount)``;

const WarningIcon = styled(TezosIcon)`
    padding: 0 ${ms(-9)} 0 0;
    position: relative;
    top: 1px;
`;

const BalanceTitle = styled.div`
    color: ${({ theme: { colors } }) => colors.gray5};
    font-size: 14px;
    font-weight: 300;
`;

const ErrorContainer = styled.div`
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme: { colors } }) => colors.error1};
`;

const BurnTooltip = styled(IconButton)`
    &&& {
        position: absolute;
        right: 110px;
        top: 20px;
    }
`;

const TooltipContainer = styled.div`
    padding: 10px;
    color: #000;
    font-size: 14px;
    max-width: 312px;
`;

const TooltipTitle = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme: { colors } }) => colors.primary};
`;

const TooltipContent = styled.div`
    margin-top: 8px;
    font-size: 14px;
    line-height: 21px;
    width: 270px;
    font-weight: 300;
    color: ${({ theme: { colors } }) => colors.black};
`;

const BoldSpan = styled.span`
    font-weight: 500;
`;

const MessageContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: flex-start;
    height: 30px;
    width: 100%;
    color: #4e71ab;
    font-weight: 300;
`;

const utez = 1000000;

const FEES = {
    low: 0,
    medium: 60000,
    high: 1000000,
};

interface Props {
    ovenAddress: string;
    open: boolean;
    managerBalance: number;
    onClose: () => void;
}

const defaultState = {
    // Needed?
    amount: '',
    fee: FEES.medium,
    // TODO(keefertaylor): Needed?
    total: 0,
    balance: 0,
};

// TODO(keefertaylor): Investigate if we require the ledger variant as well.
// TODO(keefertaylor): Remove redundant information - gas, etc
// TODO(keefertaylor): Include oven as a property.
// TODO(keefertaylor): Display oven address somewhere.
function AddDelegateModal(props: Props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [state, setState] = useState(defaultState);
    const [delegate, setDelegate] = useState('');
    const [passPhrase, setPassPhrase] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDelegateIssue, setIsDelegateIssue] = useState(false);
    const [balance, setBalance] = useState(props.managerBalance - defaultState.fee);
    const { amount, fee, total } = state;

    const { isLoading, isLedger, selectedParentHash } = useSelector((rootState: RootState) => rootState.app, shallowEqual);
    const { open, managerBalance, ovenAddress, onClose } = props;

    const isDisabled = isLoading || !delegate || (!passPhrase && !isLedger) || isDelegateIssue;

    function updateState(updatedValues) {
        setState((prevState) => {
            return { ...prevState, ...updatedValues };
        });
    }

    async function updateDelegate() {
        dispatch(setIsLoadingAction(true));
        if (isLedger) {
            setConfirmOpen(true);
        }

        const delegateSet = await dispatch(setDelegateForOven(ovenAddress, delegate, fee, passPhrase));

        setConfirmOpen(false);
        dispatch(setIsLoadingAction(false));
        if (!!delegateSet) {
            onClose();
        }
    }

    function onCloseClick() {
        const newTotal = FEES.medium;
        updateState({ fee: FEES.medium, total: newTotal, balance: managerBalance - newTotal });
        onClose();
    }

    function getBalanceState() {
        if (balance < 0) {
            return {
                isIssue: true,
                warningMessage: t('components.addDelegateModal.warning1'),
                balanceColor: 'error1',
            };
        }

        if (amount) {
            return {
                isIssue: false,
                warningMessage: '',
                balanceColor: 'gray3',
            };
        }
        return {
            isIssue: false,
            warningMessage: '',
            balanceColor: 'gray8',
        };
    }

    function changeFee(newFee) {
        const newAmount = amount || '0';
        const numAmount = parseFloat(newAmount) * utez;
        const newTotal = numAmount + newFee;
        const newBalance = managerBalance - total;
        updateState({ fee: newFee, total: newTotal, balance: newBalance });
    }

    const { isIssue, warningMessage, balanceColor } = getBalanceState();

    // TODO: if delegate is set, show it and validate against it
    // TODO: if delegate is set, title should be Change Delegate
    return (
        // TODO(keefertaylor): Use translations here.
        <Modal title={'Set Delegate'} open={open} onClose={onCloseClick}>
            <MainContainer>
                <MessageContainer>
                    {/* TODO(keefertaylor): Use Translations */}
                    <BoldSpan>Oven:</BoldSpan>
                    {ovenAddress}
                </MessageContainer>
            </MainContainer>
            <InputAddressContainer>
                <InputAddress
                    label={t('general.nouns.delegate_address')}
                    operationType="delegate"
                    tooltip={true}
                    onChange={(val) => setDelegate(val)}
                    onIssue={(flag) => setIsDelegateIssue(flag)}
                />
            </InputAddressContainer>
            <MainContainer>
                <AmountFeePassContainer>
                    <FeeContainer>
                        <Fees low={FEES.low} medium={FEES.medium} high={FEES.high} fee={fee} miniFee={FEES.low} onChange={changeFee} />
                    </FeeContainer>
                </AmountFeePassContainer>
                <BalanceContainer>
                    <BalanceArrow />
                    <BalanceContent>
                        <BalanceTitle>{t('general.nouns.total')}</BalanceTitle>
                        <TotalAmount weight="500" color={amount ? 'gray3' : 'gray8'} size={ms(0.65)} amount={total} />
                        <BalanceTitle>{t('general.nouns.remaining_balance')}</BalanceTitle>
                        <BalanceAmount weight="500" color={balanceColor} size={ms(-0.75)} amount={balance} />
                        {isIssue && (
                            <ErrorContainer>
                                <WarningIcon iconName="warning" size={ms(-1)} color="error1" />
                                {warningMessage}
                            </ErrorContainer>
                        )}
                    </BalanceContent>
                </BalanceContainer>
            </MainContainer>

            <PasswordButtonContainer>
                {!isLedger && (
                    <PasswordInput
                        label={t('general.nouns.wallet_password')}
                        password={passPhrase}
                        onChange={(val) => setPassPhrase(val)}
                        containerStyle={{ width: '60%', marginTop: '10px' }}
                    />
                )}
                <DelegateButton buttonTheme="primary" disabled={isDisabled} onClick={() => updateDelegate()}>
                    {/* TODO(keefertaylor): translations */}
                    Set Oven Delegate
                </DelegateButton>
            </PasswordButtonContainer>
            {isLoading && <Loader />}
            {isLedger && open && (
                <AddDelegateLedgerModal
                    amount={amount}
                    fee={fee}
                    address={delegate}
                    source={selectedParentHash}
                    manager={selectedParentHash}
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    isLoading={isLoading}
                />
            )}
        </Modal>
    );
}

export default AddDelegateModal;