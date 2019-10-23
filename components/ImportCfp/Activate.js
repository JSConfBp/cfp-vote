import React from 'react'
import fetch from 'isomorphic-unfetch'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import getConfig from 'next/config'
const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	container: {
		display: 'block',
		width: '100%'
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	},
});



class Activate extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			activeStep: 0,
			data: ''
		}
	}

	hasJson (data) {
		this.setState({
			data
		})
	}

	upload () {
		const { data } = this.state
		const { token } = this.props

		fetch(`${api_url}/v1/cfp/import/activate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': token
			},
			body: data
		  })
		  .then(r => r.json())
		  .then((resp) => {
			  if (resp.statusCode >= 400) {
				  throw resp
			  }

			  this.props.onActivated(resp)
			})
		  .catch(e => {
				this.props.onError(e);
		  })
	}

	render () {
		const { error } = this.state
		const { classes } = this.props

		return (<>
			<Typography variant="body1" component="div">
				<ul>
					<li>
						Visit the <a href="https://developers.google.com/sheets/api/quickstart/nodejs" target="_blank" rel="noopener">Sheets API Guide</a>.
					</li>
					<li>
						Click the <strong>"Enable the Google Sheets API"</strong> button.
					</li>
					<li>
						In the overlay that opens, click the <strong>"Download client configuration"</strong> and download a JSON file.
					</li>
					<li>
						Copy the contents of that JSON here.
					</li>
				</ul>
			</Typography>

			<TextField
          		id="standard-multiline-static"
          		label="credentials.json"
          		multiline
          		rows="6"
          		className={classes.textField}
				margin="normal"
				fullWidth={true}
				onChange={e => this.hasJson(e.target.value)}
        	/>

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


  export default withStyles(styles)(Activate);