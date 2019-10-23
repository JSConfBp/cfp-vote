import React from 'react'
import fetch from 'isomorphic-unfetch'
import classNames from 'classnames'
import getConfig from 'next/config'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import { withStyles } from '@material-ui/core/styles'


import ErrorNotification from '../../components/ErrorNotification'

import Authenticated from '../../components/Auth'
import MenuBar from '../../components/MenuBar'
import VoteControls from '../../components/VoteControls'

import VoteUIConfig from '../../cfp.config'

const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	paper: theme.mixins.gutters({
		background: 'none',
		width: '80vw',
		paddingTop: 32,
		paddingBottom: 32,
		margin: '0 auto',
		boxShadow: 'inherit',

		[theme.breakpoints.down('md')]: {
			marginBottom: 100,
			marginTop: 32,
			width: '100vw',
			marginLeft: 0,
			marginRight: 0,
			boxShadow: 'none',
		},
		[theme.breakpoints.up('md')]: {
			marginBottom: 32,
			marginTop: 100,
		},
	}),
	modal: {
		bottom: 40,
		minHeight: '20vh',
		width: '90%',
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
    	backgroundColor: theme.palette.background.paper,
    	boxShadow: theme.shadows[5],

    	outline: 'none',
		display: 'flex',
		flexWrap: `wrap`,
		justifyContent: `space-evenly`,
		padding: 20,
	},
	title: {
		lineHeight: 1.2,
		marginBottom: theme.spacing.unit * 4,
	},
	p: {
		lineHeight: 1.5,
		marginBottom: theme.spacing.unit * 4,
	},
	desktop_vote: {
		[theme.breakpoints.down('sm')]: {
			display: 'none'
		},
		display: 'flex',
		flexWrap: `wrap`,
		justifyContent: `space-between`
	},
});

const getNextTalk = async (token) => {
	return fetch(`${api_url}/v1/talk`,
	{
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': token
		}
	})
	.then(response => response.json())
	.catch(e => console.error(e))
}

class Vote extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			loading: false,
			modalOpen: false,
			talk: props.talk
		}
	}

	async onVote (id, value) {
		const { token } = this.props.auth
		this.setState({
			loading: true
		})

		const voted = await fetch(`${api_url}/v1/vote`,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
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

	showVoteUI () {
		this.setState({
			modalOpen: true
		})
	}

	modalClose () {
		this.setState({
			modalOpen: false
		})
	}

	render() {
		const { talk, modalOpen, loading, error } = this.state
		const { classes, stage } = this.props

		const { completed } = talk
		const { cfp_fields } = VoteUIConfig

		return (<div className={classes.root}>
			<Grid container spacing={24}>
				<Grid item xs={12}>
					<Paper className={classes.paper} elevation={0}>

					{completed ? (<Typography
						variant="body1"
						className={classes.p}
					>
						Nice job, you're completed voting in this stage.
					</Typography>) : ''}

					{ !completed ? (cfp_fields.map((field, i) => {
						if (i === 0) {
							return (<Typography
								variant="h3"
								className={classes.title}
								key={`field-${i}`}
							>
								{talk.fields[field]}
							</Typography>)
						} else {
							return (<Typography
								variant="body1"
								className={classes.p}
								key={`field-${i}`}
							>
								{talk.fields[field]}
							</Typography>)
						}
					})
					) : ''}

					</Paper>

					{ !completed ? (
					<Paper  elevation={0} className={classNames(classes.paper, classes.desktop_vote)}>
						<VoteControls
							loading={ loading }
							onVote={ value => this.onVote(talk.id, value) }
							stage={ stage }
						/>
					</Paper>
					) : ''}

				</Grid>
			</Grid>

			<MenuBar voting={!completed} showVoteUI={() => this.showVoteUI()} />

			<Modal
          		aria-labelledby="simple-modal-title"
          		aria-describedby="simple-modal-description"
          		open={modalOpen}
          		onClose={e => this.modalClose()}
        	><div className={classes.modal}>
				<VoteControls
					loading={ loading }
					onVote={ value => this.onVote(talk.id, value) }
					stage={ stage }
				/>
				</div>
			</Modal>
			<ErrorNotification error={ error } />
		  </div>)
	}

	static async getInitialProps({ req, res, store, auth }) {

		if (!auth || !auth.token) {
			if (res) {
				res.writeHead(302, {
					Location: '/'
				})
				res.end()
			} else {
				Router.push('/')
			}
			return
		}

		const cfpResponse = await fetch(`${api_url}/v1/cfp`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': auth.token
			}
		})
		.then(response => response.json())
		.catch(e => console.error(e))

		const { stage } = cfpResponse
		const talk = await getNextTalk(auth.token)

		return { auth, talk, stage }
	}
}


export default Authenticated(withStyles(styles)(Vote))