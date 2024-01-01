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
						<Link href="/vote" style={{
              textDecoration: 'none',
              color: theme.palette.primary.main
            }}>
							<ListItem button key={'vote'}>
								<ListItemIcon><AssessmentIcon /></ListItemIcon>
								<ListItemText>
									Vote!
								</ListItemText>
							</ListItem>
						</Link>
						<Link href="/stats" style={{
              textDecoration: 'none',
              color: theme.palette.primary.main
            }}>
							<ListItem button key={'home'}>
								<ListItemIcon><TrendingUpIcon /></ListItemIcon>
								<ListItemText>
									Statistics
								</ListItemText>
							</ListItem>
						</Link>
						{ session.admin && (
						<Link  href="/admin" style={{
              textDecoration: 'none',
              color: theme.palette.primary.main
            }}>
							<ListItem button key={'home'}>
								<ListItemIcon><BuildIcon /></ListItemIcon>
								<ListItemText>
									Admin
								</ListItemText>
							</ListItem>
						</Link>
						)}
						<Link  href="/user" style={{
              textDecoration: 'none',
              color: theme.palette.primary.main
            }}>
							<ListItem button key={'home'}>
								<ListItemIcon><HomeIcon /></ListItemIcon>
								<ListItemText>
									Home
								</ListItemText>
							</ListItem>
						</Link>
					</List>
					<Divider />
					<List>
						<ListItem button key={'home'}>
							<ListItemIcon><ExitToAppIcon /></ListItemIcon>
							<ListItemText>
								<Link onClick={() => void signOut()} href="/" style={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main
                }}>Logout</Link>
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

				<Typography
					variant="h6"
					color="inherit"
					sx={{
            flexGrow: 1,
            paddingRight: 5,
            textAlign: 'center',
            [theme.breakpoints.down('sm')]: {
              display: voting ? 'inline-block' : 'none'
            }
          }}>
					{!voting && VoteUIConfig.title} {!voting && subTitle && ` - ${subTitle}`}
          {voting && subTitle}
				</Typography>
			</Toolbar>
		</AppBar>
	</>)
}
