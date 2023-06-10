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
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
// get API1
app.get("/players/", async (request, response) => {
  const getPlayerData = `SELECT * FROM cricket_team ORDER BY playerId;`;
  const playersList = await db.all(getPlayerData);
  const convertDbObjectToResponse = (listObj) => {
    return {
      playerId: listObj.player_id,
      jerseyNumber: listObj.jersey_number,
      role: listObj.role,
    };
  };
  response.send(
    playersList.map((eachPlayer) => convertDbObjectToResponse(eachPlayer))
  );
});

// post API2
app.post("/players/", async (request, response) => {
  const dataobj = request.body;
  const { playerName, jerseyNumber, role } = dataobj;
  const updatedData = `INSERT INTO cricket_team (playerName, jerseyNumber, role)
    VALUES
    (
        ${playerName}, ${jerseyName}, ${role});`;
  await db.run(updatedData);
  response.send("Player Added to Team");
});

//get API3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatedData = `SELECT
      *
    FROM
      cricket_team
    WHERE
      playerId = ${playerId};`;
  const specifiedData = await db.get(updatedData);
  const convertDbObjectToResponse = (listObj) => {
    return {
      playerId: listObj.player_id,
      jerseyNumber: listObj.jersey_number,
      role: listObj.role,
    };
  };
  response.send(
    playersList.map((eachPlayer) => convertDbObjectToResponse(eachPlayer))
  );
});

// update API4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const dataobj = request.body;
  const { playerName, jerseyNumber, role } = dataobj;
  const updatedData = `UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId}`;
  await db.run(updatedData);
  response.send("Player Details Updated");
});

//DELETE API5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatedData = `DELETE FROM cricket_team WHERE playerId = ${playerId};`;
  await db.run(updatedData);
  response.send("Player Removed");
});

module.exports = app;
