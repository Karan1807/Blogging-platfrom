const OpenAI = require("openai");
const readline = require("readline");
require('dotenv').config();



const openai = new OpenAI({
  apiKey:process.env.OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});


async function agent(userInput) {
  console.log("User Input:", userInput); // Log user input to check if it's null or undefined

  if (!userInput || typeof userInput !== "string") {
    throw new Error("Invalid user input");
  }

  const messages = [
    {
      role: "user",
      content: userInput,
      
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: messages,
     
  
    });

    const { finish_reason, message } = response.choices[0];

    if (finish_reason === "stop") {
      messages.push(message);
      return message.content;
    }
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }

  return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
}

async function getUserInputAndRespond() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter your query: ", async (userInput) => {
    try {
      const response = await agent(userInput);

      console.log("OpenAI Response:", response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      rl.close();
    }
  });
}

// Call the function to start the interaction
getUserInputAndRespond();


module.exports = { agent };