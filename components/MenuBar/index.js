import React, { useState } from 'react'
import Link from '../Link'
import { makeStyles } from '@material-ui/core/styles';
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

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ voting, subTitle = '' }) => {
	const css = useStyles()
	const [menuOpen, setMenuOpen] = useState(false)

	return (<>
		<Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
			<div
				className={ css.menuDrawer }
				tabIndex={0}
				role="button"
				onClick={() => setMenuOpen(false)}
				onKeyDown={() => setMenuOpen(false)}
			>
				<div className={css.list}>
					<List>
						<Link to="vote">
							<ListItem button key={'vote'}>
								<ListItemIcon><AssessmentIcon /></ListItemIcon>
								<ListItemText>
									<a className={css.menuLink}>Vote!</a>
								</ListItemText>
							</ListItem>
						</Link>
						<Link to="stats">
							<ListItem button key={'home'}>
								<ListItemIcon><TrendingUpIcon /></ListItemIcon>
								<ListItemText>
									<a className={css.menuLink}>Statistics</a>
								</ListItemText>
							</ListItem>
						</Link>
						<Link to="user">
							<ListItem button key={'home'}>
								<ListItemIcon><HomeIcon /></ListItemIcon>
								<ListItemText>
									<a className={css.menuLink}>Home</a>
								</ListItemText>
							</ListItem>
						</Link>
					</List>
					<Divider />
					<List>
						<ListItem button key={'home'}>
							<ListItemIcon><ExitToAppIcon /></ListItemIcon>
							<ListItemText>
								<a className={css.menuLink} href="/logout">Logout</a>
							</ListItemText>
						</ListItem>
					</List>
				</div>
			</div>
		</Drawer>

		<AppBar position="fixed" color="primary" className={css.appBar}>
			<Toolbar className={css.toolbar}>
				<IconButton onClick={() => setMenuOpen(true)} color="inherit" aria-label="Open drawer">
					<MenuIcon />
				</IconButton>
				{ voting ? (
					<Fab
						onClick={e => this.props.showVoteUI()}
						color="secondary"
						aria-label="Vote"
						className={css.fabButton}
					>
						<AssessmentIcon />
					</Fab>
				):''}

				<Typography
					variant="h6"
					color="inherit"
					className={css.title}>
					{VoteUIConfig.title} {subTitle && ` - ${subTitle}`}
				</Typography>
			</Toolbar>
		</AppBar>
	</>)	
}