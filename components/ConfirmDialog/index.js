import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default ({ 
    title, 
    message,
    open,
    onConfirm,
    onCancel,
    confirmButtonLabel,
    cancelButtonLabel,
}) => {
    return (<Dialog
        open={open}
        onClose={ () => onCancel() }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{ title }</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                { message }
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={ () => onCancel() } color="primary">
                { cancelButtonLabel || "Cancel" }
            </Button>
            <Button onClick={ () => onConfirm() } color="primary" autoFocus variant={ 'contained' }>
                { confirmButtonLabel || "Confirm" }
            </Button>
        </DialogActions>
    </Dialog>)
}