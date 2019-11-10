import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { useNotification } from 'notification-hook'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import FieldPicker from '../FieldPicker';

import csvParse from 'csv-parse'

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate, onError }) => {
	const css = useStyles();
	const [data, setData] = useState('')
	const [header, setHeader] = useState(null)
	const { showSuccess, showError } = useNotification()

	const save = (fields) => {
		fetch(`/api/cfp`, {
			method: 'POST',
			headers: {
				'x-cfp-stage': 'stage_1',
				'x-cfp-fields': JSON.stringify(fields),
				'Content-Type': 'text/csv',
				'Accept': 'application/json',
			},
			body: data
		})
		.then(r => r.json())
		.then(() => {
			showSuccess('CFP uploaded!')
			setData('')
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
			setData(event.target.result)
			csvParse(event.target.result, { columns: true }, (err, csvData) => {
				if (err) {
					showError('Could not parse CSV')
					onError(err)
					return
				}

				const header = Object.keys(csvData[0])
				setHeader(header)
			})
		};
	};

	// todo, pick fields for "title" "abstract" and additional information of talk

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4" className={ css.heading }>
					Upload CFP
				</Typography>
			</Grid>

			{ !header && (
			<Grid item xs={12}>
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
			</Grid>
			)}

			{ header && (
			<Grid item xs={12}>
				<FieldPicker
					fields={ header }
					onHasFields={ (fieldIndexes = []) => {

						save(header.filter((elem, i) => fieldIndexes.includes(i)))
					} }
				/>
			</Grid>
			)}
		</Grid>
	)
}
