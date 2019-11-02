import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import classnames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import CircularProgress from '@material-ui/core/CircularProgress'

import { useNotification } from '../../components/Notification'

import Authenticated from '../../components/Auth'
import MenuBar from '../../components/MenuBar'
import VoteControls from '../../components/VoteControls'

import styles from './styles'
const useStyles = makeStyles(styles)

const getCfp = async () => {
	return fetch(
		`/api/cfp`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
	.then(response => response.json())
}

const getNextTalk = async (token) => {
	return fetch(`/api/talk`,
	{
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	})
	.then(response => response.json())
}

const Vote = () => {
	const css = useStyles()
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const { showError, showSuccess } = useNotification()
	const [talk, setTalk] = useState(null)
	const [cfp, setCfp] = useState(null)

	useEffect(() => {
		Promise.all([
			getCfp(),
			getNextTalk()
		]).then(([cfp, talk]) => {
			setCfp(cfp)
			setTalk(talk)
			setLoading(false)
		})
	}, [false])

	const onVote = async (id, value) => {
		setLoading(true)

		const voted = await fetch(`/api/vote`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({id, value})
			})
			.then(response => response.json())
			// TODO 4xx status is also a succesful fetch :/
			.catch(e => {
				showError('Could not save vote!')
				console.error(e);
			})

		if (voted.success) {
			setModalOpen(false)
			const talk = await getNextTalk()

			setTalk(talk)
			setLoading(false)

			window.scrollTo(0,0)
		}
	}

	const { completed } = talk || {}

	return (<div className={css.root}>
	{ !loading && (
		<Grid container spacing={ 24 }>
			<Grid item xs={ 12 }>

				<Paper className={ css.paper } elevation={ 0 }>

					{completed && (<Typography
						variant="body1"
						className={ css.p }
					>
						Nice job, you're completed voting in this stage.
					</Typography>) }

					{ !completed && (cfp.fields.map((field, i) => {
							if (i === 0) {
								return (<Typography
									variant="h3"
									className={ css.title }
									key={ `field-${i}` }
								>
									{ talk.fields[field] }
								</Typography>)
							} else {
								return (<Typography
									variant="body1"
									className={ css.p }
									key={ `field-${i}` }
								>
									{ talk.fields[field] }
								</Typography>)
							}
						})
					)}
				</Paper>

				{ !completed && (
				<Paper  elevation={0} className={ classnames(css.paper, css.desktop_vote) }>
					<VoteControls
						loading={ loading }
						onVote={ value => onVote(talk.id, value) }
						stage={ cfp.stage }
					/>
				</Paper>
				) }
			</Grid>
		</Grid>
	)}
	
	{ (loading) && (
		<Grid container spacing={ 24 }>
			<Grid item xs={ 12 }>
				<Paper className={ css.paper } elevation={ 0 } className={ css.loading }>
					<CircularProgress color="secondary" className={ css.spinner } />
				</Paper>
			</Grid>
		</Grid>
	)}

	<MenuBar voting={ !completed } showVoteUI={ () => setModalOpen(true) } />
	
	{ cfp && talk && (
		<Modal
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
			open={ modalOpen }
			onClose={ e => setModalOpen(false) }
		><div className={ css.modal }>
			<VoteControls
				loading={ loading }
				onVote={ value => onVote(talk.id, value) }
				stage={ cfp.stage }
			/>
			</div>
		</Modal>
	)}
</div>)
}

export default Authenticated(Vote)