const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@elastic/elasticsearch");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3001; // Adjust the port as needed
const { agent } = require("./openAi");
const {agent2} = require("./chat")
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const nodemailer = require('nodemailer');

const esClient = new Client({ node: "http://localhost:9200" });
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'hotmail', etc.
  auth: {
    user: 'karan.savaliya24@gmail.com',
    pass: 'ltyj nzwy olim fqvv',
  },
});
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});
app.post("/api/createposts", async (req, res) => {
  try {
    const { title, topic, author, shortdescription, description } = req.body;
    // Elasticsearch index operation
    const { body } = await esClient.index({
      index: "createp", // Change this to your desired index name
      body: {
        title,
        topic,
        author,
        shortdescription,
        description,
      },
    });

    console.log("Post title:", title);
    console.log("Post topic:", topic);
    console.log("Post author:", author);
    console.log("Post shortdesc:", shortdescription);
    console.log("Post desc:", description);

    res.status(200).json({
      success: true,
      message: "Post created successfully",
      data: body,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
});

app.get("/api/createposts", async (req, res) => {
  try {
    const body = await esClient.search({
      index: "createp",
      body: {
        query: {
          match_all: {},
        },
      },
    });

    res.json(body.hits.hits);
  } catch (error) {
    console.error("Error occurred while fetching createposts:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching createposts" });
  }
});

app.delete("/api/deletepost", async (req, res) => {
  const { postId } = req.body;

  try {
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Delete the post from Elasticsearch index
    const response = await esClient.delete({
      index: "createp",
      id: postId,
    });

    // Check if the deletion was successful
    if (response.result === "deleted") {
      console.log("deleted");
      return res.status(200).json({ message: "Post deleted successfully" });
    } else {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const { query, topic } = req.body; // Extract the search query and topic from request body

    if (!query && !topic) {
      return res
        .status(400)
        .json({ error: "Search query or topic is required" });
    }

    const body = {
      query: {
        bool: {
          must: [],
        },
      },
    };

    // Add multi-match query for the search query
    if (query) {
      body.query.bool.must.push({
        multi_match: {
          query: query,
          fields: [
            "title",
            "topic",
            "author",
            "shortdescription",
            "description",
          ],
        },
      });
    }

    // Add filter for the topic
    if (topic) {
      body.query.bool.must.push({
        match: {
          topic: topic,
        },
      });
    }

    const searchResult = await esClient.search({
      index: "createp",
      body: body,
    });

    res.json(searchResult.hits.hits);
  } catch (error) {
    console.error("Error occurred while searching:", error);
    res.status(500).json({ error: "An error occurred while searching" });
  }
});

//add replies to the post
app.post("/api/reply", async (req, res) => {
  try {
    const { postId, replyContent, user } = req.body;

    if (!postId || !replyContent) {
      return res
        .status(400)
        .json({ error: "Post ID and reply content are required" });
    }

    const response = await esClient.update({
      index: "createp",
      id: postId,
      body: {
        script: {
          source:
            "if (ctx._source.containsKey('replies')) { ctx._source.replies.add(params.reply) } else { ctx._source.replies = [params.reply] }",
          lang: "painless",
          params: {
            reply: {
              content: replyContent,
              user: user, // For simplicity, hardcoding the user as "Guest"
            },
          },
        },
      },
    });

    res.json(response);
  } catch (error) {
    console.error("Error occurred while adding reply:", error);
    res.status(500).json({ error: "An error occurred while adding reply" });
  }
});

app.post("/openapi", async (req, res) => {
  try {
    // Extract userInput from the request body
    const { userInput } = req.body;

    // Check if userInput is provided and is a string
    if (!userInput || typeof userInput !== "string") {
      throw new Error("Invalid user input");
    }

    // Call agent function to process user input
    const response = await agent(userInput+"give reply for this description in one sentece");

    // Send the response back to the client
    res.json({ response });
    console.log(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
});
app.post('/chat', async (req, res) => {
  try {
    const { userInput } = req.body;
    if (!userInput || typeof userInput !== "string") {
      throw new Error("Invalid user input");
    }
    const response = await agent2(userInput+"my location is illinois chicago and weather is about 8 degrees");
    console.log("Res",response);
    res.json({ response }); // Send the response back to the client
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/subscribe', async (req, res) => {
  const { topic, email, userId } = req.body;

  try {
    // Save subscription details in Elasticsearch
    const response = await esClient.index({
      index: 'subscribe',
      body: {
        topic,
        email,
        userId,
      },
    });
console.log(response);
    res.json({ success: true, data:response });

  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ success: false, error: 'Error saving subscription' });
  }
})

app.post("/api/subscribe", async (req, res) => {
  try {
    const { topic, email, userId } = req.body;
    // Elasticsearch index operation
    const { body } = await esClient.index({
      index: "ss", // Change this to your desired index name
      body: {
        topic,
        email,
        userId,
      },
    });
    console.log(" topic:", topic);
    console.log(" email:", email);
    console.log(" userID:", userId);

    res.status(200).json({
      success: true,
      message: "subscribed",
      data: body,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
});
app.post('/api/send-emails', async (req, res) => {
  try {
    const { topic } = req.body;

    // Ensure topic is provided in the request body
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    // Elasticsearch query to search for subscribed users
    const body = {
      query: {
        bool: {
          must: [],
        },
      },
    };

    // Add filter for the topic
    body.query.bool.must.push({
      match: {
        topic: topic,
      },
    });

    // Execute Elasticsearch search query
    const searchResult = await esClient.search({
      index: "ss",
      body: body,
    });

    // Check if searchResponse contains hits
    if (searchResult && searchResult.hits && searchResult.hits.hits.length > 0) {
      // Extract subscribed users' email addresses
      const subscribers = searchResult.hits.hits.map(hit => hit._source.email);

      // Send emails to subscribed users
      for (const email of subscribers) {
        try {
          // Send email using Nodemailer
          await transporter.sendMail({
            from: 'karan.savaliya24@gmail.com',
            to: email,
            subject: `New post under topic ${topic}`,
            text: 'There is a new post available under ${topic}',
          });
          console.log('Email sent to:', email);
        } catch (error) {
          console.error('Error sending email to', email, ':', error);
        }
      }

      return res.json({ success: true, body});

    } else {
      console.error('No subscribers found for the specified topic:', topic);
      return res.json({ success: false, message: 'No subscribers found for the specified topic' });
    }
  } catch (error) {
    console.error('Error sending emails:', error);
    return res.status(500).json({ success: false, error: 'Error sending emails' });
  }
});

app.get("/api/subscribe", async (req, res) => {
  try {
    const body = await esClient.search({
      index: "ss",
      body: {
        query: {
          match_all: {},
        },
      },
    });

    res.json(body.hits.hits);
  } catch (error) {
    console.error("Error occurred while fetching createposts:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching createposts" });
  }
});


app.listen(port, () => {
  console.log(`Elasticsearch server is running on port ${port}`);
});
