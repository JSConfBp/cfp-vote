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

class Authenticate extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			showCodeField: false,
			code: ''
		}
	}

	onLinkClick () {
		this.setState({
			showCodeField: true
		})
	}

	hasCode (code) {
		this.setState({
			code
		})
	}

	upload () {
		const { code } = this.state
		const { token } = this.props

		fetch(`${api_url}/v1/cfp/import/code`, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
				'Accept': 'application/json',
				'Authorization': token
			},
			body: code
		})
		.then(r => r.json())
		.then((resp) => this.props.onAuthenticated(resp))
		.catch(e => {
			this.props.onError(e);
		})
	}

	render () {
		const { classes, authUrl } = this.props
		const { showCodeField } = this.state
		return (<>
		{!showCodeField ? (<>
			<Typography variant="body1" component="div">
				Click the button below, to authenticate your user with Google Drive, and provide access for the spreadsheets.
			</Typography>

			<Button
				variant={'contained'}
				color="primary"
				className={classes.button}
				href={authUrl}
				target="_blank"
				rel="noopener"
				onClick={e => this.onLinkClick()}
			>
				Authenticate
			</Button>
		</>) : (<>
			<Typography variant="body1" component="div">
				Enter the code you received after the authentication:
			</Typography>

			<TextField
          		id="standard-multiline-static"
          		label="Verification Code"
          		className={classes.textField}
				margin="normal"
				fullWidth={true}
				onChange={e => this.hasCode(e.target.value)}
        	/>

			<Button
				variant={'contained'}
				color="primary"
				className={classes.button}
				onClick={e => this.upload()}
			>
				Next
			</Button>
		</>)}
			</>)
	}
  }


  export default withStyles(styles)(Authenticate);