const express = require("express");
const sqlite = require("sqlite3").verbose();
const app = express();

let db = new sqlite.Database("db/menetrend.db", (err) => {
    if (err)
        return console.log(err.message);
    console.log("Connected to webserver database!");
});
app.use(express.static('public'));
app.listen(3000, () => console.log("Server running on port 3000!"));




app.get("", function (req, res) {
    res.render("../html/index.ejs", {
    });
});
app.get("/contact", function (req, res) {
    res.render("../html/contact.ejs", {
    });
});
app.get("/gyik", function (req, res) {
    res.render("../html/gyik.ejs", {
    });
});
app.get("/taxi", function (req, res) {
    res.render("../html/taxi.ejs", {
    });
});


app.get('/createstop/:stopname', function (req, res) {
    const stopname = req.params.stopname;
    db.run("INSERT INTO allomasok(allomasNev) VALUES(?);", [stopname], function (err) {
        if (err)
            return console.log(err);
    });
    res.end(`Allomas hozzaadva: ${req.params.stopname}`);
});
app.get('/addtrip/:startplace/:starttime/:estimatedarrival', function (req, res) { //starttime: 00:00 || estimatedarrival: 00:00
    const starthour = req.params.starttime.split(":")[0];
    const startminute = req.params.starttime.split(":")[1];
    const etahour = req.params.estimatedarrival.split(":")[0];
    const etaminute = req.params.estimatedarrival.split(":")[1];
    const startplace = req.params.startplace;
    let starttime = new Date();
    starttime.setHours(parseInt(starthour) + 2);
    starttime.setMinutes(parseInt(startminute));
    let etatime = new Date();
    etatime.setHours(parseInt(etahour) + 2);
    etatime.setMinutes(parseInt(etaminute));
    db.run("INSERT INTO menetrend(jaratKezdes, jaratKezd, jaratVeg) VALUES(?, ?, ?)", [startplace, starttime.toISOString().slice(0, 19).replace('T', ' '), etatime.toISOString().slice(0, 19).replace('T', ' ')], function (err) {
        if (err)
            return console.log(err);
    });
    db.run("INSERT INTO jaratadat(allomasok) VALUES((SELECT allomasId FROM allomasok WHERE allomasNev = ?))", [startplace], function (err) {
        if (err)
            db.run("INSERT INTO allomasok(allomasNev) VALUES(?);", [startplace], function (err) {
                if (err)
                    return console.log(err);
            });
        db.run("INSERT INTO jaratadat(allomasok) VALUES((SELECT allomasId FROM allomasok WHERE allomasNev = ?))", [startplace], function (err) { });
    });
    res.end(`Menetrend hozzáadva.`);
});

app.get('/addstop/:tourid/:stopid', function (req, res) {
    db.run("UPDATE jaratadat SET allomasok = allomasok||','||? WHERE jaratId=?", [req.params.stopid, req.params.tourid], function (err) {
        if (err)
            return console.log(err);
    });
    res.end(`Allomas hozzaadva: ${req.params.stopid}`);
});
app.get('/removestop/:tourid/:stopid', function (req, res) {
    db.run("UPDATE jaratadat SET allomasok = REPLACE(allomasok, ','||?, '') WHERE jaratId=?", [req.params.stopid, req.params.tourid], function (err) {
        if (err)
            return console.log(err);
    });
    res.end(`Allomas kitorolve: ${req.params.stopid}`);
});
app.get('/removetrip/:tourid', function (req, res) {
    db.run("DELETE FROM menetrend WHERE jaratId=?", [req.params.tourid], function (err) {
        if (err)
            return console.log(err);
    });
    db.run("DELETE FROM jaratadat WHERE jaratId=?", [req.params.tourid], function (err) {
        if (err)
            return console.log(err);
    });
    res.end(`Jarat kitorolve: ${req.params.stopid}`);
});