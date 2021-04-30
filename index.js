const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

/*let config = {
    user: "root",
    database: "spotify_team_database",
    password: "databaseconissuers"
}

if ("around-the-world-musically:us-central1:instanceone" && process.env.NODE_ENV === 'production') {
   config.socketPath = `/cloudsql/around-the-world-musically:us-central1:instanceone`;
}
/*new comment*/
let db = mysql.createConnection(config);

var db = mysql.createConnection({
    host:"35.226.161.246",
    user: "root",
    password:"databaseconissuers",
    database: "spotify_team_database",
    port: "3306",
})


db.connect(function(err){
    if(!err) {
        console.log("Success");
    } else {
        console.log("Error trying to connect");    
    }
});


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


app.get("/api/getsrutiquery", (require, response) => {
    const sqlSelect = "SELECT Energy, count(SongAttributes.Song_id) as num_songs_with_high_energy_and_valance FROM SongAttributes  WHERE SongAttributes.Song_id IN (SELECT SongAttributes.Song_id FROM SongAttributes WHERE SongAttributes.Dancibility > 0.7) GROUP BY Energy ORDER BY Energy DESC LIMIT 15;";
    db.query(sqlSelect, (err, result) => {
        if (err) console.log("Error query dont work"); 
        response.send(result);
    });
});

app.post("/api/insert", (require, response) => {
    const genreName = require.body.genreName;

    const sqlInsert = "INSERT INTO `Genre` (`Genre_name`) VALUES (?)";
    db.query(sqlInsert, [genreName], (err, result) => {
        console.log(err);
    })
});


app.post("/api/findSongNameSrutiQuery", (require, response) => {
    const songName = require.body.songName;
    const sqlFind = "SELECT Song.Song_name, temp.Valance, SongAttributes.Valance  FROM (SELECT Valance,Song_name,Energy from SongAttributes Where Song_name = ?) as temp, Song,SongAttributes,Artist  Where Song.Song_name = SongAttributes.Song_name AND Song.Song_name <> temp.Song_name AND (temp.Valance = SongAttributes.Valance) AND SongAttributes.Energy NOT IN (SELECT ENERGY FROM Energy_Found_Table WHERE hype_level > 3) AND Artist.Artist_name NOT IN (SELECT ARTIST_NAME FROM Arist_Found_Table WHERE artist_level > 3) AND SongAttributes.Instrumentalness NOT IN (SELECT INSTRUMENTALNESS FROM Instrumentalness_Found_Table WHERE instrumentalness_level > 2) LIMIT 10";
    db.query(sqlFind, songName, (err, result) => {
        response.send(result);
    })
});


app.post("/api/findSongNameRishinQuery", (require, response) => {
    const songName = require.body.songName;
    const sqlFind = "SELECT Song.Song_name, Song.Song_id, (1 - (ABS(temp.Valance - SongAttributes.Valance) * .5 + ABS(temp.Energy - SongAttributes.Energy) *.3 + ABS(temp.Dancibility - SongAttributes.Dancibility)*.2)) AS compatabilityScore FROM (SELECT Valance, Energy, Dancibility, Song_name From SongAttributes Where Song_name = ?) as temp,Song,SongAttributes Where Song.Song_name = SongAttributes.Song_name AND Song.Song_name <> temp.Song_name AND ((1 - (ABS(temp.Valance - SongAttributes.Valance) * .5 + ABS(temp.Energy - SongAttributes.Energy) *.3 + ABS(temp.Dancibility - SongAttributes.Dancibility)*.2)) > .9) Order By compatabilityScore DESC LIMIT 10";
    db.query(sqlFind, songName, (err, result) => {
        response.send(result);
    })
});


app.delete("/api/delete/:genreName", (require, response) => {
    const genreName = require.params.genreName;

    const sqlDelete = "DELETE FROM `Genre` WHERE `Genre_name`= ?";
    db.query(sqlDelete, genreName, (err, result) => {
        if (err) console.log("could not delete");
        console.log(error);
    })
});

app.put("/api/update/", (require, response) => {
    const genreName = require.body.genreName;
    const newGenre = require.body.newGenre;
    console.log(newGenre);
    const sqlUpdate = "UPDATE `Genre` SET `Genre_name` = ? WHERE `Genre_name`= ?";
    db.query(sqlUpdate, [newGenre,genreName ], (err, result) => {
        if (err) 
        console.log(error);
    })
});

app.get("/api/srutiadvancedquery", (require, response) => {
    const sqlSelect = "SELECT Song.Song_name, temp.Valance, SongAttributes.Valance  FROM (SELECT Valance,Song_name,Energy from SongAttributes Where Song_name = ?) as temp, Song,SongAttributes,Artist  Where Song.Song_name = SongAttributes.Song_name AND Song.Song_name <> temp.Song_name AND (temp.Valance = SongAttributes.Valance) AND SongAttributes.Energy NOT IN (SELECT ENERGY FROM Energy_Found_Table WHERE hype_level > 3) AND Artist.Artist_name NOT IN (SELECT ARTIST_NAME FROM Arist_Found_Table WHERE artist_level > 3) AND SongAttributes.Instrumentalness NOT IN (SELECT INSTRUMENTALNESS FROM Instrumentalness_Found_Table WHERE instrumentalness_level > 2) LIMIT 10";;
    db.query(sqlSelect, (err, result) => {
        if (err) console.log("Error query dont work"); 
        response.send(result);
    });
});

 app.listen(3005, () => {
    console.log("running on port 3005");
})