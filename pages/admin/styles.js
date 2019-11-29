export default theme => ({
	paper: {
		background: 'none',
	},
	centered: theme.mixins.gutters({
		background: 'none',
		margin: '0 auto',
		width: '80vw',
	}),
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
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
		height: 'calc(100vh - 70px)'
  },
  tab: {
    alignItems: 'flex-end'
  },
  wrapper: {
    alignItems: 'flex-end'
  },
	tabContents: {
		padding: theme.spacing(4),
	},
	adminGrid: {
		display: 'grid',
		gridTemplateColumns: '14rem auto',
		[theme.breakpoints.up('md')]: {
			marginTop: 70,
		},
	}
})
