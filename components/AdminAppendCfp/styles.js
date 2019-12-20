export default theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  container: {
		display: 'block',
		width: '100%'
  },
	importStepper: {
		paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'transparent'
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
