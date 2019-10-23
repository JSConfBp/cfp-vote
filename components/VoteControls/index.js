import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import getConfig from 'next/config'

import VoteUIConfig from '../../cfp.config'

const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	vote_control: {
		flexBasis: '24%',
		marginBottom: 0,
		background: 'white',
		padding: '15px 0',
		fontSize: theme.spacing.unit * 2.2,
		[theme.breakpoints.down('sm')]: {
			fontSize: theme.spacing.unit * 3,
			flexBasis: `49%`,
			padding: '15px 0',
			marginBottom: 3
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: theme.spacing.unit * 2,

		},
	}
});

class VoteControls extends React.Component {
	render() {
		const { classes, stage, loading = false } = this.props
		const votingUi = VoteUIConfig.voting_ui[stage]

	  return (
		<>
			{votingUi.map((vote, i) => (
				<Button
					disabled={ loading }
					className={classes.vote_control}
					key={`vote_${vote.value}`}
					onClick={e => this.props.onVote(vote.value)}
					variant={'outlined'}
					color="primary">
						{ vote.label }
				</Button>
			))}

		</>
		);
	}
  }

  export default withStyles(styles)(VoteControls);