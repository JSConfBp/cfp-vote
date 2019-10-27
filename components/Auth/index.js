import React, { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { KJUR } from 'jsrsasign'
import color from '@material-ui/core/colors/teal'

import AuthContext from '../../context/Auth'

const isServer = typeof window === 'undefined';

const authStore = (auth) => {

	if (isServer) return;

	if (!window['__AUTHSTORE']) {
		window['__AUTHSTORE'] = auth
	}

	return window['__AUTHSTORE']
}

export const wrapWithAuth = (App) => {

	return class WrappedApp extends Component {

		static getInitialProps = async (app) => {

            if (!app) throw new Error('No app context')
            if (!app.ctx) throw new Error('No page context')

			let initialProps = {}
			
			if (!process.browser) {
				const { user, route } = app.ctx.req
				
				// console.log('authenticate getInitialProps', user);

				initialProps.auth = user
				authStore(user)
				app.ctx.auth = user
			} else {
				const auth = authStore()
				app.ctx.auth = auth
			}

            if ('getInitialProps' in App) {
				initialProps = Object.assign(initialProps, await App.getInitialProps.call(App, app))
            }

			// console.log('authenticate 3 - initialProps', !!initialProps.auth);
            return initialProps
		}

		constructor(props, context) {
            super(props, context);

			let { auth } = props;

            if (!!auth) {
				authStore(auth)
			} else {
				auth = authStore()
			}

			// console.log('authenticate 4 - render', !!auth);

            this.auth = auth
        }

		render() {

			let { ...props } = this.props

			// console.log('AuthContext.Provider value', this.auth );

			return (<AuthContext.Provider value={ this.auth }>
				<App {...props}  />
				</AuthContext.Provider>
			);
		}
	}
}

export default (Comp) => {

	return class Authenticated extends Component {

		static getInitialProps = async (app) => {
			let initialProps = {}

            if ('getInitialProps' in Comp) {
				initialProps = Object.assign(initialProps, await Comp.getInitialProps.call(Comp, app))
			}

            return initialProps
		}

		render() {
			return <AuthContext.Consumer>
				{auth => {
					// console.log('AuthContext.Consumer', auth);
					return <Comp {...this.props} auth={auth} />}
				}
			</AuthContext.Consumer>
		}

	}

}