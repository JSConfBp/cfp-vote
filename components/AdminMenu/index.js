import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Link from '../Link'
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Download from './Download'
import Delete from './Delete'
import UploadCfp from '../UploadCfp'
//import ImportCfp from '../ImportCfp'

import getConfig from 'next/config'
const { publicRuntimeConfig: { api_url } } = getConfig()

import VoteUIConfig from '../../cfp.config'


const styles = theme => ({
	adminMenu: {
		marginTop: theme.spacing.unit * 5,
	},
  	formControl: {
		width: '100%',
		marginTop: 20,
		display: 'block'
  	},
  	button: {
		marginTop: theme.spacing.unit * 5,
  	},
  	input: {
	  	display: 'none'
	},
	h5: {
		marginBottom: 32,
	},
	closedPanels: {
		marginBottom: 16,
	}
});

class AdminMenu extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			expanded: '',
			year: props.year,
			votingStage: props.stage || 'stage_1',
			voteLimit: 30
		}
	}

	onFile(year, fileContent) {
		const { token } = this.props
		const { votingStage } = this.state

		fetch(`${api_url}/v1/cfp`, {
			method: 'POST',
			headers: {
				'x-cfp-year': year,
				'x-cfp-stage': votingStage,
				'Content-Type': 'text/csv',
				'Accept': 'application/json',
				'Authorization': token
			},
			body: fileContent
		  })
		  .then(r => r.json())
		  .then(({ count, year }) => {
				this.setState({year})
				this.props.onUpdate({count, year})
		  })
		  .catch(e => {
				this.setState({
					error: this.state.activeStep,
				});
		  })
	}

	handleVoteState (val) {
		this.setState({
			votingStage: val
		})
	}

	handleVoteLimit (val) {
		this.setState({
			voteLimit: val
		})
	}

	updateStage () {
		const { token } = this.props
		const { votingStage, voteLimit } = this.state

		fetch(`${api_url}/v1/cfp`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			  	'Authorization': token
			},
			body: JSON.stringify(
				{
					voteLimit,
					stage: votingStage
				}
			)
		  })
		  .then(r => r.json())
		  .then(({ count, year, stage }) => {
				this.setState({votingStage: stage})
				this.props.onUpdate({count, year, stage})
		  })
		  .catch(e => {
				this.setState({
					error: this.state.activeStep,
				});
		  })
	}

	expandPanel(id) {
		if (this.state.expanded === id) {
			this.setState({
				expanded: ''
			})
			return
		}
		this.setState({
			expanded: id
		})
	}

	render() {
		const { classes, token } = this.props
		const { year, votingStage, expanded } = this.state
		const { voting_stages } = VoteUIConfig

		const adminPanels = classNames({
			[classes.closedPanels]: !expanded,
		});


		return (<Typography component="div" className={classes.adminMenu}>

			<Typography variant="h5" className={classes.h5}>
				Administration
			</Typography>

			<Typography variant="body1" className={adminPanels}>
				You're marked as an admin, so you can access some advanced features.<br />
				But be careful, you know <em>"with great power comes great responsibility"</em>!
			</Typography>

			{ year ? (<>
			<ExpansionPanel
				expanded={expanded === 'stage'}
				onChange={e => this.expandPanel('stage')}
			>
          		<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            		<Typography className={classes.heading}>
						Voting Stage
					</Typography>
          		</ExpansionPanelSummary>
          		<ExpansionPanelDetails>
            		<Typography variant="body1" component="div">

						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="stage-helper">Update voting stage</InputLabel>
							<NativeSelect
								value={votingStage}
								onChange={e => this.handleVoteState(e.target.value)}
								input={<Input name="voting_stage" id="stage-helper" />}
							>
								{Object.entries(voting_stages).map(([key, stage]) => (
									<option value={key} key={key}>{stage.label}</option>
								))}
							</NativeSelect>
							<FormHelperText>Update this if you're ready to summarize the first vote round</FormHelperText>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="vote-limit">Vote count limit</InputLabel>
							<Input
								type="number"
								id="vote-limit"
								value={this.state.voteLimit}
								onChange={ (e) => this.handleVoteLimit(e.target.value)}
								aria-describedby="vote-limit-helper-text"
							/>
							<FormHelperText id="vote-limit-helper-text">
								Include talks in second round with votes at least as much as this value.<br />
								See the vote/talk chart in <Link to="stats"><a>Statistics</a></Link> to determine this number
							</FormHelperText>
						</FormControl>
						<FormControl className={classes.formControl}>
							<Button onClick={e => this.updateStage()}color="secondary" variant={'contained'} >Update Stage</Button>
						</FormControl>

            		</Typography>
          		</ExpansionPanelDetails>
        	</ExpansionPanel>

			<ExpansionPanel
				expanded={expanded === 'export'}
				onChange={e => this.expandPanel('export')}
			>
          		<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            		<Typography className={classes.heading}>
						Download Data
					</Typography>
          		</ExpansionPanelSummary>
          		<ExpansionPanelDetails>
            		<Typography component="div" variant="body1">

						<FormControl className={classes.formControl}>
							<Typography component="div" variant="body1">
								<Download token={token} />
							</Typography>
						</FormControl>

            		</Typography>
          		</ExpansionPanelDetails>
        	</ExpansionPanel>

			<ExpansionPanel
				expanded={expanded === 'delete'}
				onChange={e => this.expandPanel('delete')}
			>
          		<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            		<Typography className={classes.heading}>
						Delete Data
					</Typography>
          		</ExpansionPanelSummary>
          		<ExpansionPanelDetails>
            		<Typography component="div" variant="body1">
						<Delete token={ token } />
            		</Typography>
          		</ExpansionPanelDetails>
        	</ExpansionPanel>
			</>): ''}

			{ !year ? (<>
			<ExpansionPanel
				expanded={expanded === 'upload'}
				onChange={e => this.expandPanel('upload')}
			>
          		<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            		<Typography className={classes.heading}>
						Upload CFP from csv export
					</Typography>
          		</ExpansionPanelSummary>
          		<ExpansionPanelDetails>
					<FormControl className={classes.formControl}>
						<Typography component="div" variant="body1">
							<UploadCfp onFile={(...data) => this.onFile(...data)} />
						</Typography>
					</FormControl>
          		</ExpansionPanelDetails>
        	</ExpansionPanel>
			{/*
			<ExpansionPanel
				expanded={expanded === 'import'}
				onChange={e => this.expandPanel('import')}
			>
          		<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            		<Typography className={classes.heading}>
						Import CFP from Google Spreadsheets
					</Typography>
          		</ExpansionPanelSummary>
          		<ExpansionPanelDetails>
					<FormControl className={classes.formControl}>
						<Typography component="div" variant="body1">
							<ImportCfp token={token} />
						</Typography>
					</FormControl>
				  </ExpansionPanelDetails>
        	</ExpansionPanel>*/}
			</>): ''}



		</Typography>);
	}
  }

  export default withStyles(styles)(AdminMenu);