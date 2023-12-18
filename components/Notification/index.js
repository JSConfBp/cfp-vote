import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function MySnackbarContentWrapper(props) {
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent

      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar">
          <Icon />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

export default ({
  type,
  message,
  open,
  onClose
}) => {
  return (
    <Snackbar
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        open={ open }
        autoHideDuration={ 5000 }
        onClose={ onClose }
    >
      <div>
        <MySnackbarContentWrapper
            onClose={ onClose }
            variant={ type }
            message={ message }
        />
        </div>
    </Snackbar>
    );
}
