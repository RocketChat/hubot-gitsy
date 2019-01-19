![](https://cdn.glitch.com/b7d690b4-f766-4720-b20d-91973faadd12%2FHubotRocketChat.png?1535453254484)

# gitsy - Gitlab hubot for Rocket.Chat 

Based on Hubot v3 !  Easy to customize with:

*  completely coffeescript free
*  full glitch.com support for rapid development
*  extend easily using modern ES6 async - await syntax

NOTE:

Edit files under *scripts* directory to customize your Hubot gitsy!

## Quick Start

Get hubot-gitsy running on your Rocket.Chat and Gitlab server in 3 minutes.

1. Remix [this glitch](https://glitch.com/edit/#!/hubot-gitsy) 
1. edit the `.env` file and add information about your BOT, Rocket.Chat server, and Gitlab server (as documented in the *Environment variables* section below).

## Linux Development/Deployment Quick Start

If you prefer development on a Linux system. You will need `git` and `node` installed.

Then check out the latest gitsy code:

```
git clone https://github.com/RocketChat/hubot-gitsy
cd hubot-gitsy
npm i
```
Add a `.env` file containing:

```
# note: .env is a shell file so there can't be spaces around =
ADAPTER_NAME=rocketchat
ROCKETCHAT_URL="https://your.rocketchat.server"
ROCKETCHAT_USESSL=true
ROCKETCHAT_USER="xxxx"
ROCKETCHAT_PASSWORD="xxxx"
ROCKETCHAT_ROOM="xxxxx"
RESPOND_TO_DM=true
RESPOND_TO_EDITED=true
GITLAB_API_KEY="xxxxx"
GITLAB_URL="https://your.gitlab.server/"
GITLAB_CHANNEL="xxxxx"
GITLAB_DEBUG="true"
GITLAB_BRANCHES="xxxxx"
```
(see Environment variables section for details on the variables)

Finally start gitsy:

```
npm start
```
##  Dockerized Quick Start

On a Linux / MacOS system with only `docker` installed.  In an empty directory, checkout the latest gitsy code:

```
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/RocketChat/hubot-gitsy
cd hubot-gitsy
```

Add a `.env` file containing:

```
# note: .env is a shell file so there can't be spaces around =
ADAPTER_NAME=rocketchat
ROCKETCHAT_URL="https://your.rocketchat.server"
ROCKETCHAT_USESSL=true
ROCKETCHAT_USER="xxxx"
ROCKETCHAT_PASSWORD="xxxx"
ROCKETCHAT_ROOM="xxxxx"
RESPOND_TO_DM=true
RESPOND_TO_EDITED=true
GITLAB_API_KEY="xxxxx"
GITLAB_URL="https://your.gitlab.server/"
GITLAB_CHANNEL="xxxxx"
GITLAB_DEBUG="true"
GITLAB_BRANCHES="xxxxx"
```
(see Environment variables section for details on the variables)

Then  create a `docker-compose.yml` containing:

```
version: "2"
services:
  node:
    image: "node:8.11"
    user: "node"
    working_dir: /home/node/app
    environment:
      - NODE_ENV=development
    volumes:
      - ./:/home/node/app
    command: bash -c "npm install && npm start"
```

Finally, start gitsy as a daemon:

```
docker-compose up -d
```

Note the container name, and then you can watch the logs as the gitsy starts up:

```
docker logs <container name>
```


## Install
Gitsy requires Node.js to run. Current LTS releases include 6.x, 8.x, 10.x. Async and await was added in Node 7.6.0 so versions 8 or higher would be advisable. 

For general installation see https://nodejs.org/en/download/package-manager/

For installing on Red Hat, Fedora or CentOS see https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions-1

Configuration is done through the use of environment variables. These can be set in multiple ways. From the shell, environment variables can be set using `export variablename=value`. Environment variables can be set using a shell script but be aware the script should be executed using `. <scriptname>` or `source <scriptname>`.

If using Docker or glitch.com a .env file can be used. See https://docs.docker.com/compose/env-file/ or https://glitch.com/help/env/ for more information.

Once the bot has been configured, it can be run. From the repo simply do `bin/hubot`.

### Environment variables
[rcsdk-env]: https://github.com/rocketchat/rocket.chat.js.sdk#settings
[hubot-env]: https://hubot.github.com/docs/scripting/#environment-variables

Gitsy is built on hubot-rocketchat and inherits environment variables. See https://github.com/RocketChat/hubot-rocketchat#configuring-your-bot

| Env variable           | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| **Hubot**              | A subset of relevant [Hubot env vars][hubot-env]      |
| `HUBOT_ADAPTER`        | Set to `rocketchat` (or pass as launch argument)      |
| `HUBOT_NAME`           | The programmatic name for listeners                   |
| `HUBOT_ALIAS`          | An alternate name for the bot to respond to           |
| `HUBOT_LOG_LEVEL`      | The minimum level of logs to output                   |
| `HUBOT_HTTPD`          | If the bot needs to listen to or make HTTP requests   |
| **Rocket.Chat SDK**    | A subset of relevant [SDK env vars][rcsdk-env]        |
| `ROCKETCHAT_URL`*      | Local Rocketchat address (start before the bot)       |
| `ROCKETCHAT_USER`*     | Name in the platform (bot user must be created first) |
| `ROCKETCHAT_PASSWORD`* | Matching the credentials setup in Rocket.Chat         |
| `ROCKETCHAT_ROOM`      | The default room/s for the bot to listen in to (csv)  |
| `LISTEN_ON_ALL_PUBLIC` | Whether the bot should be listening everywhere        |
| `RESPOND_TO_DM`        | If the bot can respond privately or only in the open  |
| `RESPOND_TO_EDITED`    | If the bot should reply / re-reply to edited messages |
| `RESPOND_TO_LIVECHAT`  | If the bot should respond in livechat rooms           |
| `INTEGRATION_ID`       | Name to ID source of messages in code (e.g Hubot)     |

`*` Required settings, unless running locally with testing defaults:
- url: `localhost:3000`
- username: `bot`
- password: `pass`

`ROCKETCHAT_USESSL` may need to be set to true

In addition to those, Gitsy has its own

| Env variable                    | Description                                         |
| ------------------------------- | --------------------------------------------------- |
| `GITLAB_URL`                    | The GitLab host that Gitsy will connect to.         |
| `GITLAB_API_KEY`                | Allow API access. Can be per account or per server. |
| `GITLAB_CHANNEL`                | The channel where project events are posted.        |
| `GITLAB_BRANCHES`               | The branch(es) to monitor in a monitored project    |
| `GITLAB_SHOW_COMMITS_LIST`      | If the bot lists commits when commits are pushed    |
| `GITLAB_SHOW_MERGE_DESCRIPTION` | If the bot's message includes the merge description |

`GITLAB_URL` and `GITLAB_API_KEY` are necessary so Gitsy can talk to the Gitlab install.

`GITLAB_URL` is the GitLab host that Gitsy will connect to. It can be your own Community Edition server, or your projects on gitlab.com. If not set it defaults to gitlab.com.

`GITLAB_API_KEY` is the API key to allow Gitsy to access a GitLab account. If you are an administrator, you can get an API key for the entire server, with visibility to all projects; as a user, your API key can only access your own project(s). If not set only public projects are visible. If this is set but the key is invalid then Gitsy will throw an error. The API key can be created by going to your Gitlab profile, to Access Tokens and creating a personal access token.

`GITLAB_CHANNEL` is the channel in which messages about monitored projects are posted when events occur. Events include creation or modification of a PR, issue, branch, comment etc. It defaults to 'general' if not set.

`GITLAB_BRANCHES` specifies the branch or branches to monitor in a monitored project. It defaults to all.

`GITLAB_SHOW_COMMITS_LIST` tells the bot whether to list the commits pushed. It defaults to true. If set to false there will still be a message when commits are pushed but the commits will not be listed.

`GITLAB_SHOW_MERGE_DESCRIPTION` tells the bot whether to include the description when announcing a merge request. It defaults to true. 

### Gitlab integration, system and web hooks 
There are two methods to using Gitsy. One way is to receive notifications from Gitlab as they come in and the other is to have Gitsy retrieve information on command.

#### Notifications sent from Gitlab 
Gitlab → Bot → Channel

A system hook is used for receiving notifications in RocketChat from events in Gitlab such as creation of users or projects, commits etc. These notifications will appear in your chosen channel (`GITLAB_CHANNEL`) when something occurs in Gitlab. These notifications do not require `GITLAB_URL` or `GITLAB_API_KEY` to be set. Notifications can be set globally (system hooks) or per project (using web hooks).

##### Using system hooks

A system hook is used for events across Gitlab such as

* Creation of a project
* Deletion of a project
* Creation of a user
* Deletion of a user
* A user having access to a project granted
* A user having access to a project revoked

To set up a system hook in Gitlab go to the admin area and then to System Hooks.\
The URL should be in the form: `<bot url>/gitlab/system`.\
Triggers can be chosen and the system hook can be added.

##### Using web hooks

A web hook can be used to monitor events for specific projects. These events includes commits, issues, wiki pages etc.

To set up a web hook go to the project page, hover over settings and click integrations.\
The URL should be in the form `<bot url>/gitlab/web`.\
As with system hooks, triggers can be chosen and the web hook can be added.

#### Retrieving information from Gitlab
Channel → Bot → Gitlab

To retrieve information from Gitlab interactively, `GITLAB_URL` and `GITLAB_API_KEY` are necessary.

You can issue a command and Gitsy will query Gitlab and post a response back in the channel.

Commands include:

* intro gitsy - gitsy introduces itself and lists available commands
* projects - list all projects available
* prs for n - list open merge requests for project #n
* issues for n - list open issues for project #n
* snippets for n - list snippets for project #n
* pr n for m - show merge request #n for project #m
* issue n for m - show issue #n for project #m
* snippet n for m - view snippet #n for project #m

A couple of examples assuming your bot is named rocket.cat:
```
@rocket.cat intro gitsy
```
```
@<user> Hi, my name is gitsy, and I am the Rocket.Chat gitlab integration bot.
You can add me for your own Gitlab CE projects or Gitlab cloud public projects.
Find my code here:
https://github.com/RocketChat/Rocket.Chat.Ops/tree/master/hubots/hubot-gitsy
I can do webhooks, issues, merge requests, and snippets out of the box.
Please add to my abilities and contribute your code to Rocket.Chat.
projects - list all projects available
prs for n - list open merge requests for project #n
issues for n - list open issues for project #n
snippets for n - list snippets for project #n
pr n for m - show merge request #n for project #m
issue n for m - show issue #n for project #m
snippet n for m - view snippet #n for project #m
```
```
@rocket.cat projects
```
```
1       A project                     2018-11-29T12:41:24.240Z
2       another project               2018-09-17T21:04:33.967Z
3       a third project               2018-09-06T19:01:07.395Z
```
