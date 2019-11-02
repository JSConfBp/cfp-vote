import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Authenticated from '../../components/Auth'
import MenuBar from '../../components/MenuBar';


import AdminUploadCfp from '../../components/AdminUploadCfp'
import AdminManageUsers from '../../components/AdminManageUsers'
import AdminImportCfp from '../../components/AdminImportCfp'
import AdminExportCfp from '../../components/AdminExportCfp'
import AdminDeleteCfp from '../../components/AdminDeleteCfp'
import AdminSetStage from '../../components/AdminSetStage'

import styles from './styles'
const useStyles = makeStyles(styles)

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;
  
	return (
	  <Typography
		component="div"
		role="tabpanel"
		hidden={value !== index}
		id={`vertical-tabpanel-${index}`}
		aria-labelledby={`vertical-tab-${index}`}
		{...other}
	  >
		<Box>{children}</Box>
	  </Typography>
	);
}

const getCfp = async (token) => {
	return fetch(`/api/cfp`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
}
  
  
const Admin = ({ auth: { login } }) => {
	const css = useStyles();
	const [activeTab, setActiveTab] = useState(0)
	const [cfp, setCfp] = useState({})

	const tabChange = (event, newValue) => {
	  	setActiveTab(newValue);
	};

	useEffect(() => {
		getCfp()
			.then((data) => {
				setCfp(data)
			})
	}, [login])

	const handleError = (err) => {
		console.error(err);
	}

	const handleUpdate = async () => {
		const updatedCfp = await getCfp()
		setCfp(updatedCfp)
	}

	return (<>
	<Box className={ css.adminGrid }>
		<Tabs
			orientation="vertical"
			variant="standard"
			value={ activeTab }
			onChange={ tabChange }
			aria-label="Vertical tabs example"
			className={css.tabs}
		>
			<Tab label="Manage Users" {...a11yProps(0)} />
			{ !cfp.count && (
				<Tab label="Upload CFP" {...a11yProps(1)} />
			)}
			{ !cfp.count && (
				<Tab label="Import CFP" {...a11yProps(2)} />
			)}
			{ cfp.count && (
				<Tab label="Set vote stage" {...a11yProps(1)} />
			)}
			{ cfp.count && (
				<Tab label="Export results" {...a11yProps(2)} />
			)}
			{ cfp.count && (
				<Tab label="Delete CFP data" {...a11yProps(3)} />
			)}
			
		</Tabs>
		<Box className={ css.tabContents }>

			<TabPanel value={activeTab} index={0}>
				<AdminManageUsers 
					onUpdate={ handleUpdate } 
					onError={ handleError } 
				/>
			</TabPanel>

		{ !cfp.count && (
			<>
			<TabPanel value={activeTab} index={1}>
				<AdminUploadCfp 
					onUpdate={ handleUpdate } 
					onError={ handleError } 
				/>
			</TabPanel>
			<TabPanel value={activeTab} index={2}>
				<AdminImportCfp />
			</TabPanel>
			</>
		)}

		{ !!cfp.count && (
			<>
			<TabPanel value={activeTab} index={1}>
				<AdminSetStage
					stage={ cfp.stage }
					onUpdate={ handleUpdate } 
					onError={ handleError } 
				/>
			</TabPanel>
			<TabPanel value={activeTab} index={2}>
				<AdminExportCfp />
			</TabPanel>
			<TabPanel value={activeTab} index={3}>
				<AdminDeleteCfp 
					onUpdate={ handleUpdate } 
					onError={ handleError } 
				/>
			</TabPanel>
			</>
		)}
		</Box>
	</Box>
	<MenuBar subTitle="Administration"/>
	</>)
}

Admin.getInitialProps = async ({ auth }) => {
	return {
		auth,
	}
}

export default Authenticated(Admin)