# CFP Vote Application

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/JSConfBp/cfp-vote#release)

A mobile-first web app to help your (distributed) curator team to vote on hundreds of CFP's. At JSConf Budapest we used this app to vote on more than 600 CFP submissions.

[Try it out on 200 random generated CFPs](https://cfp-vote.herokuapp.com/)

Some example on what can you expect: 
* login to the app, using GitHub
* see your progress
* the proposals are displayed clean, you can only read the title and the abstracts
* voting labels and values can be customized if necessary

![Screenshots of the mobile view of the app](https://raw.githubusercontent.com/JSConfBp/cfp-vote/master/docs/app-example.jpg)

---

The goal here to vote bias-free, distraction-free, to do anonymized voting, reading the relevant part of submissions one-by-one. You won't see who sumitted the talk, only the title, and abstracts. You won't see what your peers voted either.

This app setup aligns to the JS/CSSConf EU CFP [voting way](https://blog.cssconf.eu/2015/08/15/a-talk-selection-process-explained/):
* First round: go through every submission, and vote on them on a scale from 1-5
* Evaluate first round: pick the top ~80 or pick the top talks with at least N points
* Shortlist round: go through the shortlisted submissions, and vote on them on a scale from 0-2

At this point you can export the submissions to CSV/XLSX and see each vote, and their summarized votes in rounds, and move on to the next steps, de-anonymizing and curating the talks for your event.

To help you evaluate rounds, the app has a Statistical view, showing the talk/vote distribution (without any details) and progress of team members.

![Screenshot of the statistics page](https://raw.githubusercontent.com/JSConfBp/cfp-vote/master/docs/stats-example.png)


## Setup for your event

This quick guide should help you to set up this app for your event, using GitHub and Heroku.

You will have to set a few variables for your app:
* ADMINS - a list of GitHub usernames, who will have administrative roles (["user1","user2"])

These are necessary for you app to log in using GitHub
* GITHUB_CLIENT_ID
* GITHUB_CLIENT_SECRET
* GITHUB_REDIRECT_URI

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
