import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { WalletClient, BeaconMessageType, BeaconRequestOutputMessage, ConnectionContext } from '@airgap/beacon-sdk';

import { setBeaconMessageAction, setBeaconLoading, setBeaconClientAction } from '../../reduxContent/app/actions';
import { setModalOpen, setModalValue } from '../../reduxContent/modal/actions';
import { createMessageAction } from '../../reduxContent/message/actions';

import { getMainNode } from '../../utils/settings';

import { RootState } from '../../types/store';

export const beaconClient = new WalletClient({ name: 'Beacon Wallet Client' });

export const BeaconConnect = () => {
    const dispatch = useDispatch();
    const { settings } = useSelector((rootState: RootState) => rootState, shallowEqual);
    const modalValues = useSelector<RootState, any>((state) => state.modal.values);
    const beaconMessage = useSelector((state: RootState) => state.app.beaconMessage);
    const beaconConnection = useSelector((state: RootState) => state.app.beaconConnection);
    const selectedAccountHash = useSelector((state: RootState) => state.app.selectedAccountHash);
    const beaconClientLoaded = useSelector((state: RootState) => state.app.beaconClient);
    const isError = useSelector((state: RootState) => state.message.isError);
    const beaconLoading = useSelector((state: RootState) => state.app.beaconLoading);

    const connectedBlockchainNode = getMainNode(settings.nodesList, settings.selectedNode);

    const onBeaconMessage = (message: BeaconRequestOutputMessage, connection: ConnectionContext) => {
        if (message.type === BeaconMessageType.PermissionRequest) {
            console.log('Beacon.PermissionRequest', message);
            if (connectedBlockchainNode.network !== message.network.type) {
                dispatch(createMessageAction('Beacon network not match', true));
                return;
            }

            if (!Object.keys(modalValues).length || !Object.keys(modalValues).includes('beaconRegistration')) {
                dispatch(createMessageAction('Beacon registration request not exist', true));
                return;
            }

            if (connection.id !== modalValues.beaconRegistration.publicKey) {
                dispatch(createMessageAction('Beacon connection not match', true));
                return;
            }

            dispatch(setBeaconLoading());
            dispatch(setModalValue(message, 'beaconPermission'));
            dispatch(setModalOpen(false, 'beaconRegistration'));
            dispatch(setModalOpen(true, 'beaconPermission'));
        } else if (message.type === BeaconMessageType.OperationRequest) {
            console.log('Beacon.OperationRequest', message);

            if (message.sourceAddress !== selectedAccountHash) {
                dispatch(createMessageAction('Beacon address not match', true));
                return;
            }

            if (connectedBlockchainNode.network !== message.network.type) {
                dispatch(createMessageAction(`Beacon unexpected network: ${message.network.type}`, true));
                return;
            }

            if (!message.operationDetails.length) {
                dispatch(createMessageAction('Beacon key not match', true));
                return;
            }

            // temporary accept transactions only
            if (!message.operationDetails.filter((o) => o.kind === 'transaction').length) {
                dispatch(createMessageAction('Beacon transactions only', true));
                return;
            }

            dispatch(setModalValue(message, 'beaconAuthorize'));
            dispatch(setModalOpen(true, 'beaconAuthorize'));
        }
    };

    useEffect(() => {
        if (!isError || !beaconLoading) {
            return;
        }

        dispatch(dispatch(setBeaconLoading()));
    }, [isError, beaconLoading]);

    useEffect(() => {
        if (!beaconMessage || !beaconConnection) {
            return;
        }
        onBeaconMessage(beaconMessage, beaconConnection);
    }, [beaconMessage, beaconConnection]);

    useEffect(() => {
        if (beaconClientLoaded) {
            return;
        }

        dispatch(setBeaconClientAction(true));

        const init = async () => {
            try {
                await beaconClient.init();
                await beaconClient.connect((message, connection) => dispatch(setBeaconMessageAction(message, connection)));
                console.log('BeaconConnect.Loaded');
            } catch (e) {
                console.log('BeaconConnectError', e);
            }
        };
        init();
    }, []);

    return null;
};
