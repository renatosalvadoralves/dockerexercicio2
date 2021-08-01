const express = require('express');
const app = express();
const router = express.Router();
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const config = {
  port: 9090,
  db: {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
  },
  generator: {
    dictionaries: [names]
  }
};

const mysql = require('mysql');
const connection = mysql.createConnection(config.db);

router.get('/', (req, res) => {
  try {
    const query_insert = "INSERT INTO people (name) VALUES('" + uniqueNamesGenerator(config.generator) + "')";
    connection.query(query_insert);

    const query_select = "SELECT * FROM people";
    connection.query(query_select, (err, result, fields) => {
      if (err) throw err;
      res.send("<div><h1>Full Cycle Rocks!</h1>" + formatResponse(result) + "</div>");
    });
  } catch (error) {
    throw error
  }
});

app.use('/', router);

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}!`)
})


const formatResponse = (result) =>
  "<ul>" +
  result.map(values =>
    "<li>" + values.name + "</li>"
  ).join('') +
  "</ul>";