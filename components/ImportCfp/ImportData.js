import React from 'react'
import fetch from 'isomorphic-unfetch'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import getConfig from 'next/config'
const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	container: {
		display: 'block',
		width: '100%'
	},
});



class ImportData extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			loading: false
		}
	}

	importData () {
		const { checked } = this.state
		const { token, selectedFields } = this.props

		this.setState({
			loading: true
		})

		fetch(`${api_url}/v1/cfp/import/fields`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify(selectedFields)
		})
		.then(r => r.json())
		.then((resp) => {
			this.setState({
				loading: false
			})
		})
		.catch(e => {
			this.props.onError(e);
		})
	}

	render () {
		const { classes } = this.props
		const { loading, error } = this.state

		return <>
			{!loading ? <>
				<Typography variant="body1" component="div">
					Click the button below, to start the import
				</Typography>

				<Button
					variant="contained"
					color="primary"
					className={ classes.button }
					target="_blank"
					rel="noopener"
					onClick={ e => this.importData() }
				>
					Start importing
				</Button>
			</> : ''}

			{loading ? <>
				<CircularProgress className={classes.progress} />
			</> : ''}

		</>
	}
  }


  export default withStyles(styles)(ImportData);
