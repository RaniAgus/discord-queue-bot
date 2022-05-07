# discord-queue-bot

A Discord bot for queue management.

https://user-images.githubusercontent.com/39303639/167271239-37339313-cf44-452e-a4aa-009cdf25f5b5.mp4

## Setup

### Create your own Discord Application
Create a new Discord Application from
[here](https://discord.com/developers/applications) and invite it to your own
Discord guild (a.k.a. server) by generating a link via [OAuth2 > OAuth2 URL
Generator], allowing at least these permissions:

- Scopes: bot, applications.commands
- Bot permissions:
  - General Permissions: Manage roles, Manage Channels, View Channels
  - Text Permissions: all
  - Voice Permissions: Move Members

Here's an example link:
```
https://discord.com/api/oauth2/authorize?client_id=APPLICATION_ID&permissions=535009164368&scope=bot%20applications.commands
```
To use it, replace `APPLICATION_ID` with your Discord Application ID.

### Build & Run
This project requires Node.js v16.6.0 or higher.

1. Configure `.env` file:

- `DISCORD_TOKEN`:  Your **confidential** Application Token [Bot > Token > Copy]
- `APPLICATION_ID`: Application ID [General Information > Application ID]
- `GUILD_ID`: Target Discord Server ID (must have developer mode enabled!)
- `LOG_CHANNEL_ID`: Discord Text Channel ID for redirecting error output
- `ADMIN_ROLES`: Role IDs that are allowed to use admin interactions, separated
by pipes (eg: `id1|id2|...|idN`)
- `UTC_OFFSET`: Timezone offset from UTC. If not set, it defaults to `'-03:00'`
(Buenos Aires, Argentina).

2. Install dependencies: `npm install`

3. Start the app: `npm start`

### Build & Run the Docker image

```shell
docker build . -t discord-queue-bot:latest
docker run --rm --init --env-file ./.env discord-queue-bot:latest
```

### Use a Docker container for development

This repository includes a `.devcontainer` folder with a proper configuration
for development via Visual Studio Code using
[Remote Development Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).
