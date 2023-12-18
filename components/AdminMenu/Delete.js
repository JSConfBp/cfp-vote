

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import getConfig from 'next/config'
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';


import VoteUIConfig from '../../cfp.config'

const { publicRuntimeConfig: { api_url } } = getConfig()

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
				this.props.onUpdate({ count })
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
				<div>
					<Typography variant="body1">
						This will reset the app, removing every submission and every vote!
					</Typography>
					<Typography variant="body1">
						Are you sure?
					</Typography>
					<FormControl>
						<Button
							color="secondary"

							variant={'contained'}
							onClick={e => this.confirmDeleteSubmit()}
						>
							Yes, remove them
						</Button>
						<Button
							color="primary"

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

  export default Delete;
