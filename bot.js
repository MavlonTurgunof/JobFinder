const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("7757155681:AAHGY_Bq_R7PNoi3MeK0_tSCpU8Gi9HsCus", {
  polling: true,
});

let jobData = {};

// Keyboard menu options
const menuOptions = {
  reply_markup: {
    keyboard: [[{ text: "Post a Job" }, { text: "What can this bot do?" }]],
    resize_keyboard: true, // To make the keyboard smaller
    one_time_keyboard: false, // Keeps the keyboard open
  },
};

// Handle the /start command or user interactions
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to Job Finder Bot! Use the options below:",
    menuOptions // Shows the keyboard menu
  );
});

// Listener for the "Post a Job" button press
bot.onText(/Post a Job/, (msg) => {
  const chatId = msg.chat.id;

  jobData[chatId] = {};
  bot.sendMessage(chatId, "What is the job position?");

  bot.once("message", (msg) => {
    if (msg.text !== "Post a Job" && msg.text !== "What can this bot do?") {
      jobData[chatId].position = msg.text;
      bot.sendMessage(chatId, "What is the company name?");

      bot.once("message", (msg) => {
        if (msg.text !== "Post a Job" && msg.text !== "What can this bot do?") {
          jobData[chatId].company = msg.text;
          bot.sendMessage(chatId, "What is the address?");

          bot.once("message", (msg) => {
            if (
              msg.text !== "Post a Job" &&
              msg.text !== "What can this bot do?"
            ) {
              jobData[chatId].address = msg.text;
              bot.sendMessage(chatId, "What is the salary?");

              bot.once("message", (msg) => {
                if (
                  msg.text !== "Post a Job" &&
                  msg.text !== "What can this bot do?"
                ) {
                  jobData[chatId].salary = msg.text;
                  bot.sendMessage(chatId, "Please provide a job description.");

                  bot.once("message", (msg) => {
                    if (
                      msg.text !== "Post a Job" &&
                      msg.text !== "What can this bot do?"
                    ) {
                      jobData[chatId].description = msg.text;
                      // Format and display the job post
                      const postText = `
📢 **New Job Posting!**

💼 *Position*: ${jobData[chatId].position}
🏢 *Company*: ${jobData[chatId].company}
📍 *Address*: ${jobData[chatId].address}
💰 *Salary*: ${jobData[chatId].salary}
📝 *Description*: ${jobData[chatId].description}
                        `;

                      bot.sendMessage(chatId, postText);
                      const channelId = "@jobfinderSaidoff";
                      bot.sendMessage(channelId, postText);
                      bot.sendMessage(
                        chatId,
                        "Your job has been posted! Would you like to post another vacancy? Type /post to start again or /cancel to stop."
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

// Listener for the "What can this bot do?" button press
bot.onText(/What can this bot do?/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `This bot helps you to post job vacancies. You can:
    - Post a new job using the "Post a Job" button.
    - Cancel any job posting process with /cancel.
    - Restart the job posting process with /restart.`
  );
});

// Restart or cancel commands
bot.onText(/\/restart/, (msg) => {
  const chatId = msg.chat.id;
  jobData[chatId] = {};
  bot.sendMessage(
    chatId,
    "Job posting process has been restarted. Use /post to start again."
  );
});

bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;
  if (jobData[chatId]) {
    jobData[chatId] = {};
  }

  bot.sendMessage(
    chatId,
    "Job posting process has been canceled. Use /post to start again."
  );
});
