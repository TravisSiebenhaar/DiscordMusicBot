import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import * as config from "./config.js";

dotenv.config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
  console.log(`Logged in to ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (
    message.content.startsWith(config.prefix) ||
    message.author.bot ||
    message.channel.name !== "song_request"
  )
    return;

  const args = message.content.slice(config.prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  console.log("command", command);

  if (command === "ping") {
    message.channel.send("pong");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
