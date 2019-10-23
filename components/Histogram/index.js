
import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import VoteUIConfig from '../../cfp.config'

const styles = theme => ({
	table: {}
});

class Histogram extends React.Component {
	render() {
		const { classes, data, stage } = this.props
		const cols = data.map(bucket => bucket.label)
		const sum = data.reduce((val,bucket) => {
			val += bucket.count
			return val
		}, 0)

		return <Table className={classes.table}>
			<TableHead>
				<TableRow>
					<TableCell></TableCell>
					{cols.map(col => (<TableCell align="right" key={ col }>{ col }</TableCell>))}
				</TableRow>
			</TableHead>
			<TableBody>

				<TableRow>
					<TableCell component="th" scope="row">
						{ VoteUIConfig.voting_stages[stage].label }
					</TableCell>
					{ data.map((bucket, i) => {
						let value = 0
						if (sum > 0) {
							value = Math.round((bucket.count / sum) * 100)
						}
						return (<TableCell align="right" key={`bucket-stage-${i}`}>{ value }%</TableCell>)
					}) }
				</TableRow>

			</TableBody>
      </Table>
	}
}

export default withStyles(styles)(Histogram)
