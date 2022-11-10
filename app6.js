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
  res.render('toppage', {mes:message});
});

app.get("/pokemon", (req, res) => {
    //console.log(req.query.pop);    // ①
    if( req.query.order ) order = " order by p.name";
    else order = " order by p.number";
    if( req.query.desc ) desc = " desc";  
    else desc = "";
    if( req.query.top ) top = " limit " + req.query.top;
    else top = "";
    if( req.query.type ) type = " where type2 = '" + req.query.type + "' or type1 = '" + req.query.type + "'";  
    else type = "";
    
    let sql = "select p.id,p.number,p.name,type.name as type1,p.type2 from (select pokemon.id,pokemon.number,pokemon.name,pokemon.type1_id,type.name as type2 from pokemon left join type on pokemon.type2_id = type.id) as p inner join type on p.type1_id = type.id" + type　+ order + desc + top + ";";
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

app.get("/pokemon/status", (req, res) => {
    //console.log(req.query.pop);    // ①
    
    let sql = "select p.id,p.number,p.name,p.attack,p.defence,p.hp,type.name as type1,p.type2 from (select pokemon.id,pokemon.number,pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,pokemon.type1_id,type.name as type2 from pokemon left join type on pokemon.type2_id = type.id) as p inner join type on p.type1_id = type.id;";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('status', {data:data});
        })
    })
})

app.get("/pokemon/status/:id", (req, res) => {
    //console.log(req.query.pop);    // ①
    
    let sql = "select p.id,p.number,p.name,p.attack,p.defence,p.hp,type.name as type1,p.type2 from (select pokemon.id,pokemon.number,pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,pokemon.type1_id,type.name as type2 from pokemon left join type on pokemon.type2_id = type.id where pokemon.id = " + req.params.id + ") as p inner join type on p.type1_id = type.id;";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('status', {data:data});
        })
    })
})

app.get("/pokemon/edit/:id", (req, res) => {
    //console.log(req.query.pop);    // ①
    
    let sql = "select p.id,p.number,p.name,p.attack,p.defence,p.hp,type.name as type1,p.type2 from (select pokemon.id,pokemon.number,pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,pokemon.type1_id,type.name as type2 from pokemon left join type on pokemon.type2_id = type.id where pokemon.id = " + req.params.id + ") as p inner join type on p.type1_id = type.id;";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('edit_pokemon', {data:data});
        })
    })
})

app.get("/pokemon/update", (req, res) => {
    //console.log(req.query.pop);    // ①
    let sql = "update pokemon set " + req.query.up + " = " + req.query.data + " where id = " + req.query.id + ";";
    console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('show', {mes:"変更しました"});
        })
    })
})

app.get("/pokemon/delete", (req, res) => {
    //console.log(req.query.pop);    // ①
    let sql = "delete from pokemon where id = " + req.query.id + ";";
    console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('show', {mes:"変更しました"});
        })
    })
})

app.get("/type", (req, res) => {
    //console.log(req.query.pop);    // ①
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = "select number,name from type" + desc + ";";
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

app.post("/pokemon/insert", (req, res) => {
    //console.log(req.body.pop);    // ①
    let number = req.body.number + ",";
    let name = "'" + req.body.name + "',";
    let attack = req.body.attack + ",";
    let defence = req.body.defence + ",";
    let hp = req.body.hp + ",";
    let type1 = "(select id from type where name='" + req.body.type1 + "')";
    if(req.body.type2) type2 = ",(select id from type where name='" + req.body.type2 + "')";
    else type2 = "";
    let sql = "insert into pokemon (number,name,attack,defence,hp,type1_id,type2_id) values (" + number + name + attack + defence + hp + type1 + type2 + ");";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('show', {mes:"追加しました"});
        })
    })
})


app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
