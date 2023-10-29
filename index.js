const express = require("express");
const sqlite = require("sqlite3").verbose();
const app = express();

let db = new sqlite.Database("db/menetrend.db", (err) => {
    if (err)
        return console.log(err.message);
    console.log("Connected to webserver database!");
});
let taxiDb = new sqlite.Database("db/taxi.db", (err) => {
    if (err)
        return console.log(err.message);
    console.log("Connected to webserver database (Taxi DB)!");
});
let telepulesekDb = new sqlite.Database("db/telepulesek.db", (err) => {
    if (err)
        return console.log(err.message);
    console.log("Connected to webserver database (Telepulsek DB)!");
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
app.get("/admin-panel", function (req, res) {
    res.render("../html/admin-panel.ejs", {
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
app.get('/ordertaxi/:taxiid/:name/:address/:phone', function (req, res) {
    taxiDb.run("INSERT INTO taxi_orders (`taxiId`, `name`, `address`, `phone`) VALUES (?, ?, ?, ?)",
        [req.params.taxiid, req.params.name, req.params.address, req.params.phone], function (err) {
            if (err) {
                return console.log(err);
            }
        });
    res.end(`Sikeres taxi rendeles.`);
});
app.get('/addtaxi/:car/:lpn/:driver/', function (req, res) {
    taxiDb.run("INSERT INTO taxi (`car`, `lpn`, `driver`) VALUES (?, ?, ?)",
        [req.params.car, req.params.lpn, req.params.driver], function (err) {
            if (err) {
                return console.log(err);
            }
        });
    res.end(`Taxi sikeres rigzitese`);
});
app.get('/taxiorders', function (req, res) {
    taxiDb.all("SELECT * FROM taxi_orders", function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows);
    });
});
app.get('/getAllTaxi', function (req, res) {
    taxiDb.all("SELECT * FROM taxi", function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows);
    });
});

// a főoldalos kerséshez kell
app.get('/telepuleskereses/:data', function (req, res) {
    telepulesekDb.all(`SELECT * FROM telepulesek WHERE name like '%${req.params.data}%' or zip like '%${req.params.data}%' limit 10`, function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows);
    });
});
