import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import {
  notification, wrapper
} from './styles'

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useNotificationStyles = makeStyles(notification);

function MySnackbarContentWrapper(props) {
  const css = useNotificationStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(css[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={css.message}>
          <Icon className={clsx(css.icon, css.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={css.icon} />
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

const useWrapperStyles = makeStyles(wrapper);

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
        <MySnackbarContentWrapper
            onClose={ onClose }
            variant={ type }
            message={ message }
        />
    </Snackbar>
    );
}