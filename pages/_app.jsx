import React from 'react'
import Head from 'next/head'
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { NotificationProvider } from '../components/NotificationHook'

import {theme, createEmotionCache } from '../components/theme';

import NotificationComponent from '../components/Notification'
import CfpUIConfig from '../cfp.config'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
  <SessionProvider session={pageProps.session}>
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{CfpUIConfig.title}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <NotificationProvider component={ NotificationComponent }>
          {/* CssBaseline kickstart an elegant, consistent,
            and simple baseline to build upon. */}
          <CssBaseline />
          <NextNProgress color={theme.palette.info.main} />
          {/* Pass pageContext to the _document though the renderPage enhancer
            to render collected styles on server-side. */}
            <Component {...pageProps} />
        </NotificationProvider>
      </ThemeProvider>
    </CacheProvider>
  </SessionProvider>)
}
