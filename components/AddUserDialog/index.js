import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import HelpOutline from '@mui/icons-material/HelpOutline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import { useTheme } from '@emotion/react';

const findGithubUser = async (username) => {
    return fetch(`https://api.github.com/users/${username}`)
        .then(res => res.json())
}


const AddUserDialog = ({
    open = true,
    onClose = () => {},
}) => {
    const theme = useTheme()
    const inputTimer = useRef(0)
    const search = useRef('')

    const [user, setUser] = useState(null)

    const onSearch = (text) => {
        clearTimeout(inputTimer.current)
        inputTimer.current = setTimeout(async () => {
            if (search.current) {
                try {
                    const data = await findGithubUser(search.current)
                    setUser(data)
                } catch (e) {
                    console.error(e);
                }
            } else {
                setUser(null)
            }
        }, 300)

        if (!text) {
            setUser(null)
        } else {
            setUser({ loading: true })
        }

        search.current = text
    }

    return (
        <Dialog open={open} onClose={ () => onClose() } aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add New User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add a new user by searching for their GitHub username
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="user"
              label="Search for GitHub username"
              type="text"
              fullWidth
              onChange={ e => onSearch(e.target.value) }
            />
            <Box sx={{
                height: theme.spacing(12)
            }}>
              { user && (
                <List>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            { user.loading && (
                                <CircularProgress color="secondary" />
                            )}
                            { user.avatar_url && (
                                <Avatar alt={ user.name } src={ user.avatar_url } />
                            )}
                            { user.message && (
                                <HelpOutline />
                            )}
                        </ListItemAvatar>
                        <ListItemText
                            primary={ user.login }
                            secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{
                                      display: 'inline',
                                      fontStyle: 'italic'
                                    }}
                                    color="textPrimary"
                                >
                                { user.name || user.message }
                                </Typography>
                            </>
                            }
                        />
                    </ListItem>
                </List>
                )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => onClose() } color="primary">
              Cancel
            </Button>
            <Button onClick={ () => onClose(user) } variant={ 'contained' } color="secondary" disabled={ !(user && !!user.login) }>
              Add
            </Button>
          </DialogActions>
        </Dialog>
    )
  }
  export default AddUserDialog
