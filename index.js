const express = require("express");
const sqlite = require("sqlite3").verbose();
const app = express();
dbplaces = null;
dbtours = null;
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
function getAllPlaces() {
    telepulesekDb.all("SELECT * FROM telepulesek", function(err, rows) {
        if (err)
            return console.error(err);
        savePlaces(rows);
    });
}
function getAllTours() {
    db.all("SELECT * FROM jaratadat;", function(err, rows) {
        if (err)
            return console.error(err);
        saveTours(rows);
    });
}
function saveTours(rows) {
    dbtours = rows;
}
function savePlaces(rows) {
    dbplaces = rows;
}
app.use(express.static('public'));
app.listen(3000, () => console.log("Server running on port 3000!"));
getAllPlaces();
getAllTours();
app.get("", function (req, res) {
    res.render("../html/index.ejs", {
        places: dbplaces,
        tours: dbtours
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


app.get('/createstop/:stopname', function (req, res) { // Megállóhely hozzáadása
    const stopname = req.params.stopname;
    db.run("INSERT INTO allomasok(allomasNev) VALUES(?);", [stopname], function (err) {
        if (err)
            return console.log(err);
    });
    res.end(`Allomas hozzaadva: ${req.params.stopname}`);
});
app.get('/addtrip/:starttime/:estimatedarrival/:stops/:stoptimes', function (req, res) { //Járat hozzáadása: Kezdőhely, starttime: 00:00 || estimatedarrival: 00:00
    const starthour = req.params.starttime.split(":")[0];
    const startminute = req.params.starttime.split(":")[1];
    const etahour = req.params.estimatedarrival.split(":")[0];
    const etaminute = req.params.estimatedarrival.split(":")[1];
    const stops = req.params.stops;
    const stoptimes = req.params.stoptimes;
    let starttime = req.params.starttime;
    let etatime = req.params.estimatedarrival;
    db.run("INSERT INTO menetrend DEFAULT VALUES;", function (err) {
        if (err)
            return console.log(err);
    });
    db.run("INSERT INTO jaratadat(jaratKezd, jaratVeg, allomasok, allomasErkezes) VALUES(?, ?, ?, ?)", [starttime, etatime, stops, stoptimes], function (err) {
        if (err)
            return console.log(err);
    });
    getAllPlaces();
    getAllTours();
    res.end(`Menetrend hozzáadva.`);
});
app.get('/trips', function(req, res) {
    db.all("SELECT * FROM jaratadat;", function(err, rows) {
        if(err) {
            return console.error(err);
        }
        res.json(rows);
    });
}); 
app.get('/updatestops/:tourid/:stops', function (req, res) { // Járathoz kapcsolódó állomások frissítése
    db.run("UPDATE jaratadat SET allomasok = ? WHERE jaratId=?", [req.params.stops, req.params.tourid], function (err) {
        if (err)
            return console.log(err);
    });
    res.end(`Allomasok frissitve a kovetkezo jarathoz: ${req.params.tourid} hozzaadva: ${req.params.stopid}`);
});
app.get('/removetrip/:tourid', function (req, res) { // Járat törlése
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
app.get('/ordertaxi/:taxiid/:name/:address/:phone', function (req, res) { // Taxi rendelése
    taxiDb.run("INSERT INTO taxi_orders (`taxiId`, `name`, `address`, `phone`) VALUES (?, ?, ?, ?)",
        [req.params.taxiid, req.params.name, req.params.address, req.params.phone], function (err) {
            if (err) {
                return console.log(err);
            }
        });
    res.end(`Sikeres taxi rendeles.`);
});
app.get('/addtaxi/:car/:lpn/:driver/', function (req, res) { // Taxi forgalombahelyezése
    taxiDb.run("INSERT INTO taxi (`car`, `lpn`, `driver`) VALUES (?, ?, ?)",
        [req.params.car, req.params.lpn, req.params.driver], function (err) {
            if (err) {
                return console.log(err);
            }
        });
    res.end(`Taxi sikeres rögzitese`);
});
app.get('/taxiorders', function (req, res) { // Taxis rendelések listázáas
    taxiDb.all("SELECT * FROM taxi_orders", function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows);
    });
});
app.get('/getAllTaxi', function (req, res) { // Forgalomban lévő Taxik listázása
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
