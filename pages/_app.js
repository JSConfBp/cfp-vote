import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../components/theme';

import { wrapWithAuth } from '../components/Auth'
import Route from '../components/Route'
import routing from '../routing'

import CfpUIConfig from '../cfp.config'

class MyApp extends App {

	componentDidMount() {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentNode.removeChild(jssStyles);
		}
	}

	render () {
		const { Component, pageProps } = this.props

	  return <>
			<Head>
				<title>{CfpUIConfig.title}</title>
			</Head>

			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent,
					and simple baseline to build upon. */}
				<CssBaseline />
				<Route.Provider value={routing()}>
				{/* Pass pageContext to the _document though the renderPage enhancer
					to render collected styles on server-side. */}
					<Component pageContext={this.pageContext} {...pageProps} />
				</Route.Provider>
			</ThemeProvider>
		</>
	}
}

export default wrapWithAuth(MyApp)