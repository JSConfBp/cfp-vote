export default theme => ({
	stats: {
		display: 'flex',
		justifyContent: 'space-around',
		flexWrap: `wrap`,
	},
	paper: theme.mixins.gutters({
		background: 'none',
		margin: '0 auto',
		width: '80vw',
		marginTop: 20,
		[theme.breakpoints.down('sm')]: {
			marginBottom: 70,
		},
		[theme.breakpoints.up('sm')]: {
			marginTop: 70,
		},
		paddingTop: 32,
		paddingBottom: 32,
	}),
	title: {
		marginBottom: theme.spacing.unit * 3,
	},
	linkButton: {
		color: 'inherit',
		textDecoration: 'none'
	}
});
