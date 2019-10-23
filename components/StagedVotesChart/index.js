import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
	BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import VoteUIConfig from '../../cfp.config'

const styles = theme => ({
	chart: {
		width: '100%',
		height: 400,
		display: 'flex',
		justifyContent: 'space-around',
		flexWrap: `wrap`,
		paddingTop: 8 * theme.spacing.unit
	}
});

class StagedVotesChart extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			width: 600,
			height: 400
		}

		this.wrapper = React.createRef();

		this.onResize = (function () {
			this.setState({
				width: this.wrapper.current.clientWidth,
				height: this.wrapper.current.clientHeight,
			})
		}).bind(this)
	}

	componentDidMount() {
		this.setState({
			width: this.wrapper.current.clientWidth,
			height: this.wrapper.current.clientHeight,
		})

		window.addEventListener('resize', this.onResize)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize)
	}

	render () {
		const { data, stage, classes } = this.props
		const { width, height } = this.state

		const displayedData = data.map(( { votes }, i ) => {
			const item = Object.assign({}, {
				votes,
				index: `${i + 1}`,
				name: `Vote No.#${i + 1}`
			})
			return item
		})

		return (
			<div className={ classes.chart } ref={ this.wrapper }  >
				<BarChart
					width={ width }
					height={ height }
					barCategoryGap={ '5%' }
					data={ displayedData }
				>
					<CartesianGrid strokeDasharray="5 5" />
					<XAxis dataKey="index" />
					<YAxis />
					<Tooltip />
					<Legend content={() => VoteUIConfig.voting_stages[stage].label } />
					<Bar dataKey="votes" fill="#8884d8" />
				</BarChart>
			</div>
		);
	}
}

export default withStyles(styles)(StagedVotesChart)