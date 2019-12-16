import React from 'react'
import fetch from 'isomorphic-unfetch'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

import getConfig from 'next/config'
const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	container: {
		display: 'block',
		width: '100%'
	},
	sheetsText: {
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	},
	field: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	},
	button: {
		marginTop: 2 * theme.spacing.unit,
	}
});

class ChooseSheet extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			needSheetTitle: false,
			sheetId: '',
			spreadsheetId: ''
		}
	}

	hasCode (spreadsheetId) {
		this.setState({
			spreadsheetId
		})
	}

	hasSheetId (sheetId) {
		this.setState({
			sheetId
		})
	}

	upload () {
		const { spreadsheetId, sheetId } = this.state
		const { token } = this.props

		fetch(`${api_url}/v1/cfp/import/sheet`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({
				spreadsheetId,
				sheetId
			})
		})
		.then(r => r.json())
		.then((resp) => {
			// need to pick the exact sheet within the SpreadSheet
			if (resp.needSheet) {
				this.setState({
					needSheet: true,
					sheets: resp.sheets,
					sheetId: resp.sheets[0].sheetId
				})
				return
			}

			this.props.onHasSheet(resp.fields)
		})
		.catch(e => {
			this.props.onError(e);
		})
	}

	render () {
		const { classes } = this.props
		const { needSheet, sheets, sheetId } = this.state

		return (<>
			<Typography variant="body1" component="div">
				Enter the spreadsheet ID of the document you wish to import

				https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=0
			</Typography>

			<TextField
          		id="standard-multiline-static"
          		label="Spreadsheet ID"
          		className={classes.field}
				margin="normal"
				fullWidth={true}
				onChange={e => this.hasCode(e.target.value)}
        	/>

			{needSheet ? (<>
			<Typography variant="body1" component="div" className={ classes.sheetsText}>
				This SpreadSheet has more Sheets than one. Please pick one to import.
			</Typography>
			<FormControl className={classes.field}>
				<InputLabel htmlFor="sheet-helper">Select Sheet</InputLabel>
					<NativeSelect
						value={sheets.filter(sheet => (sheet.sheetId === sheetId)).title}
						onChange={e => this.hasSheetId(e.target.value)}
						input={<Input name="sheet" id="sheet-helper" />}
					>
					{sheets.map(({ sheetId, title }) => (
						<option value={sheetId} key={sheetId}>{title}</option>
					))}
					</NativeSelect>
			</FormControl>
			</>) : ('')}

			<Button
				variant={'contained'}
				color="primary"
				className={classes.button}
				onClick={e => this.upload()}
			>
				Next
			</Button>
			</>)
	}
  }


  export default withStyles(styles)(ChooseSheet);