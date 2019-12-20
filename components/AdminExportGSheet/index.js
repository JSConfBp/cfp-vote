import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { useNotification } from 'notification-hook'

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate, onError }) => {
	const css = useStyles();

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
				<Typography variant="h4" className={ css.heading }>
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
					className={ css.deleteButton }
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
