import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
