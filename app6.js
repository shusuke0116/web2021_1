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

    let p_data;
  
    if( req.query.order ) order = " order by pokemon.name";
    else order = " order by pokemon.number";
    if( req.query.desc ) desc = " desc";  
    else desc = "";
    if( req.query.top ) top = " limit " + parseInt(req.query.top) * 2;
    else top = "";
    if( req.query.type ) type = " where pokemon.id in("
      + "select distinct(pokemon.id)"
      + " from pokemon,pt inner join type" 
      + " on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )"
      + " where type.number = " + req.query.type
      + ")"
    else type = "";
    if( req.query.p_name ) p_name = " where pokemon.name = '" + req.query.p_name + "'";
    else p_name = "";
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,type.name as type"
      + " from pokemon,pt inner join type" 
      + " on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )" 
      + type + p_name + order + desc + top + ";";

    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            p_data = data;
        })
    })

    let newsql = "select number,name from type;"
    db.serialize( () => {
        db.all(newsql, (error, types) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('pokemon', {data:p_data,types:types});
        })
    })
})

app.get("/pokemon/status", (req, res) => {
    //console.log(req.query.pop);    // ①
    let p_data;
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.name as type" 
      + " from pokemon,pt inner join type" 
      + " on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            p_data = data;
        })
    })

    let newsql = "select type.name,scale.value" 
      + " from type,compatibility inner join scale" 
      + " on ( (type.number = compatibility.type) and (compatibility.scale_id = scale.id) )" 
      + " where compatibility.opponent = " + req.params.number 
      + " or compatibility.opponent = " + req.params.number
      + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(newsql, (error, types) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('status', {data:p_data,types:types});
        })
    })
})

app.get("/pokemon/status/:id", (req, res) => {
    //console.log(req.query.pop);    // ①
    let p_data;
    
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.name as type" 
      + " from pokemon,pt inner join type on" 
      + " ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )" 
      + " where pokemon.id = " + req.params.id + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            a = parseFloat(data[0].attack) + 15;
            d = parseFloat(data[0].defence) + 15; 
            h = parseFloat(data[0].hp) + 15; 
            p_data = data;
        })
    })

    let c;
    let newsql = "select cpm from cp order by pl desc limit 1;";
    
    db.serialize( () => {
        db.all(newsql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            c = parseInt((a * Math.sqrt(d) * Math.sqrt(h) * parseFloat(data[0].cpm) ** 2) / 10);
            res.render('status', {data:p_data,cp:c});
        })
    })
})

app.get("/pokemon/edit/:id", (req, res) => {
    //console.log(req.query.pop);    // ①

    let p_data;
  
    let sql = "select pokemon.id,pokemon.number,pokemon.name, pokemon.attack,pokemon.defence,pokemon.hp,type.number as typenum, type.name as type" 
      + " from pokemon,pt inner join type" 
      + " on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )" 
      + " where pokemon.id = " + req.params.id + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            p_data = data;
        })
    })
  　let newsql = "select number,name from type;"
    db.serialize( () => {
        db.all(newsql, (error, types) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('edit_pokemon', {data:p_data,types:types});
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
      "insert into pokemon (number,name,attack,defence,hp)" 
      + " values (" + req.body.number + ",'" + req.body.name + area + "'," + req.body.attack + "," + req.body.defence + "," + req.body.hp + ");",
      "insert into pt (p_id,t_num)" 
      + " values ((select id from pokemon where rowid = last_insert_rowid())," + req.body.type1 + ");",
      "insert into pt (p_id,t_num) values ((select p_id from pt where rowid = last_insert_rowid())," + req.body.type2 + ");"
    ]
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
    let sql = "update pokemon set " + req.body.up + " = " + t + req.body.data + t 
      + " where id = " + req.body.id + ";";
    //console.log(sql);    // ②
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
    sql = "update pt set t_num = " + req.body.newtype 
          + " where p_id = " + req.body.id + " and t_num = " + req.body.typeup + ";";
    
    //console.log(sql);    // ②
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

app.get("/type/status/:number", (req, res) => {
    //console.log(req.query.pop);    // ①
    
    let sql = "select type.name,scale.value" 
      + " from type,compatibility inner join scale" 
      + " on ( (type.number = compatibility.type) and (compatibility.scale_id = scale.id) )" 
      + " where compatibility.opponent = " + req.params.number + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('detail_type', {data:data});
        })
    })
})

app.get("/type/edit/:number", (req, res) => {
    //console.log(req.query.pop);    // ①
    
    let sql = "select * from type" 
      + " where number = " + req.params.number + ";";
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
    let sql = "insert into type (number,name)" 
      + " values (" + number + name + ");";
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

/* calc */

app.get("/calc/page/cp", (req, res) => {
   
    let sql = "select name from pokemon;";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('calc_cp', {data:data});
        })
    })
})

app.post("/calc/cp", (req, res) => {
    //console.log(req.body.attack);
    if(req.body.name) name = req.body.name;
    else return res.render('show', {mes:"ポケモンを選択してください"});
    
    let a;
    let d;
    let h;
   
    let sql = "select attack,defence,hp from pokemon" 
      + " where name = '" + name + "';";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            a = parseFloat(data[0].attack) + parseFloat(req.body.attack);
            d = parseFloat(data[0].defence) + parseFloat(req.body.defence); 
            h = parseFloat(data[0].hp) + parseFloat(req.body.hp); 
        })
    })

    let su = [];
    let hy = [];
    let ma = [];
    let st = [3];
    let c;
    let scp;
    let pl;

    let newsql = "select pl,cpm from cp;";

    db.serialize( () => {
        db.all(newsql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            for(let cp of data){
              c = parseInt((a * Math.sqrt(d) * Math.sqrt(h) * parseFloat(cp.cpm) ** 2) / 10);
              scp = parseInt(((a * d * parseInt(h) * parseFloat(cp.cpm)**3) **0.66666666666) /10);
              pl = parseFloat(cp.pl);
              st[0] = (a * parseFloat(cp.cpm));
              st[1] = (d * parseFloat(cp.cpm));
              st[2] = parseInt((h * parseFloat(cp.cpm)));
              if(c <= 1500){
                su= [pl,c,scp,st[0],st[1],st[2]];
              } else if(c <= 2500){
                hy= [pl,c,scp,st[0],st[1],st[2]];
              }          
            }
            if(hy.length == 0) hy = [pl,c,scp,st[0],st[1],st[2]];
            ms = [pl,c,scp,st[0],st[1],st[2]];
            res.render('result_cp', {su:su,hy:hy,ms:ms});
        })
    })
})

/* */

app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
