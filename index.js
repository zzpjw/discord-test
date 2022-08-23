const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "./.env") });
// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const today = new Date();
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});
db.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected White DB !!");
  }
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (msg) => {
  if (msg.content.startsWith("%")) {
    if (msg.content.slice(1, 2) === "A") {
      // %A%123
      db.query(
        `
          SELECT mintingDate, coinCount
          FROM nfts
          WHERE (tierType = 1 OR tierType = 2) 
            AND edition = ${msg.content.slice(3)}
        `,
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            if (res) {
              let dayCount =
                (today.getTime() - res[0].mintingDate) / (1000 * 60 * 60 * 24);
              let OLEA = dayCount * 10 - res[0].coinCount;
              msg.reply(`${OLEA}`);
            }
          }
        }
      );
    }
    if (msg.content.slice(1, 2) === "B") {
      // %B%123
      db.query(
        `
          SELECT mintingDate, coinCount
          FROM nfts
          WHERE (tierType = 3 OR tierType = 4 OR tierType = 5) 
              AND edition = ${msg.content.slice(3)}
        `,
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            if (res) {
              let dayCount =
                (today.getTime() - res[0].mintingDate) / (1000 * 60 * 60 * 24);
              let OLEA = dayCount * 6 - res[0].coinCount;
              msg.reply(`${OLEA}`);
            }
          }
        }
      );
    }
  }
  //   const { commandName } = interaction;
  //   if (commandName === "야") {
  //     await interaction.reply("호!");
  //   }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
