import React, { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { KJUR } from 'jsrsasign'

const { publicRuntimeConfig: { api_url } } = getConfig()
const isServer = typeof window === 'undefined';

const decodeToken = (jwt) => {
	const { payloadObj } = KJUR.jws.JWS.parse(jwt)
	return payloadObj
}

const authStore = (auth) => {

	if (isServer) return;

	if (!window['__AUTHSTORE']) {
		window['__AUTHSTORE'] = auth
	}

	return window['__AUTHSTORE']
}

const getToken = async function (access_token) {
	const tokenResponse = await fetch(`${api_url}/v1/token`,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ token: access_token })
		})
		.then(response => response.json())
		.catch(e => ({ error: true, e }))

	if (tokenResponse.error) {
		console.error(tokenResponse)
		throw new Error(tokenResponse.error)
	}

	//console.log('getToken', tokenResponse);


	const { jwt: token, name, login, admin } = tokenResponse
	const { sub: userId } = decodeToken(token)

	return { token, userId, name, login, isAdmin: admin }
}

export const AuthContext = React.createContext({});


export const wrapWithAuth = (App) => {

	return class WrappedApp extends Component {

		static getInitialProps = async (app) => {

            if (!app) throw new Error('No app context')
            if (!app.ctx) throw new Error('No page context')

            let initialProps = {}

			if (app.ctx.req) {
				const { ctx: { req }} = app

				if (req.cookies && req.cookies.access_token) {

					try {
						const auth = await getToken(req.cookies.access_token)
						initialProps.auth = auth
						authStore(auth)
						app.ctx.auth = auth
						//console.log('authenticate 2 - has token!');
					} catch (e) {
						//console.log('authenticate 2 - TOKEN ERR', e);
					}
				}
			} else {
				const auth = authStore()
				app.ctx.auth = auth
			}

            if ('getInitialProps' in App) {
				initialProps = Object.assign(initialProps, await App.getInitialProps.call(App, app))
            }

			//console.log('authenticate 3 - initialProps', !!initialProps.auth);
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

			//console.log('authenticate 4 - render', !!auth);

            this.auth = auth
        }

		render() {

			let { ...props } = this.props

			//console.log('AuthContext.Provider value', this.auth );

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
					//console.log('AuthContext.Consumer', auth);
					return <Comp {...this.props} auth={auth} />}
				}
			</AuthContext.Consumer>
		}

	}

}