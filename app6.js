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

/* /pokemon */

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
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,type.name as type from pokemon,pt inner join type on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )" + order + desc + top + ";";

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
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.name as type from pokemon,pt inner join type on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )";
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
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.name as type from pokemon,pt inner join type on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) ) where pokemon.id = " + req.params.id + ";";
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

    let data;
  
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.number as typenum, type.name as type from pokemon,pt inner join type on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) ) where pokemon.id = " + req.params.id + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, p_data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            data = p_data;
        })
    })
  　let newsql = "select number,name from type;"
    db.serialize( () => {
        db.all(newsql, (error, types) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('edit_pokemon', {data:data,types:types});
        })
    })
})

app.get("/pokemon/page/insert", (req, res) => {
    let sql = "select number,name from type;";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('insert_pokemon', {data:data});
        })
    })
})

app.post("/pokemon/insert", (req, res) => {
    //console.log(req.body.pop);    // ①
    if(req.body.area) area = req.body.area;
    else area = "";
  
    let sqls = [
      "insert into pokemon (number,name,attack,defence,hp) values (" + req.body.number + ",'" + req.body.name + area + "'," + req.body.attack + "," + req.body.defence + "," + req.body.hp + ");",
      "insert into pt (p_id,t_num) values ((select id from pokemon where rowid = last_insert_rowid())," + req.body.type1 + ");"
    ]
  
    if(req.body.type2) {
      sqls.push("insert into pt (p_id,t_num) values ((select p_id from pt where rowid = last_insert_rowid())," + req.body.type2 + ");");
    }
    //console.log(sqls);
    for(let sql of sqls){
      db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }    
        })
      })
    }
    res.render('show', {mes:"変更しました"});
})

app.post("/pokemon/delete", (req, res) => {
    //console.log(req.body.pop);    // ①
    let sqls = [
      "delete from pokemon where id = " + req.body.id + ";",
      "delete from pt where p_id = " + req.body.id + ";"
    ]
    //console.log(sqls);    // ②
    for(let sql of sqls){
      db.serialize( () => {
          db.all(sql, (error, data) => {
              if( error ) {
                  return res.render('show', {mes:"エラーです"});
              }
          })
      })
    }
    res.render('show', {mes:"削除しました"});
})

app.post("/pokemon/update", (req, res) => {
    //console.log(req.body.pop);    // ①
    if(req.body.up == 'name') t = "'";
    else t = "";
    let sql = "update pokemon set " + req.body.up + " = " + t + req.body.data + t + " where id = " + req.body.id + ";";
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

app.post("/pokemon/update/type", (req, res) => {
    //console.log(req.body.pop);    // ①
    if(req.body.newtype){
      if(req.body.typeup){
        sql = "update pt set t_num = " + req.body.newtype + " where p_id = " + req.body.id + " and t_num = " + req.body.typeup + ";";
      } else{
        sql = "insert into pt (p_id,t_num) values (" + req.body.id + "," + req.body.newtype + ");";
      }
    } else {
      if(req.body.typeup){
        sql = "delete from pt where p_id = " + req.body.id + " and t_num = " + req.body.typeup + ";";
      } else {
       return res.render('show', {mes:"変更するタイプを選択してください。"});
      }
      
    }
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

/* /type */

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

app.get("/type/page/insert", (req, res) => {
    let sql = "select number,name from type;";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('insert_type', {data:data});
        })
    })
})

app.post("/type/delete", (req, res) => {
    //console.log(req.body.pop);    // ①
    let sqls = [
      "delete from type where id = " + req.body.id + ";",
      "delete from pt where t_num = " + req.body.number + ";"
    ]
    console.log(sqls);    // ②
    for(let sql of sqls){
      db.serialize( () => {
          db.all(sql, (error, data) => {
              if( error ) {
                  res.render('show', {mes:"エラーです"});
              }
          })
      })
    }
    res.render('show', {mes:"削除しました"});
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
