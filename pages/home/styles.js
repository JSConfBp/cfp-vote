export default theme => ({
	root: {
		flexGrow: 1,
	},
	paper: theme.mixins.gutters({
		width: '80vw',
		paddingTop: 16,
		paddingBottom: 16,
		margin: '0 auto',
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	}),
	title: {
		marginBottom: theme.spacing(3),
	}
})