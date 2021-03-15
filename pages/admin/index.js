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
import AdminImportSessionize from '../../components/AdminImportSessionize'
import AdminExportCfp from '../../components/AdminExportCfp'
import AdminExportGSheet from '../../components/AdminExportGSheet'
import AdminAppendCfp from '../../components/AdminAppendCfp'
import AdminDeleteCfp from '../../components/AdminDeleteCfp'
import AdminSetStage from '../../components/AdminSetStage'
import AdminAuditLog from '../../components/AdminAuditLog'

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
	const [activeTab, setActiveTab] = useState('users')
	const [cfp, setCfp] = useState({})

	const tabChange = (event, newValue) => {
	  	setActiveTab(newValue);
	};

	useEffect(() => {
		getCfp()
			.then((data) => {
        setCfp(data)
        setActiveTab('users')
			})
	}, [login])

	const handleError = (err) => {
		console.error(err);
	}

	const handleUpdate = async () => {
		const updatedCfp = await getCfp()
    setCfp(updatedCfp)
    setActiveTab('users')
	}

	return (<>
	<Box className={ css.adminGrid }>
		<Tabs
			orientation="vertical"
      variant="standard"
      centered={false}
			value={ activeTab }
			onChange={ tabChange }
			aria-label="Vertical tabs example"
			className={css.tabs}
		>
      <Tab
        label="Manage Users"
        value="users"
        className={ classNames(css.tab, css.wrapper) }
        {...a11yProps(0)}
      />
			{ !cfp.count && (
        <Tab
          label="Upload CFP"
          value="upload"
          className={ classNames(css.tab, css.wrapper)}
          {...a11yProps(1)}
        />
			)}
			{ !cfp.gsheet && (
        <Tab
          label="Import from Google Sheet"
          value="import-gsheet"
          className={ classNames(css.tab, css.wrapper)}
          {...a11yProps(2)}
        />
			)}
      { !cfp.sessionize && (
        <Tab
          label="Import from Sessionize"
          value="import-sessionize"
          className={ classNames(css.tab, css.wrapper)}
          {...a11yProps(2)}
        />
			)}
			{ cfp.count && (
        <Tab
          label="Set vote stage"
          value="stage"
          className={ classNames(css.tab, css.wrapper)}
          {...a11yProps(1)}
        />
			)}
      { (cfp.gsheet || cfp.sessionize) &&  (
        <Tab
          label="Append results"
          value="append"
          className={ classNames(css.tab, css.wrapper)}
          {...a11yProps(2)}
        />
			)}
			{ cfp.count && (
        <Tab
          label="Export results"
          value="export"
          className={ classNames(css.tab, css.wrapper)}
          {...a11yProps(2)}
        />
			)}
			{ cfp.count && (
        <Tab
          label="Delete CFP data"
          value="delete"
          className={ classNames(css.tab, css.wrapper)}
          {...a11yProps(3)}
        />
			)}
      <Tab
        label="Audit log"
        value="log"
        className={ classNames(css.tab, css.wrapper)}
        {...a11yProps(3)}
      />
		</Tabs>

		<Box className={ css.tabContents }>

			<TabPanel value={activeTab} index={'users'}>
				<AdminManageUsers
					onUpdate={ handleUpdate }
					onError={ handleError }
				/>
			</TabPanel>

		{ !cfp.count && (

			<TabPanel value={activeTab} index={'upload'}>
				<AdminUploadCfp
					onComplete={ handleUpdate }
					onError={ handleError }
				/>
			</TabPanel>
    )}
    { !cfp.gsheet && (
			<TabPanel value={activeTab} index={'import-gsheet'}>
				<AdminImportCfp
          onComplete={ handleUpdate }
        />
			</TabPanel>
    )}
    { !cfp.sessionize && (
      <TabPanel value={activeTab} index={'import-sessionize'}>
				<AdminImportSessionize
          onComplete={ handleUpdate }
        />
			</TabPanel>
    )}

		{ !!cfp.count && (
			<>
			<TabPanel value={activeTab} index={'stage'}>
				<AdminSetStage
					stage={ cfp.stage }
					onUpdate={ handleUpdate }
					onError={ handleError }
				/>
			</TabPanel>

      { (cfp.gsheet || cfp.sessionize) && (
        <TabPanel value={activeTab} index={'append'}>
          <AdminAppendCfp
            onComplete={ handleUpdate }
          />
        </TabPanel>
      )}
      { !cfp.gsheet && (
        <TabPanel value={activeTab} index={'export'}>
          <AdminExportCfp />
        </TabPanel>
      )}
      { cfp.gsheet && (
        <TabPanel value={activeTab} index={'export'}>
          <AdminExportGSheet />
        </TabPanel>
      )}

			<TabPanel value={activeTab} index={'delete'}>
				<AdminDeleteCfp
					onUpdate={ handleUpdate }
					onError={ handleError }
				/>
			</TabPanel>
			</>
		)}
    	<TabPanel value={activeTab} index={'log'}>
				<AdminAuditLog />
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
