# Facebook Messenger RPG Bot

Facebook Messenger RPG Bot (RPGBot) is a text-based player interface (TUI) game played through Facebook Messenger (Messenger). players can play the game by sending commands to the bot. 

## Purpose

The purpose of this application is to learn and practice:

1. New APIs
2. HTTP Requests
3. Back end servers
4. Databases

## Tech Stack

Node.Js, JavaScript, SQLite

## Front End (TUI)

Players will be able to send text commands to the bot through Messenger. Eventually, players will also be able to see options using post-back buttons.

### Commands
The structure of commands will be: '\<command\> \<args\>'

## Back End

Facebook provides a webhook that the server can subscribe to. Once the server is subscribed, it will receive a POST request every time someone messages the bot on Messenger. Once a webhook event is received, the server will parse the text-commands and respond accordingly. 

The back end will be hosted using Node.Js on my local computer via Ngrok (will eventually be moved to Azure).

### Database
Player data (exp, level, etc.) will be stored in a SQL database. The schema of the database is currently:

Players (PRIMARY KEY psid, IGN, level, exp, max_health, damage, defense)

## Gameplay

For now, we will start with basic game play. The player will have an in-game name, level/exp, max health, damage, and defense. The player will be able to gain exp and level up by fighting.

### Level System (Max level 100 for now)
Each level’s EXP thresh-hold will be determined by 4*level^2

| Level | EXP Required |
|-------|--------------|
| 1     | 4            |
| 2     | 16           |
| 3     | 36           |
| ...   | ...          |
| 99    | 39204        |
| 100   | 40000        |

### Mobs
Mob EXP decreases/increases by 10% for each level below/above the player. Beginner mobs should be relatively easier with difficulty increasing as the player reaches higher levels.

### Bosses
To move on to the next zone, players must defeat the zone boss. The zone boss will be slightly more difficult than mobs in the next zone.

## Command List

(Commands are case insensitive)

Help \<Commands\>

- Sends an overview of the game, how to play, and how to get started
- If the player provides a command, the bot tells them how to use the command with usage examples.

Register \<username\>

- Registers the player using their desired playername

Commands

- Sends the player a list of commands they can use

Show \<Args\>

- Shows player information (stats, quests, all, etc.)
- If no args are provided, returns a list of possible args.

Fight \<Zone\> \<# of times\> (Only zones are available 1-20 for now)

- Fights monsters at a chosen zone
  - Zone difficulty determined by zone*(1~5). I.e. zone 10 = enemy levels 45-50 
- To speed up leveling, players may choose the number of times they will fight in a zone
  - Each 'instance' is played using the player's max hp.
    - If the player dies during the instance, they will not gain any EXP and will lose a percentage of their current EXP
      - The player may not decrease in levels if their current exp would drop below zero after a penalty
- After each fight instance, the player will receive a summary report on how their character performed



