import React from 'react'
import Link from '../Link'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import IconButton from '@material-ui/core/IconButton'

import Fab from '@material-ui/core/Fab'
import MenuIcon from '@material-ui/icons/Menu'
import AssessmentIcon from '@material-ui/icons/Assessment'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import HomeIcon from '@material-ui/icons/Home'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

import VoteUIConfig from '../../cfp.config'

const styles = theme => ({
	grow: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
		paddingLeft: 30,
		[theme.breakpoints.down('sm')]: {
			display: 'none'
		}
	},
	appBar: {
		flexGrow: 1,
		[theme.breakpoints.down('md')]: {
			top: 'auto',
			bottom: 0,
		},
		[theme.breakpoints.up('md')]: {
			top: 0,
			bottom: 'auto',
		},
	},
	list: {
		width: 250,
	},
	toolbar: {
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	fabButton: {
		position: 'absolute',
		zIndex: 1,
		top: -30,
		left: 0,
		right: 0,
		margin: '0 auto',
		display: 'none',
		[theme.breakpoints.down('sm')]: {
			display: 'block',
		},
	},
	menuDrawer: {
		display: 'flex',
		height: `100%`,
		alignItems: `flex-start`,
		[theme.breakpoints.down('sm')]: {
			alignItems: `flex-end`,
		}
	},
	menuLink: {
		color: 'inherit',
		textDecoration: 'none'
	}
})

class MenuBar extends React.Component {
	state = {
		menuOpen: false
	}

	constructor (props) {
		super(props)
	}

	handleOpen(e) {
		this.setState({
			menuOpen: true
		})
	}

	toggleDrawer(open) {
		this.setState({
			menuOpen: open
		})
	}

	render() {
		const { classes, voting } = this.props
		const { menuOpen, menuElem } = this.state

		return (<>
			<Drawer open={menuOpen} onClose={e => this.toggleDrawer(false)}>
				<div
					className={ classes.menuDrawer }
					tabIndex={0}
					role="button"
					onClick={e => this.toggleDrawer(false)}
					onKeyDown={e => this.toggleDrawer(false)}
				>
					<div className={classes.list}>
						<List>
							<Link to="vote">
								<ListItem button key={'vote'}>
									<ListItemIcon><AssessmentIcon /></ListItemIcon>
									<ListItemText>
										<a className={classes.menuLink}>Vote!</a>
									</ListItemText>
								</ListItem>
							</Link>
							<Link to="stats">
								<ListItem button key={'home'}>
									<ListItemIcon><TrendingUpIcon /></ListItemIcon>
									<ListItemText>
										<a className={classes.menuLink}>Statistics</a>
									</ListItemText>
								</ListItem>
							</Link>
							<Link to="user">
								<ListItem button key={'home'}>
									<ListItemIcon><HomeIcon /></ListItemIcon>
									<ListItemText>
										<a className={classes.menuLink}>Home</a>
									</ListItemText>
								</ListItem>
							</Link>
						</List>
						<Divider />
						<List>
							<ListItem button key={'home'}>
								<ListItemIcon><ExitToAppIcon /></ListItemIcon>
								<ListItemText>
									Logout
								</ListItemText>
							</ListItem>
						</List>
					</div>
				</div>
			</Drawer>

			<AppBar position="fixed" color="primary" className={classes.appBar}>
		  		<Toolbar className={classes.toolbar}>
					<IconButton onClick={e => this.handleOpen(e)} color="inherit" aria-label="Open drawer">
			  			<MenuIcon />
					</IconButton>
					{ voting ? (
						<Fab
							onClick={e => this.props.showVoteUI()}
							color="secondary"
							aria-label="Vote"
							className={classes.fabButton}
						>
							<AssessmentIcon />
						</Fab>
					):''}

					<Typography
						variant="h6"
						color="inherit"
						className={classes.title}>
						{VoteUIConfig.title}
					</Typography>
		  		</Toolbar>
			</AppBar>
		</>)
	}
  }

  export default withStyles(styles)(MenuBar)