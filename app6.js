const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const message = "top page";
  res.render('show', {mes:message});
});

app.get("/pokemon", (req, res) => {
    //console.log(req.query.pop);    // ①
    if( req.query.order ) order = " order by p.name";
    else order = " order by p.number";
    if( req.query.desc ) desc = " desc";  
    else desc = "";
    if( req.query.pop ) pop = " limit " + req.query.pop;
    else pop = "";
    if( req.query.type ) type = " where type2 = '" + req.query.type + "' or type1 = '" + req.query.type + "'";  
    else type = "";
    
    let sql = "select p.id,p.number,p.name,type.name as type1,p.type2 from (select pokemon.id,pokemon.number,pokemon.name,pokemon.type1_id,type.name as type2 from pokemon left join type on pokemon.type2_id = type.id) as p inner join type on p.type1_id = type.id" + type　+ order + desc + pop + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('pokemon', {data:data});
        })
    })
})

app.get("/type", (req, res) => {
    //console.log(req.query.pop);    // ①
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = "select * from type" + desc + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('type', {data:data});
        })
    })
})




app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
