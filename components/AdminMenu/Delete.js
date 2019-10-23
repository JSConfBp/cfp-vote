import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import getConfig from 'next/config'
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';


import VoteUIConfig from '../../cfp.config'

const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	formControl: {
		marginTop: 20,
		display: 'block'
  	},
	modal: {
		top: '50%',
		minHeight: '10vh',
		minWidth: '20vw',
		position: 'fixed',
		left: '50%',
		transform: 'translate(-50%, -50%)',
    	backgroundColor: theme.palette.background.paper,
    	boxShadow: theme.shadows[5],
    	outline: 'none',
		padding: 20,
	},
	modalButton: {
		marginRight: 10
	}
});

class Delete extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			deleteConfirmationOpen: false,
		}
	}

	removeAllClick () {
		this.setState({
			deleteConfirmationOpen: true
		})
	}

	confirmDeleteSubmit () {
		this.confirmDeleteClose()

		const { token } = this.props

		fetch(`${api_url}/v1/cfp`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			  	'Authorization': token
			}
		  })
		  .then(r => r.json())
		  .then(({ stage }) => {
				this.setState({votingStage: VoteUIConfig.voting_stages['stage_1'].name})
				this.props.onUpdate({ count, year })
		  })
		  .catch(e => {
				this.setState({
					error: this.state.activeStep,
				});
		  })
	}

	confirmDeleteClose () {
		this.setState({
			deleteConfirmationOpen: false
		})
	}


	render() {
		const { classes, token } = this.props
		const { deleteConfirmationOpen } = this.state

		return (<>
			<Button
				onClick={e => this.removeAllClick()}
				color="secondary"
				variant={'outlined'}
			>
				Remove all CFP data
			</Button>

			<Modal
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
				open={deleteConfirmationOpen}
				onClose={e => this.confirmDeleteClose()}
			>
				<div className={classes.modal}>
					<Typography variant="body1">
						This will reset the app, removing every submission and every vote!
					</Typography>
					<Typography variant="body1">
						Are you sure?
					</Typography>
					<FormControl className={classes.formControl}>
						<Button
							color="secondary"
							className={classes.modalButton}
							variant={'contained'}
							onClick={e => this.confirmDeleteSubmit()}
						>
							Yes, remove them
						</Button>
						<Button
							color="primary"
							className={classes.modalButton}
							variant={'text'}
							onClick={e => this.confirmDeleteClose()}
						>
							Cancel
						</Button>
					</FormControl>
				</div>
			</Modal>
  		</>);
	}
  }

  export default withStyles(styles)(Delete);