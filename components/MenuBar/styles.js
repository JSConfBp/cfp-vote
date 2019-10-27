export default theme => ({
	grow: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
		paddingLeft: 30,
		[theme.breakpoints.down('sm')]: {
			display: 'none'
		}
	},
	appBar: {
		flexGrow: 1,
		[theme.breakpoints.down('md')]: {
			top: 'auto',
			bottom: 0,
		},
		[theme.breakpoints.up('md')]: {
			top: 0,
			bottom: 'auto',
		},
	},
	list: {
		width: 250,
	},
	toolbar: {
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	fabButton: {
		position: 'absolute',
		zIndex: 1,
		top: -30,
		left: 0,
		right: 0,
		margin: '0 auto',
		display: 'none',
		[theme.breakpoints.down('sm')]: {
			display: 'block',
		},
	},
	menuDrawer: {
		display: 'flex',
		height: `100%`,
		alignItems: `flex-start`,
		[theme.breakpoints.down('sm')]: {
			alignItems: `flex-end`,
		}
	},
	menuLink: {
		color: 'inherit',
		textDecoration: 'none'
	}
})