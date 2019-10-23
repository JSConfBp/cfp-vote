import { createStore, applyMiddleware, bindActionCreators } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { connect } from 'react-redux'
import * as FastRedux from 'fast-redux'
import withRedux from 'next-redux-wrapper'
import { composeWithDevTools } from 'redux-devtools-extension'

export const { rootReducer, namespaceConfig: nsConfig } = FastRedux
export const createState = nsConfig

export default function ReduxComposeFactory (actionsObj, getState) {

	function mapStateToProps (state) {
		return getState(state)
	}

	function mapDispatchToProps (dispatch) {
		return bindActionCreators(actionsObj, dispatch)
	}

	return (Comp) => connect(mapStateToProps, mapDispatchToProps)(Comp)
}

export const initStore = (initialState = {}) => {
  return createStore(rootReducer, initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware)))
}

export const wrapWithStore = (Comp) => {
	return withRedux(initStore)(Comp)
}