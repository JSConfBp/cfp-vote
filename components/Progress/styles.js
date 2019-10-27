import deepPurple from '@material-ui/core/colors/deepPurple';

export default theme => ({
	progress: {
		width: 128,
		height: 160,
		margin: '0 auto',
		marginBottom: 32,
		marginTop: 16,
		position: 'relative'
	},
	circle: {
		top: 0,
		width: 128,
		height: 128,
		color: deepPurple[500],
		zIndex: 2,
		position: 'absolute'
	},
	shadow: {
		top: 0,
		width: 128,
		height: 128,
		color: deepPurple[100],
		zIndex: 1,

	},
	name: {
		display: 'block',
		textAlign: 'center',
		paddingTop: 10
	},
	percent: {
		zIndex: 3,
		position: 'absolute',
		left: 0,
		width: 128,
		textAlign: 'center',
		top: 44,
	},
})