import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { useNotification } from '../Notification'

import ConfirmDialog from '../ConfirmDialog';

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate, onError }) => {
	const css = useStyles();

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
				<Typography variant="h4" className={ css.heading }>
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
					className={ css.deleteButton }
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