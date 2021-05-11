# MGL Inbound Call Web Application

## Project Structure

- `services/auth`: Authentication webhook
- `services/data`: Hasura GraphQL project with migrations
- `services/events`: Event triggers
- `services/actions`: Hasura actions
- `src`: Next.js web application

## Installation

```bash
brew update
brew install docker
```

```bash
brew install docker-machine
brew cask install virtualbox
```

```bash
brew install docker-compose
```

```bash
docker-machine create --driver virtualbox default
```

Verify if Docker engine is running

```bash
docker-machine ls
```

If for some reason, its not running, run below command

```bash
docker-machine start default
```

Show env variables

```bash
docker-machine env default
```

Set env variables show above

```bash
eval $(docker-machine env default)
```

Copy the IP address of the docker engine

```bash
docker-machine ip default
```

- [More info on Docker Machine](https://docs.docker.com/machine/get-started/)

## Database design and migration

Use Hasura CLI: https://docs.hasura.io/1.0/graphql/manual/hasura-cli/install-hasura-cli.html#install

- Design: go to `services/data`, then run below command. Default Secret is `hasura`, use above ip address for endpoint for example: `http://$(docker-machine ip default):8080`

```bash
hasura console --admin-secret [secret] --endpoint [endpoint]
```

- Migrate: This is already done during build command, so skip this command.

```bash
hasura migrate apply --admin-secret  [secret] --endpoint [endpoint]
```

## How to Run

- Copy `dotenv` file to `.env` and edit configuration if necessary

- Copy `src/dotenv` file to `src/.env` and edit configuration if necessary. Make sure you change the `NEXT_PUBLIC_DATA_DOMAIN` env var to the docker engine IP address

```bash
NEXT_PUBLIC_DATA_DOMAIN=192.168.99.100:8080
```

- Use Docker with docker-compose

```bash
# start development dockers
make dev
# because docker caches built images, when changing packages, we need to rebuild containers
make dev-build
```

- If for some reason, you need to start from scratch. Follow the below steps to delete all docker images, containers and volumes

```bash
docker stop $(docker ps -a -q)
```

```bash
docker rm $(docker ps -a -q)
```

```bash
docker system prune -a
```

```bash
docker volume prune
```

- [Docker Cheat Sheet](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes)

- For Test/Production environment, use `docker-compose.test.yaml` or `docker-compose.prod.yaml` config file. It requires `gcplogs` driver (read below), or you can remove it if using another logging services

```bash
make staging
# or
make prod
```

# Next.js application

## Prerequisites

- [React 16+](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Redux](https://redux.js.org/)
- [Redux Saga](https://redux-saga.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Line Awesome](https://icons8.com/line-awesome)
- [Firebase Ecosystem](https://firebase.google.com/)
- [ngrok](https://ngrok.com/download)

* Basic knowledge of Twilio platform - [TwilioQuest](https://www.twilio.com/quest/), an interactive, self-paced game where you learn how to Twilio.
* [Twilio TaskRouter](https://www.twilio.com/docs/quickstart/ruby/taskrouter)
* [Twilio Client](https://www.twilio.com/docs/voice/client/javascript/quickstart)

### Twilio Setup

If you haven't used Twilio before, welcome! You'll need to [Sign up for a Twilio account](https://www.twilio.com/try-twilio).

We recommend you create a separate project within Twilio and install this app using that project.

**Note:** It is recommended that you have an upgraded Twilio account to fully experience this demo.

## Configuration Variables

Before you start the install, you’ll need to collect the following variables from the Twilio Account Portal.

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`

* For Account SID and Auth Token please click here: https://www.twilio.com/console
* Buy a phone number or use an existing one (the application will configure the number for you later)
* Create a new Twilio [TaskRouter Workspace](https://www.twilio.com/user/account/taskrouter/workspaces) and select the custom template.

* For Twilio API Key SID and Twilio API Key Secret, click here: https://www.twilio.com/console/dev-tools/api-keys

- `TWILIO_API_KEY_SID`
- `TWILIO_API_KEY_SECRET`

* For outbound calls enable AGENT CONFERENCE setting, click here: https://www.twilio.com/console/voice/conferences/settings

**ngrok Setup**

- System Wide Install

  - [Download and install from ngrok](https://ngrok.com/download)
  - Install with NPM `npm install ngrok -g`
  - Run ngrok (if PORT is defined in your .env update accordingly)

    `./ngrok http 3000`

#### Install project:

```bash
npm install
```

Copy `src/dotenv` to `src/.env` then edit your environment
Set NEXT_PUBLIC_WEBSITE_URL to the ngrok url for example: http://bc6c3e0506c9.ngrok.io

#### Run Next.js development:

```bash
npm run dev
```

#### Run Firebase locally for testing:

```
npm run serve
```

#### Deploy it to the cloud with Firebase:

```bash
npm run deploy
```

#### Clean dist folder

```bash
npm run clean
```

### Testing

Use [Cypress testing framework](https://www.cypress.io/)
Create new test files in `cypress/integration` folder
Run test command:

```bash
npm test
# end to end test
npm run cy:open
```

## Important

- The empty `placeholder.html` file is so Firebase Hosting does not error on an empty `public/` folder and still hosts at the Firebase project URL.
- `firebase.json` outlines the catchall rewrite rule for our Cloud Function.
- The [Firebase predeploy](https://firebase.google.com/docs/cli/#predeploy_and_postdeploy_hooks) hooks defined in `firebase.json` will handle linting and compiling of the next app and the functions sourceswhen `firebase deploy` is invoked. The only scripts you should need are `dev`, `clean` and `deploy`.

## Learning Resources

- https://github.com/piotrwitek/react-redux-typescript-guide
- https://www.tailwindtoolbox.com/

## Development tools

- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Advanced guidelines

- [Production checklist](docs/production-checklist)
