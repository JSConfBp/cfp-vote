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
  
  
const Admin = ({ auth: { login, admin } }) => {
	const css = useStyles();
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
	  setValue(newValue);
	};

	useEffect(() => {
		
	}, [login])

	return (<>
	<Box className={ css.adminGrid }>
		<Tabs
			orientation="vertical"
			variant="standard"
			value={value}
			onChange={handleChange}
			aria-label="Vertical tabs example"
			className={css.tabs}
		>
			<Tab label="Upload CFP" {...a11yProps(0)} />
			<Tab label="Import CFP" {...a11yProps(1)} />
			<Tab label="Manage Users" {...a11yProps(2)} />
		</Tabs>
		<Box className={ css.tabContents }>
			<TabPanel value={value} index={0}>
				<AdminUploadCfp />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<AdminImportCfp />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<AdminManageUsers />
			</TabPanel>
			
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