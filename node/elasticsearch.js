const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@elastic/elasticsearch");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3001; // Adjust the port as needed
const { agent } = require("./openAi");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const esClient = new Client({ node: "http://localhost:9200" });

app.post("/api/createposts", async (req, res) => {
  try {
    const { title, topic, author, shortdescription, description } = req.body;

    // Elasticsearch index operation
    const { body } = await esClient.index({
      index: "cp", // Change this to your desired index name
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
      index: "cp",
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
      index: "cp",
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
      index: "cp",
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
      index: "cp",
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




app.listen(port, () => {
  console.log(`Elasticsearch server is running on port ${port}`);
});
