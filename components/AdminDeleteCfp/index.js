import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useNotification } from '../NotificationHook'

import ConfirmDialog from '../ConfirmDialog';
import { useTheme } from '@emotion/react';

export default ({ onUpdate, onError }) => {
	const theme = useTheme()

	const [ modalOpen, setModalOpen ] = useState(false)
	const { showError, showSuccess } = useNotification()

	const onConfirm = async () => {
		setModalOpen(false)

		try {
			await fetch('/api/cfp', {
				method: 'delete',
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				}
			})
			showSuccess('Data was deleted successfully!')
			onUpdate()
		} catch (e) {
			showError('Could not delete CFP.')
			onError(e)
		}
	}

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4" sx={{
          marginBottom: theme.spacing(3),
        }}>
					Delete CFP data
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Delete all data related to the uploaded / imported CFP submissions
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Button
					variant={ 'contained' }
					color="secondary"
					onClick={ () => setModalOpen(true) }
				>
					Delete all CFP related data
				</Button>
			</Grid>
			<ConfirmDialog
				title="Delete CFP data"
				message="Are you sure you want to delete all CFP data?"
				open={ modalOpen }
				onConfirm={ () => onConfirm() }
				onCancel={ () => setModalOpen(false) }
				confirmButtonLabel={ "Delete" }
			/>
		</Grid>
	)
}
