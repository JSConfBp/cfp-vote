import React from 'react'

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useNotification } from '../NotificationHook'


export default ({ onUpdate, onError }) => {


	const { showError, showSuccess } = useNotification()

	const onConfirm = async () => {
		setModalOpen(false)

		try {
			// await fetch('/api/cfp', {
			// 	method: 'delete',
			// 	headers: {
			// 		"Content-Type": "application/json; charset=utf-8"
			// 	}
			// })
			showSuccess('Data was exported successfully!')
			onUpdate()
		} catch (e) {
			showError('Could not export CFP.')
			onError(e)
		}
	}

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4">
					Export CFP data back to Google Sheets
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Save the results back to the spreadsheet where it was imported from
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Button
          disabled
					variant={ 'contained' }
					color="secondary"
					onClick={ () => setModalOpen(true) }
				>
					Export back to Google Sheets
				</Button>
			</Grid>
		</Grid>
	)
}
