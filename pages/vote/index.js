import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core/styles'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'

import Notification from '../../components/Notification'

import Authenticated from '../../components/Auth'
import MenuBar from '../../components/MenuBar'
import VoteControls from '../../components/VoteControls'


import styles from './styles'
const useStyles = makeStyles(styles)


import VoteUIConfig from '../../cfp.config'

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
	const [loading, setLoading] = useState(false)
	const [modalOpen, setModalOpen] = useState(false)
	const [error, setError] = useState({
		type: '',
		message: '',
		open: false
	})
	const [talk, setTalk] = useState(null)
	const [stage, setStage] = useState('')


	useEffect(() => {

		Promise.all([
			getCfp(),
			getNextTalk()
		]).then(([cfp, talk]) => {
			setStage(cfp.stage)
			setTalk(talk)
		})

	}, [false])


	const onVote = async (id, value) => {
		const { token } = this.props.auth
		this.setState({
			loading: true
		})

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
				this.setState({
					error: e
				})
			})

		if (voted.success) {
			this.modalClose()
			const talk = await getNextTalk(token)
			this.setState({
				talk,
				loading: false
			})
			window.scrollTo(0,0)
		}
	}

/* 
	showVoteUI () {
		this.setState({
			modalOpen: true
		})
	}

	modalClose () {
		this.setState({
			modalOpen: false
		})
	} */

	const { completed } = talk || {}

	const { cfp_fields } = VoteUIConfig

	return (<div className={css.root}>
	{ talk && (
		<Grid container spacing={24}>
			<Grid item xs={12}>

				<Paper className={css.paper} elevation={0}>

				{completed && (<Typography
					variant="body1"
					className={css.p}
				>
					Nice job, you're completed voting in this stage.
				</Typography>) }

				{ !completed && (cfp_fields.map((field, i) => {
					if (i === 0) {
						return (<Typography
							variant="h3"
							className={css.title}
							key={`field-${i}`}
						>
							{talk.fields[field]}
						</Typography>)
					} else {
						return (<Typography
							variant="body1"
							className={css.p}
							key={`field-${i}`}
						>
							{talk.fields[field]}
						</Typography>)
					}
				})
				) }
				</Paper>

				{ !completed && (
				<Paper  elevation={0} className={classNames(css.paper, css.desktop_vote)}>
					<VoteControls
						loading={ loading }
						onVote={ value => this.onVote(talk.id, value) }
						stage={ stage }
					/>
				</Paper>
				) }
			</Grid>
		</Grid>
	)}
	
	{ !talk && (
		<Grid container spacing={24}>
			<Grid item xs={12}>
				<Paper className={css.paper} elevation={0}>
					Loading...
				</Paper>
			</Grid>
		</Grid>
	)}

		<MenuBar voting={!completed} showVoteUI={() => this.showVoteUI()} />

		<Modal
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
			open={modalOpen}
			onClose={e => this.modalClose()}
		><div className={css.modal}>
			<VoteControls
				loading={ loading }
				onVote={ value => this.onVote(talk.id, value) }
				stage={ stage }
			/>
			</div>
		</Modal>
		<Notification error={ error } />
		</div>)
}

export default Authenticated(Vote)