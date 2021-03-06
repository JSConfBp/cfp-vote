export default theme => ({
	paper: {
		background: 'none',
	},
	centered: theme.mixins.gutters({
		background: 'none',
		margin: '0 auto',
		width: '80vw',
	}),
	heading: {
		marginBottom: theme.spacing(2),
	},
	text: {
		marginBottom: theme.spacing(2),
	},
	paper_first: {
		paddingTop: 32,
		marginTop: 20,
		marginBottom: 20,
		[theme.breakpoints.up('sm')]: {
			marginTop: 70,
		},
	},
	paper_last: {
		marginTop: 20,
		marginBottom: 20,
		[theme.breakpoints.down('sm')]: {
			marginBottom: 70,
		},
	},
	progressButton: {
		margin: '0 auto',
	},
	title: {
		marginBottom: theme.spacing(3),
	},
	linkButton: {
		color: 'inherit',
		textDecoration: 'none'
	}
})