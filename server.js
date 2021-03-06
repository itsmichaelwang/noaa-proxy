const express = require('express');
const request = require('request');
const parser = require('xml2json');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
})

app.get('/station/:id', (req, res) => {
  let url = `http://www.ndbc.noaa.gov/data/latest_obs/${req.params.id}.rss`;
  request(url, { json: false }, (err, response, body) => {
    if (err) {
      console.log(err);
      res.sendStatus(err);
    }

    try {
      var jsonBody = parser.toJson(body, {
        'object': true
      });
      jsonBody = jsonBody['rss'];
      res.json(jsonBody);
    } catch (e) {
      res.sendStatus(404);
    }
  });
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
})
