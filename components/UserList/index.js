import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@emotion/react';


export default ({ loading, users, removeUser }) => {
  const theme = useTheme()

  return (
    <List sx={ {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    }}>
      { users.map((user, i) => (
        <React.Fragment key={user.login}>
         <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={ user.avatar_url } />
          </ListItemAvatar>
          <ListItemText
            primary={ user.login }
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  sx={ {
                    display: 'inline',
                  }}
                  color="textPrimary"
                >
                  { user.name }
                </Typography>
                { user.admin && " — admin" }
              </React.Fragment>
            }
          />
          { !user.admin && <ListItemSecondaryAction onClick={ () => removeUser(user.login) }>
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>}
        </ListItem>
        { i !== users.length - 1 && (<Divider variant="inset" component="li" />)}
        </React.Fragment>
      ))}
    </List>
  );
}
