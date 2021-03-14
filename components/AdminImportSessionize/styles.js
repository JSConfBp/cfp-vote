export default theme => ({
  container: {
		display: 'block',
		width: '100%'
  },
	importStepper: {
		paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'transparent'
  },
  textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
  },
  sheetsText: {
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	},
	field: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	},
	stepContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: '60vw',
    margin: '0 auto',
    marginTop: theme.spacing(4),
    padding: theme.spacing(4)
  },
  nextButton: {
    marginTop: theme.spacing(4)
  }
});
