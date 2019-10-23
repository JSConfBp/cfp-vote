import Route from './Route'
import Link from 'next/link'

export default (props) => (<Route.Consumer>
	{routes => {
		const {
			key,
			prefetch,
			replace,
			shallow,
			passHref,
			scroll,
			to
		} = props

		let urlParams = routes[to].path.match(/:[\w-_]*/ig)
		let propParams = []
		let as = routes[to].path
		let href = `/${routes[to].page}`

		const linkProps = {
			key,
			prefetch,
			replace,
			shallow,
			passHref,
			scroll
		}

		if (urlParams) {
			propParams = urlParams.map(str => str.replace(':', ''))
		}

		if (propParams.length > 0) {
			as = urlParams.reduce((url, param, index)=> {
				url = url.replace(param, props[[propParams[index]]])
				return url
			}, as)

			href = urlParams.reduce((url, param, index)=> {
				const amp = url[url.length - 1] === '?' ? '' : '&'
				url += `${amp}${propParams[index]}=${props[[propParams[index]]]}`
				return url
			}, `${href}?`)
		}

		linkProps.as = as
		linkProps.href = href

		return (<Link {...linkProps} >
			{props.children}
		</Link>)
	}}
	</Route.Consumer>
)