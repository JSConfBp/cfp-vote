import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useNotification } from '../../components/Notification'

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate, onError }) => {
	const css = useStyles();

	const { showSuccess, showError } = useNotification()

	const onFile = (fileContent) => {
		fetch(`/api/cfp`, {
			method: 'POST',
			headers: {
				'x-cfp-stage': 'stage_1',
				'Content-Type': 'text/csv',
				'Accept': 'application/json'
			},
			body: fileContent
		  })
		  .then(r => r.json())
		  .then(() => {
			showSuccess('CFP uploaded!')
			onUpdate()
		  })
		  .catch(e => {
			showError('CFP upload failed.')
			onError(e)
		  })
	}

	const handleChange = event => {
	  	const reader = new FileReader();
	  	reader.readAsText(event.target.files[0]);
	  	reader.onload = (event) => {
			onFile(event.target.result)
		};
	};

	// todo, pick fields for "title" "abstract" and additional information of talk

	return (
		<div className={ css.container }>
			<Typography variant="h4" className={ css.heading }>
            	Upload CFP 
			</Typography>
			<Typography>
            	Upload the CFP submissions in csv export format.
			</Typography>
			<div className={css.field}>
				<input
					accept="text/csv"
					className={ css.input }
					id="raised-button-file"
					multiple
					type="file"
					onChange={ handleChange }
				/>
				<label htmlFor="raised-button-file">
					<Button variant={ 'contained' } color="secondary" component="span" className={ css.button }>
						Upload submissions as CSV export
					</Button>
				</label>
			</div>

		</div>
	)
}