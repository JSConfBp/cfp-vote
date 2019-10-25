import React from 'react'
import getConfig from 'next/config'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const { publicRuntimeConfig: { gh_client_id, gh_redirect_uri, nonce_state, gh_scope} } = getConfig()

const styles = theme => ({
	ghButton: {
		color: theme.palette.getContrastText('#24292e'),
		backgroundColor: '#24292e',
		'&:hover': {
		  backgroundColor: '#24292e',
		},
	}
  });

class GithubLogin extends React.Component {
	render() {
		const {classes} = this.props
		
		return <Button href={'/login'} variant={'contained'} className={classes.ghButton}>
			{this.props.children}
		</Button>
	}
}
export default withStyles(styles)(GithubLogin)
