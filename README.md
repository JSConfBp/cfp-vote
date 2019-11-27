# CFP Vote Application

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/JSConfBp/cfp-vote#release)

## Setup for your event

This quick guide should help you to set up this app for your event, using GitHub and Heroku.

### Step 1: GitHub OAuth Setup

[Check out our guide on how to create an OAuth App](https://github.com/JSConfBp/cfp-vote/wiki/GitHub-OAuth-Setup)

### Step 2: Set up the App

Just use the Deploy to Heroku button ot the top of this readme, or you can try to follow [our guide for Heroku](https://github.com/JSConfBp/cfp-vote/wiki/Set-up-the-App).

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
