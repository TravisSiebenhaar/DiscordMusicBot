import { Client } from "discord.js";
import DisTube from "distube";
import dotenv from "dotenv";
import config from "./config.js";

dotenv.config();

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});
const distube = new DisTube.default(client);

client.on("ready", () => {
  console.log(`Logged in to ${client.user.tag}`);

  distube.on("error", (channel, error) => {
    console.error(error);
    channel.send("Got to be in a voice channel dumb dumb...");
  });

  // distube.on("empty", (message) =>
  //   message.channel.send("Channel is empty. Leaving the channel")
  // );
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  if (message.channel.name !== "🎵-song_request") {
    return message.channel.send(
      `This channel ${message.author} does not accept song requests you chode...`
    );
  }

  const args = message.content.slice(config.prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "ping") message.channel.send("pong");
  if (command === "play") distube.play(message, args.join(" "));
  if (command === "shuffle") distube.shuffle(message);
  if (command === "pause") distube.pause(message);
  if (command === "resume") distube.resume(message);

  if (command === "skip") {
    const queue = distube.getQueue(message);
    if (!queue || queue.songs.length < 2) {
      message.channel.send("No additional song to skip to.");
      return;
    }
    distube.skip(message);
  }

  if (command === "stop") {
    distube.stop(message);
    message.channel.send("Stopped the queue!");
  }

  if (command == "autoplay") {
    let mode = distube.toggleAutoplay(message);
    message.channel.send(
      "Set autoplay mode to `" + (mode ? "On" : "Off") + "`"
    );
  }

  if (command == "jump")
    distube
      .jump(message, parseInt(args[0]))
      .catch((err) => message.channel.send("Invalid song number."));

  if (command == "queue") {
    let queue = distube.getQueue(message);
    message.channel.send(
      "Current queue:\n" +
        queue.songs
          .map(
            (song, id) =>
              `**${id + 1}**. [${song.name}](${song.url}) - \`${
                song.formattedDuration
              }\``
          )
          .join("\n")
    );
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
