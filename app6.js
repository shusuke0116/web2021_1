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
    if( req.query.order ) order = " order by pokemon.name";
    else order = " order by pokemon.number";
    if( req.query.desc ) desc = " desc";  
    else desc = "";
    if( req.query.top ) top = " limit " + req.query.top;
    else top = "";
    if( req.query.type ) type = " where type.name = '" + req.query.type + "'";  
    else type = "";
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,type.name as type from pokemon,pt inner join type on ( (pokemon.id=pt.p_id) and (type.id=pt.t_num) )" + order + desc + top + ";";

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
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.name as type from pokemon,pt inner join type on ( (pokemon.id=pt.p_id) and (type.id=pt.t_num) )";
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
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.name as type from pokemon,pt inner join type on ( (pokemon.id=pt.p_id) and (type.id=pt.t_num) ) where pokemon.id = " + req.params.id + ";";
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
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.number as typenum, type.name as type from pokemon,pt inner join type on ( (pokemon.id=pt.p_id) and (type.id=pt.t_num) ) where pokemon.id = " + req.params.id + ";";
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
    if(req.query.up == 'name') t = "'";
    else t = "";
    let sql = "update pokemon set " + req.query.up + " = " + t + req.query.data + t + " where id = " + req.query.id + ";";
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

app.get("/pokemon/update/type", (req, res) => {
    //console.log(req.query.pop);    // ①
    let type = "(select number from type where type.name = '" + req.query.type + "')";
    let sql = "update pt set t_num = " + type + "where p_id = " + req.query.id + " and t_num = " + req.query.typeup + ";";
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

app.post("/pokemon/insert/type", (req, res) => {
    //console.log(req.query.pop);    // ①
    let type = "(select number from type where type.name = '" + req.body.type + "')";
    let sql = "insert into pt (p_id,t_num) values (" + req.body.id + "," + type + ");";
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
            res.render('show', {mes:"削除しました"});
        })
    })
})

app.get("/type", (req, res) => {
    //console.log(req.query.pop);    // ①
    let order = "order by number"
    let sql = "select * from type " + order + ";";
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

app.get("/type/edit/:id", (req, res) => {
    //console.log(req.query.pop);    // ①
    
    let sql = "select * from type where id = " + req.params.id + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('edit_type', {data:data});
        })
    })
})

app.get("/type/delete", (req, res) => {
    //console.log(req.query.pop);    // ①
    let sql = "delete from type where id = " + req.query.id + ";";
    console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('show', {mes:"削除しました"});
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

app.post("/type/insert", (req, res) => {
    //console.log(req.body.pop);    // ①
    let number = req.body.number + ",";
    let name = "'" + req.body.name + "'";
    let sql = "insert into type (number,name) values (" + number + name + ");";
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
