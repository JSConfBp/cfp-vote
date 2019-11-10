import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { useNotification } from 'notification-hook'
import { makeStyles } from '@material-ui/core/styles';
import Link from '../Link'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';


import styles from './styles'
const useStyles = makeStyles(styles)

import VoteUIConfig from '../../cfp.config'

export default ({ stage, onUpdate, onError }) => {
	const css = useStyles();

	const votingStages = Object.entries(VoteUIConfig.votingStages)
		.map(([key, stage]) => ({
			key,
			label: stage.label,
		}))
	const [votingStage, setVotingStage] = useState(stage)
	const [voteLimit, setVoteLimit] = useState(60)
	const { showSuccess, showError } = useNotification()

	const updateStage = () => {
		fetch(`/api/cfp`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify(
				{
					voteLimit,
					stage: votingStage
				}
			)
		})
		.then(r => r.json())
		.then(({ count, stage }) => {
			setVotingStage(stage)
			showSuccess('Stage saved')
			onUpdate()
		})
		.catch(e => {
			showError('Could not update stage')
			onError(e)
		})
	}

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4" className={ css.heading }>
					Set Voting Stage
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Set your voting progress to the next, shortlisting stage
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="body1" component="div">
					<FormControl className={css.formControl}>
						<InputLabel htmlFor="stage-helper">Update voting stage</InputLabel>
						<NativeSelect
							value={ votingStage }
							onChange={e => setVotingStage(e.target.value)}
							input={<Input name="voting_stage" id="stage-helper" />}
						>
							{ votingStages.map(stage => (
								<option value={stage.key} key={stage.key}>{stage.label}</option>
							)) }
						</NativeSelect>
						<FormHelperText>Update this if you're ready to summarize the first vote round</FormHelperText>
					</FormControl>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="body1" component="div">
					<FormControl className={ css.formControl }>
						<InputLabel htmlFor="vote-limit">
							Vote count limit
						</InputLabel>
						<Input
							type="number"
							id="vote-limit"
							value={ voteLimit }
							onChange={ (e) => setVoteLimit(e.target.value) }
							aria-describedby="vote-limit-helper-text"
						/>
						<FormHelperText id="vote-limit-helper-text">
							Include talks in second round with votes at least as much as this value.<br />
							See the vote/talk chart in <Link to="stats"><a>Statistics</a></Link> to determine this number
						</FormHelperText>
					</FormControl>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="body1" component="div">
					<FormControl className={css.formControl}>
						<Button
							onClick={ () => updateStage() }
							color="secondary"
							variant={'contained'}
						>
							Update Stage
						</Button>
					</FormControl>
				</Typography>
			</Grid>
		</Grid>
	)
}
