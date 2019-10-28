 export default theme => ({
	root: {
		flexGrow: 1,
	},
	paper: theme.mixins.gutters({
		background: 'none',
		width: '80vw',
		paddingTop: 32,
		paddingBottom: 32,
		margin: '0 auto',
		boxShadow: 'inherit',

		[theme.breakpoints.down('md')]: {
			marginBottom: 100,
			marginTop: 32,
			width: '100vw',
			marginLeft: 0,
			marginRight: 0,
			boxShadow: 'none',
		},
		[theme.breakpoints.up('md')]: {
			marginBottom: 32,
			marginTop: 100,
		},
	}),
	modal: {
		bottom: 40,
		minHeight: '20vh',
		width: '90%',
		position: 'absolute',
		left: '50%',
		transform: 'translateX(-50%)',
    	backgroundColor: theme.palette.background.paper,
    	boxShadow: theme.shadows[5],

    	outline: 'none',
		display: 'flex',
		flexWrap: `wrap`,
		justifyContent: `space-evenly`,
		padding: 20,
	},
	title: {
		lineHeight: 1.2,
		marginBottom: theme.spacing.unit * 4,
	},
	p: {
		lineHeight: 1.5,
		marginBottom: theme.spacing.unit * 4,
	},
	desktop_vote: {
		[theme.breakpoints.down('sm')]: {
			display: 'none'
		},
		display: 'flex',
		flexWrap: `wrap`,
		justifyContent: `space-between`
	},
});
