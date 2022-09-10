const express = require("express");
const axios = require('axios');

const PORT = process.env.PORT || "8080";
const app = express();

app.get("/", (req, res) => {
  console.log("Hello World")
  res.send("Hello World");
});

app.get("/error", (req, res) => {
  thisIsAnError
});

app.get("/hi", (req, res) => {
  axios
    .get(`http://localhost:${PORT == "8080" ? 8081 : 8080}/reply`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'message': 'hello!'
        }
      })
    .then(res2 => {
      console.log(`statusCode: ${res2.status}`);
      res.send(res2.data)
    })
    .catch(error => {
      console.error(error);
    });  
});

const APP = PORT == '8080' ? "A" : "B";

app.get("/reply", (req, res) => {
  res.send(`hello from ${APP}`);
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on ${APP} http://localhost:${PORT}`);
});

