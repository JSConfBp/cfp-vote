import memoize from "memoize-one";
import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames'
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const styles = theme => ({
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing.unit * 3,
	},
	message: {
		display: 'flex',
		alignItems: 'center',
	},
});

class ErrorNotification extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			open: false,
			userClose: false,
		}
	}

	static getDerivedStateFromProps (props, state) {
		if (state.userClose) {
			return {
				open: false,
				userClose: false
			}
		}

		if (props.error && !state.open) {
			return Object.assign({}, state, { open: true })
		}

		return state
	}

	shouldComponentUpdate (nextProps, nextState) {
		const { error } = this.props

		if (!nextState.open) {
			return true
		}

		if (nextProps.error !== error) {
			return true
		}

		return false
	}


	handleClose =  (event, reason) => {
		if (reason === 'clickaway') {
		  	return
		}

		this.setState({
			userClose: true,
			open: false
		})
	}


	render () {
		const { classes, error = {} } = this.props
		const { open } = this.state

		return (<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			open={ open }
			autoHideDuration={ 6000 }
			onClose={ this.handleClose }
		>
		 <SnackbarContent
      		className={classes.error}
      		aria-describedby="client-snackbar"
      		message={
        		<span id="client-snackbar" className={classes.message}>
          			<ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
					<span>
						<strong>{ error.error }</strong>
						<br />
					  	{ error.message }
					</span>
        		</span>
      		}
      		action={[
        		<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					className={classes.close}
					onClick={this.handleClose}
        		>
          			<CloseIcon className={classes.icon} />
        		</IconButton>,
      		]}
    	/>
		</Snackbar>)
	}
  }


  export default withStyles(styles)(ErrorNotification);