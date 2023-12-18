import React, { useState } from 'react'

import { useNotification } from '../NotificationHook'

import Link from 'next/link'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';



import cfpConfig from '../../cfp.config'

export default ({ stage, onUpdate, onError }) => {


	const stages = Object.entries(cfpConfig.votingStages)
		.map(([key, stage]) => ({
			key,
			label: stage.label,
		}))
	const [votingStage, setVotingStage] = useState(stage)
	const [topCount, setTopCount] = useState(60)
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
					topCount,
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
				<Typography variant="h4">
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
					<FormControl>
						<InputLabel htmlFor="stage-helper">Update voting stage</InputLabel>
						<NativeSelect
							value={ votingStage }
							onChange={e => setVotingStage(e.target.value)}
							input={<Input name="voting_stage" id="stage-helper" />}
						>
							{ stages.map(stage => (
								<option value={stage.key} key={stage.key}>{stage.label}</option>
							)) }
						</NativeSelect>
						<FormHelperText>Update this if you're ready to summarize the first vote round</FormHelperText>
					</FormControl>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="body1" component="div">
					<FormControl>
						<InputLabel htmlFor="vote-limit">
							Include top number of talks
						</InputLabel>
						<Input
							type="number"
							id="vote-limit"
							value={ topCount }
							onChange={ (e) => setTopCount(e.target.value) }
							aria-describedby="vote-limit-helper-text"
						/>
						<FormHelperText id="vote-limit-helper-text">
							Include the top number of talks in the second round.<br />
							See the vote/talk chart in <Link href="/stats">Statistics</Link> to determine this number
						</FormHelperText>
					</FormControl>
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="body1" component="div">
					<FormControl>
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
