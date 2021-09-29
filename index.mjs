import { Client, Intents } from "discord.js";
import "dotenv";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  console.log(`Logged in to ${client.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
