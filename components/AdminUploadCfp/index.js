import React, { useState } from 'react'
import { useNotification } from '../NotificationHook'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FieldPicker from '../FieldPicker';
import { parse } from 'csv-parse';

export default ({ onComplete, onError }) => {
	const [data, setData] = useState('')
	const [header, setHeader] = useState([])
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
			onComplete()
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
    parse(
      event.target.result,
      { columns: true },
      (err, csvData) => {
        if (err) {
          showError('Could not parse CSV')
          onError(err)
          return
        }
				const header = Object.keys(csvData[0])
				setHeader(header.map((f, i) => ({ field: f, id: i})))
			})
		};
	};

	// todo, pick fields for "title" "abstract" and additional information of talk

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4">
					Upload CFP
				</Typography>
			</Grid>

			{ header.length === 0 && (
			<Grid item xs={12}>
				<Typography>
					Upload the CFP submissions in csv export format.
				</Typography>
				<div>
					<input
						accept="text/csv"
						id="raised-button-file"
						multiple
						type="file"
						onChange={ handleChange }
            style={{
              position: 'absolute',
              display: 'none'
            }}
					/>
					<label htmlFor="raised-button-file">
						<Button variant={ 'contained' } color="secondary" component="span">
							Upload submissions as CSV export
						</Button>
					</label>
				</div>
			</Grid>
			)}

			{ header.length > 0 && (
			<Grid item xs={12}>
				<FieldPicker
					fields={ header }
					onHasFields={ (fields = []) => {
						save(fields)
					} }
				/>
			</Grid>
			)}
		</Grid>
	)
}
