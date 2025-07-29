import { OpenAI } from "openai";
import dotenv from "dotenv";
import readLineSync from "readline-sync";
import chalk from "chalk";
import { exit } from "process";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: {
    "api-key": process.env.AZURE_OPENAI_API_KEY,
  },
});

const main = async () => {
    const messages = [
        { role: "system", content: "You are a helpful assistant." },
    ];
    console.log(chalk.green.bold("Welcome to the AI assistant! Type 'exit' to end the conversation."));
    try {
        while (true) {
            const userInput = readLineSync.question(chalk.yellow.bold("You: "));
            messages.push({ role: "user", content: userInput });
            console.log(chalk.blue.bold("Thinking..."));
            const response = await openai.chat.completions.create({
                messages: messages,
            });
            console.log(chalk.green.bold("Assistant: ") + response.choices[0].message.content);
            messages.push({ role: "assistant", content: response.choices[0].message.content });
            if (userInput.toLowerCase() === "exit") {
                exit(0);
            }
        }
    } catch (error) {
        console.error("Error: " + error);
    }
}
main();
