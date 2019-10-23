import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import getConfig from 'next/config'
const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	container: {
		display: 'block',
		width: '100%'
	},
	list: {
		width: 400,
		backgroundColor: theme.palette.background.paper,
		marginBottom: 4 * theme.spacing.unit,
	}
});

class FieldPicker extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			checked: []
		}
	}

	handleToggle(index) {
		const { checked } = this.state
		let newData = checked.slice(0)

		if (checked.includes(index)) {
			newData = newData.filter(item => (item !== index))
		} else {
			newData.push(index)
		}

		this.setState({
			checked: newData
		})
	}

	upload () {
		this.props.onHasFields(this.state.checked)
	}

	render () {
		const { fields, classes } = this.props

		return (<>
			<Typography variant="body1" component="div">
				Pick the fields you wish to show during the voting process.
			</Typography>

			<List className={classes.list}>
			{fields.map((field, i) => (
				<ListItem
					key={`field_${i}`}
					role={undefined}
					dense
					button
					onClick={e => this.handleToggle(i)}
				>
					<Checkbox
						checked={this.state.checked.indexOf(i) !== -1}
						tabIndex={-1}
						disableRipple
					/>
            		<ListItemText primary={field} />
          		</ListItem>
        	))}
      		</List>

			<Button
				variant={'contained'}
				color="primary"
				className={classes.button}
				onClick={e => this.upload()}
			>
				Next
			</Button>


		</>)
	}
  }


  export default withStyles(styles)(FieldPicker);