![](https://cdn.glitch.com/b7d690b4-f766-4720-b20d-91973faadd12%2FHubotRocketChat.png?1535453254484)

# gitsy - Gitlab hubot for Rocket.Chat 

Based on Hubot v3 !  Easy to customize with:

*  completely coffeescript free
*  full glitch.com support for rapid development
*  extend easily using modern ES6 async - await syntax

NOTE:

Edit files under *scripts* directory to customize your Hubot gitsy!


## Install
Gitsy requires Node.js to run. Current LTS releases include 6.x, 8.x, 10.x. Async and await was added in Node 7.6.0 so versions 8 or higher would be advisable. 

For general installation see https://nodejs.org/en/download/package-manager/

For installing on Red Hat, Fedora or CentOS see https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions-1



Configuration is done through the use of environment variables. From the shell, environment variables can be set using `export variablename=value`. If using Docker or glitch.com a .env file can be used. 

See https://docs.docker.com/compose/env-file/ or https://glitch.com/help/env/ for more information.

Once the bot has been configured, it can be run. From the repo simply run `bin/hubot`.

### Configuration
Gitsy is built on hubot-rocketchat and inherits environment variables. See https://github.com/RocketChat/hubot-rocketchat#configuring-your-bot

| Env variable           | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| **Hubot**		           | A subset of relevant [Hubot env vars][hubot-env]     |
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
| `INTEGRATION_ID`			 | Name to ID source of messages in code (e.g Hubot)     |

`*` Required settings, unless running locally with testing defaults:
- url: `localhost:3000`
- username: `bot`
- password: `pass`


In addition to those, Gitsy has its own

| Env variable                   | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| `GITLAB_URL`                   | The GitLab host that Gitsy will connect to.         |
| `GITLAB_API_KEY`               | Allow API access. Can be per account or per server. |

`GITLAB_URL` and `GITLAB_API_KEY` are required in order to connect to the Gitlab install.

`GITLAB_URL` is the GitLab host that Gitsy will connect to. It can be your own Community Edition server, or your projects on gitlab.com. `GITLAB_API_KEY` is the API key to allow Gitsy to access a GitLab account. Obtain an API key from your GitLab account. If you are an administrator, you can get an API key for the entire server, with visibility to all projects; as a user, your API key can only access your own project(s).

`ROCKETCHAT_USESSL` may need to be set to true
