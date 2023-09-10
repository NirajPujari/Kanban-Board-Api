//Import the 'data.json' file, assuming it contains some JSON data.
const jsonData = require("./data.json");

//Import necessary libraries/modules for your Express.js application.
const express = require("express");
const cors = require("cors");
const fs = require("fs");

//Create an instance of the Express application.
const app = express();

//The port where your Express server will listen.
const PORT = process.env.PORT || 8080;

//Middleware for parsing JSON data sent in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


//Middleware for enabling Cross-Origin Resource Sharing (CORS)
//It uses custom CORS options defined in corsOptions
app.use(cors());

//This route handles a GET request to "/data" and simulates a delay of 1 second
app.get("/data", (req, res) => {
  setTimeout(() => {
    //Respond with a 200 status code and send a JSON object (jsonData) as the response.
    res.status(200).send(jsonData);
  }, 1000);
});

//HTTP POST request handler for updating data
app.post("/data/:id", (req, res) => {
  //Extract parameters from the request URL and request body
  const { id } = req.params;
  const { text, description, column } = req.body;

  //Create a new data object based on the received parameters
  const newData = {
    id,
    text,
    description,
  };

  //Check if any of the required fields are missing in the request
  if (!text || !description || !id || !column) {
    res
      .status(400)
      .send({ Message: "Title, description, column, and id are required." });
  } else {
    for (const columnData of jsonData) {
      const [columnName, tasks] = columnData;

      if (columnName === column) {
        tasks.push(newData);

        fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error("Error writing to data.json:", err);
            res.status(500).send({ Message: "Error writing to data.json" });
          } else {
            //Send a success response with the newly added data
            res.status(200).send(newData);
          }
        });
        return;
      }
    }
    //If the requested column is not found, send a 404 response
    res.status(404).send({ Message: `Column '${column}' not found.` });
  }
});

//This route handles updating a task's text and description by its ID
app.put("/data/:id", (req, res) => {
  const { id } = req.params;
  const { text, description } = req.body;

  //Check if any required data is missing (text, description, or id)
  if (!text || !description || !id) {
    //If any of them is missing, respond with a 400 Bad Request status and an error message
    res
      .status(400)
      .send({ Message: "Title, description, and id are required." });
  } else {
    for (const columnData of jsonData) {
      const [columnName, tasks] = columnData;
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (taskToUpdate) {
        taskToUpdate.text = text;
        taskToUpdate.description = description;

        fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            //If there's an error writing to the file, respond with a 500 Internal Server Error status
            console.error("Error writing to data.json:", err);
            res.status(500).send({ Message: "Error writing to data.json" });
          } else {
            //If the update is successful, respond with a 200 OK status and a success message
            res.status(200).send({ Message: "Task updated successfully." });
          }
        });
        return;
      }
    }
    //If the task with the given ID is not found in any column, respond with a 404 Not Found status
    res.status(404).send({ Message: "Task not found." });
  }
});

//Handle DELETE request to delete a task by ID
app.delete("/data/:id", (req, res) => {
  const { id } = req.params;

  //Loop through the 'jsonData' array to find and delete the task
  jsonData.some((columnData, index) => {
    const [columnName, tasks] = columnData;

    //Find the index of the task with a matching ID in the current column
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      jsonData[index][1].splice(taskIndex, 1);

      fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          //Handle any errors that occur during file writing
          console.error("Error removing from data.json:", err);
          res.status(500).send({ Message: "Item not found" });
        }
        res.status(200).send({ Message: "Item found" });
      });
      return true;
    }
    return false;
  });
});

//Start the Express.js server and listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
