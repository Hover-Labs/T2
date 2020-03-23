import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import styled from 'styled-components';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import MessageContent from './MessageContent';

import { clearMessageAction } from '../../reduxContent/message/actions';
import { openLinkToBlockExplorer } from '../../utils/general';
import { RootState, MessageState } from '../../types/store';

const SnackbarWrapper = styled(Snackbar)`
  &&& {
    &.MuiSnackbar-root {
      min-width: 500px;
      max-width: 1000px;
      padding: 0;
    }
    .MuiSnackbarContent-root {
      padding: 0;
      width: 100%;
    }
    .MuiSnackbarContent-message {
      padding: 0;
      width: 100%;
    }
  }
`;

function MessageBar() {
  const { text, hash, isError, localeParam } = useSelector<RootState, MessageState>(
    state => state.message,
    shallowEqual
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  function openLink() {
    openLinkToBlockExplorer(hash);
    onClose();
  }

  function formatHash() {
    if (hash.length > 10) {
      return `${hash.slice(0, 4)}...${hash.slice(hash.length - 4, hash.length)}`;
    }
    return hash;
  }

  function onClose() {
    setOpen(false);
    setTimeout(() => {
      dispatch(clearMessageAction());
    }, 200);
  }

  useEffect(() => {
    if (text) {
      setOpen(true);
    }
  }, [text]);

  console.log(`hash in popup '${hash}', '${text}'`);

  return (
    <SnackbarWrapper
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      onClose={() => onClose()}
      message={
        <MessageContent
          content={text}
          hash={formatHash()}
          openLink={() => openLink()}
          onClose={() => onClose()}
          isError={isError}
          localeParam={localeParam}
        />
      }
    />
  );
}

export default MessageBar;