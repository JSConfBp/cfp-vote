import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import debounce from 'debounce'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useNotification } from '../../components/Notification'

import AddUserDialog from '../AddUserDialog'
import UserList from '../UserList'

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate, onError }) => {
	const css = useStyles();

	const [modalOpen, setModalOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const [users, setUsers] = useState([])
	const [freeLoginMode, setFreeLoginMode] = useState(false)
	const { showError, showSuccess } = useNotification()

	const getUsers = () => fetch('/api/users')
		.then(res => {
			if (res.status >= 400) throw (`Api error: ${result.status}`)

			return res
		})
		.then(res => res.json())
		.then(data => {
			setUsers(data || [])
			setLoading(false)
		})
	
	const getUserMode = () => fetch('/api/settings')
		.then(res => {
			if (res.status >= 400) throw (`Api error: ${result.status}`)

			return res
		})
		.then(res => res.json())
		.then(data => {
			setFreeLoginMode(data.freeLogin || false)
			setLoading(false)
		})
		
	const onUserModalClose = async (data) => {
		
		console.log(data);
		
		if (data) {
			try {
				const result = await fetch('/api/user', {
					method: 'post',
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
					body: JSON.stringify({ login: data.login })
				})

				if (result.status >= 400) throw (`Api error: ${result.status}`)

				await getUsers()
				showSuccess('User added!')
				onUpdate()
			} catch (e) {
				showError('Could not add user.')
				onError(e)
			}
		}
		setModalOpen(false)
	}
		
	const removeUser = async (user) => {
		try {
			const result = await fetch('/api/user', {
				method: 'delete',
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				body: JSON.stringify({ user })
			})
			
			if (result.status >= 400) throw (`Api error: ${result.status}`)

			await getUsers()
			showSuccess('User removed')
			onUpdate()
		} catch (e) {
			showError('Could not remove user')
			onError(e)
		}
	}

	const saveUserMode = async () => {
		try {
			const result = await fetch('/api/settings', {
				method: 'put',
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				body: JSON.stringify({ freeLogin: !freeLoginMode })
			})

			if (result.status >= 400) throw (`Api error: ${result.status}`)
			
			showSuccess('Login mode set')
			onUpdate()
		} catch (e) {
			showError('Could not set login mode')
			onError(e)
		}
	}

	const debouncedSave = debounce(saveUserMode, 500)
	const onFreeLoginChange = () => {
		setFreeLoginMode(!freeLoginMode)
		debouncedSave.clear()
		debouncedSave()
	}

	useEffect(() => {
		setLoading(true)
		getUserMode()
		getUsers()
	}, [false])

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4" className={ css.heading }>
					Manage users
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Manage your team, who has access to the CFP voting. Add users by their GitHub usernames.
				</Typography>
			</Grid>
			
			<Grid item xs={12}>
				<Button 
					variant={ 'contained' } 
					color="secondary" 
					onClick={ () => setModalOpen(true) }
					disabled={ loading || freeLoginMode }
				>
					Add new user
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h6">
					Current users
				</Typography>
			</Grid>
			<Grid item xs={12}>		
				<UserList 
					users={ users }
					loading={ loading } 
					removeUser={ user => removeUser(user) }
				/>
			</Grid>
			<Grid item xs={12}>
				<FormControlLabel
					control={
						<Checkbox checked={ freeLoginMode } onChange={ () => onFreeLoginChange() } value="true" />
					}
					label={ 'Enable "Free login" mode: everyone with a valid GitHub user can log in' }
				/>
			</Grid>
			<AddUserDialog 
				open={ modalOpen } 
				loading={ loading } 
				onClose={ (data) => onUserModalClose(data) }
			/>
		</Grid>
	)
}