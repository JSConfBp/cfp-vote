import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react';

import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import MenuIcon from '@mui/icons-material/Menu'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import HomeIcon from '@mui/icons-material/Home'
import BuildIcon from '@mui/icons-material/Build'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

import VoteUIConfig from '../../cfp.config'
import { useTheme } from '@emotion/react';
import { useSession } from 'next-auth/react';


export default ({ voting, subTitle = '', showVoteUI = () => {} }) => {
  const { data: session } = useSession()

  const theme = useTheme()
	const [menuOpen, setMenuOpen] = useState(false)

	return (<>
		<Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
			<Box
				sx={{
          display: 'flex',

          height: `100%`,
          width: 250,
          alignItems: `flex-start`,
          [theme.breakpoints.down('sm')]: {
            alignItems: `flex-end`,
          }
        }}
				tabIndex={0}
				role="button"
				onClick={() => setMenuOpen(false)}
				onKeyDown={() => setMenuOpen(false)}
			>
		<Box sx={{
		width: 250,
	}}>
					<List>
						<Link href="/vote">
							<ListItem button key={'vote'}>
								<ListItemIcon><AssessmentIcon /></ListItemIcon>
								<ListItemText>
									<a sx={{
		color: 'inherit',
		textDecoration: 'none'
	}}>Vote!</a>
								</ListItemText>
							</ListItem>
						</Link>
						<Link href="/stats">
							<ListItem button key={'home'}>
								<ListItemIcon><TrendingUpIcon /></ListItemIcon>
								<ListItemText>
									<a sx={{
		color: 'inherit',
		textDecoration: 'none'
	}}>Statistics</a>
								</ListItemText>
							</ListItem>
						</Link>
						{ session.admin && (
						<Link  href="/admin">
							<ListItem button key={'home'}>
								<ListItemIcon><BuildIcon /></ListItemIcon>
								<ListItemText>
									<a sx={{
		color: 'inherit',
		textDecoration: 'none'
	}}>Admin</a>
								</ListItemText>
							</ListItem>
						</Link>
						)}
						<Link  href="/user">
							<ListItem button key={'home'}>
								<ListItemIcon><HomeIcon /></ListItemIcon>
								<ListItemText>
									<a sx={{
		color: 'inherit',
		textDecoration: 'none'
	}}>Home</a>
								</ListItemText>
							</ListItem>
						</Link>
					</List>
					<Divider />
					<List>
						<ListItem button key={'home'}>
							<ListItemIcon><ExitToAppIcon /></ListItemIcon>
							<ListItemText>
								<Link onClick={() => void signOut()} href="/">Logout</Link>
							</ListItemText>
						</ListItem>
					</List>
				</Box>
			</Box>
		</Drawer>

		<AppBar position="fixed" color="primary" sx={{
		flexGrow: 1,
		[theme.breakpoints.down('md')]: {
			top: 'auto',
			bottom: 0,
		},
		[theme.breakpoints.up('md')]: {
			top: 0,
			bottom: 'auto',
		},
	}}>
			<Toolbar sx={{
		alignItems: 'center',
		justifyContent: 'space-between',
	}}>
				<IconButton onClick={() => setMenuOpen(true)} color="inherit" aria-label="Open drawer">
					<MenuIcon />
				</IconButton>
				{ voting ? (
					<Fab
						onClick={e => showVoteUI()}
						color="secondary"
						aria-label="Vote"
						sx={{
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
            }}
					>
						<AssessmentIcon />
					</Fab>
				):''}

				<Typography
					variant="h6"
					color="inherit"
					sx={{
            flexGrow: 1,
            paddingLeft: 30,
            [theme.breakpoints.down('sm')]: {
              display: 'none'
            }
          }}>
					{VoteUIConfig.title} {subTitle && ` - ${subTitle}`}
				</Typography>
			</Toolbar>
		</AppBar>
	</>)
}
