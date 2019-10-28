# cfp-vote-ui


## Setup for your event

This quick guide should help you to set up this app for your event, using GitHub and Heroku.

### Step 1: GitHub OAuth Setup

To set up Oauth with github, visit your the Oauth applications page of your GitHub Org, for example https://github.com/organizations/__YOUR_ORG__/settings/applications

![The OAuth menu in your Org Settings](https://raw.githubusercontent.com/JSConfBp/cfp-vote-ui/master/docs/oauth-menu.png)

Create a new application. For now, enter some random URL in the "Authorization callback URL" and the "Application URL" part. You have to update these a bit later, when the setup is ready.

![New OAuth Application form](https://raw.githubusercontent.com/JSConfBp/cfp-vote-ui/master/docs/oauth-new-app.png)

When you've saved the new Application, it will show you your OAuth Secrets, similar to this.

![OAuth Secrets](https://raw.githubusercontent.com/JSConfBp/cfp-vote-ui/master/docs/oauth-secrets.png)

These will be needed by the CFP vote app to authenticate your team members.

### Step 2: Set up the CFP Vote Service

Follow [this link](https://github.com/JSConfBp/cfp-vote-service) for instructions, the process is similar to this.

### Step 3: Set up the UI App

Fork this repo, then go to Heroku and create a new App there. Connect it to GitHub, you can turn on automatic deployments

![Connect your Heroku app to GitHub](https://raw.githubusercontent.com/JSConfBp/cfp-vote-ui/master/docs/heroku-github-connect.png)

If your App is connected to GitHub, go to it's Settings tab, and edit the config vars:

* **API_URL**  
the service url that you set up in Step 2
* **GH_OAUTH_CLIENT_ID**
* **GH_OAUTH_CLIENT_SECRET**  
these are displayed on your GitHub Org OAuth application page
* **GH_REDIRECT_URI**  
this should point to a path on this app, like this  
https://__HEROKU_APP_NAME__.herokuapp.com/oauth

If you've added these, go to the Deploy tab on Heroku, scroll to the bottom, and do a manual deploy .

![Manual deploy to Heroku](https://raw.githubusercontent.com/JSConfBp/cfp-vote-ui/master/docs/heroku-manual-deploy.png)

### Do not forget to update your GitHub OAuth app URLs!

Go back to the OAuth settings on GitHub, and edit the URLs.

* your "Application URL" is the Heroku app url, something like this  
https://__HEROKU_APP_NAME__.herokuapp.com/

* the "Authorization callback URL" is the `/oauth` path on the app  
https://__HEROKU_APP_NAME__.herokuapp.com/oauth


## Development


Clone the repo, install deps

```
$ npm i 
```

Create a `.env` file based on the `.env.example` in the repo. Obtain a development GH app credential set, using the setup above, but set your "Authorization callback URL" should be `http://0.0.0.0:4000/oauth` (or whatever port you wish to use locally)

Add your GH user to the ADMIN section.

Start the development environment:

```
$ npm run dev
```

### Mock cfp data

To generate 200 cfp submissions into a csv file, just run the generator script:

```
$ node scripts/mock_cfp_export.js
Success! cfp-export_teal.csv written with 200 submitted CFPs
```
