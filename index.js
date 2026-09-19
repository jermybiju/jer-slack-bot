require('dotenv').config();


let { App } = require('@slack/bolt');
let axios = require('axios');

let app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});


app.command('/jer-ping', async ({ ack, respond }) => {
  await ack(); // ack cheythillel slack error tharum
  let start = Date.now();
  let latency = Date.now() - start;
  await respond({ text: "Pong! Latency: " + latency + "ms" });
});


app.command('/jer-help', async ({ ack, respond }) => {
  await ack();
  let msg = "Available Commands:\n";
  msg += "/jer-ping - Check bot latency\n";
  msg += "/jer-help - Show this help message\n";
  msg += "/jer-catfact - Get a random cat fact\n";
  msg += "/jer-roll - Roll a dice\n";
  msg += "/jer-coinflip - Flip a coin\n";
  msg += "/jer-joke - Get a random joke";
  await respond({ text: msg });
});


app.command('/jer-catfact', async ({ ack, respond }) => {
  await ack();
  try {
    let res = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact: ${res.data.fact}` });
  } catch (err) {
    console.log("api failed:", err);
    await respond({ text: "Failed to fetch a cat fact." });
  }
});


app.command('/jer-roll', async ({ ack, respond }) => {
  await ack();
  let num = Math.floor(Math.random() * 6) + 1;
  await respond({ text: `You rolled a ${num}!` });
});


app.command('/jer-coinflip', async ({ ack, respond }) => {
  await ack();
  let result = Math.random() < 0.5 ? 'Heads' : 'Tails';
  await respond({ text: `It's ${result}!` });
});


app.command('/jer-joke', async ({ ack, respond }) => {
  await ack();
  try {
    let response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    await respond({
      text: response.data.setup + "\n\n" + response.data.punchline
    });
  } catch (error) {
    await respond({ text: 'Failed to fetch a joke.' });
  }
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();


const express = require('express');
const web = express();
web.get('/', (req, res) => res.send('Bot is alive!'));
web.listen(process.env.PORT || 3000, () => console.log('web server running'));