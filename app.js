const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
// get API
app.get("/players/", async (request, response) => {
  const getPlayerData = `SELECT * FROM cricket_team;`;
  const playersList = await db.all(getPlayerData);
  response.send(playersList);
});

// add API
app.get("/players/", async (request, response) => {
  const getPlayerData = `SELECT * FROM cricket_team;`;
  const playersList = await db.all(getPlayerData);
  response.send(playersList);
});

// add API
app.post("/players/", async (request, response) => {
  const dataobj = request.body;
  const { playerName, jerseyNumber, role } = dataobj;
  const updatedData = `INSERT INTO cricket_team (playerName, jerseyNumber, role)
    VALUES
    (
        ${playerName}, ${jerseyName}, ${role});`;
  await db.all(updatedData);
  response.send("Player Add Team");
});

//get API 2
app.post("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatedData = `SELECT * FROM cricket_team WHERE playerId = ${playerId};`;
  const specifiedData = await db.get(updatedData);
  response.send(specifiedData);
});

//update API
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const dataobj = request.body;
  const { playerName, jerseyNumber, role } = dataobj;
  const updatedData = `UPDATE cricket_team SET playerName = ${playerName},
  jerseyNumber = ${jerseyNumber},
  role = ${role} WHERE playerId = ${playerId}`;
  const specifiedData = await db.get(updatedData);
  response.send("Player Details Updated");
});
//delete API
app.post("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatedData = `DELETE FROM cricket_team WHERE playerId = ${playerId};`;
  const specifiedData = await db.get(updatedData);
  response.send("Player Removed");
});

module.exports = app;
