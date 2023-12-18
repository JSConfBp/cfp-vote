
import React from 'react'
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';


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

      		aria-describedby="client-snackbar"
      		message={
        		<span id="client-snackbar" >
          			<ErrorIcon  />
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
					onClick={this.handleClose}
        		>
          			<CloseIcon />
        		</IconButton>,
      		]}
    	/>
		</Snackbar>)
	}
  }


  export default ErrorNotification;
