const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render('toppage');
});

/* /pokemon */

app.get("/pokemon", (req, res) => {
    //console.log(req.query.pop);    // ①
    let mes = "";
  
    if( req.query.order ) order = " order by pokemon." + req.query.order;
    else order = " order by pokemon.number";
    if( req.query.desc ) desc = " desc";  
    else desc = "";
    if( req.query.top ) top = " limit " + req.query.top * 2;
    else top = "";
    let search = "";
    if( req.query.type ){
      search = " where pokemon.id in("
      + "select distinct(pokemon.id)"
      + " from pokemon,pt inner join type" 
      + " on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )"
      + " where type.number = " + req.query.type
      + ")";
    } 
    if(req.query.p_name){
      if(req.query.type) search = " and"
      else search = " where"    
      search = search + " pokemon.name like '" + req.query.p_name + "%'";
      mes = mes + "「" + req.query.p_name + "」";
    } 
    
    let p_data;
    let sql = "select pokemon.id,pokemon.number, pokemon.name,type.name as type"
      + " from pokemon,pt inner join type" 
      + " on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )" 
      + search + order + desc + top + ";";

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

    let type;
    let newsql = "select number,name from type;"
    db.serialize( () => {
        db.all(newsql, (error, types) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            if(req.query.type){
              for(let row of types){
                if(req.query.type == row.number) mes = mes + row.name + "タイプ";
              }
            }         
            type = types;
        })
    })
    let ssql = "select name from pokemon;"
    db.serialize( () => {
        db.all(ssql, (error, poke) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('pokemon', {data:p_data,types:type,poke:poke,mes:mes});
        })
    })
})

app.get("/pokemon/detail", (req, res) => {
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
      + " on ( (type.number = compatibility.type) and (compatibility.s_id = scale.id) )" 
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
            res.render('pokemon_detail', {data:p_data,types:types});
        })
    })
})

app.get("/pokemon/detail/:id", (req, res) => {
    console.log(req.params.id);    // ①
    let p_data;  
    let sql = "select pokemon.id,pokemon.number, pokemon.name,pokemon.attack,pokemon.defence,pokemon.hp,type.name as type" 
      + " from pokemon,pt inner join type on" 
      + " ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )" 
      + " where pokemon.id = " + req.params.id 
      + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            a = data[0].attack + 15;
            d = data[0].defence + 15; 
            h = data[0].hp + 15; 
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
            c = parseInt((a * Math.sqrt(d) * Math.sqrt(h) * data[0].cpm ** 2) / 10);
            res.render('pokemon_detail', {data:p_data,cp:c});
        })
    })
})

app.get("/pokemon/edit/:id", (req, res) => {
    //console.log(req.query.pop);    // ①
    let p_data;
    let sql = "select pokemon.id,pokemon.number,pokemon.name, pokemon.attack,pokemon.defence,pokemon.hp,type.number as typenum, type.name as type" 
      + " from pokemon,pt inner join type" 
      + " on ( (pokemon.id=pt.p_id) and (type.number=pt.t_num) )" 
      + " where pokemon.id = " + req.params.id 
      + ";";
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
            res.render('pokemon_edit', {data:p_data,types:types});
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
            res.render('pokemon_insert', {data:data});
        })
    })
})

app.post("/pokemon/insert", (req, res) => {
    //console.log(req.body.pop);    // ①
    if(req.body.area) area = req.body.area;
    else area = "";
  
    let sqls = [
      "insert into pokemon (number,name,attack,defence,hp)" 
      + " values (" 
      + req.body.number + ",'" + req.body.name + area + "'," 
      + req.body.attack + "," + req.body.defence + "," + req.body.hp 
      + ");",
      "insert into pt (p_id,t_num)" 
      + " values (" 
      + "(select id from pokemon where rowid = last_insert_rowid())," + req.body.type1 
      + ");",     
      "insert into pt (p_id,t_num) values (" 
      + "(select p_id from pt where rowid = last_insert_rowid())," + req.body.type2 
      + ");"
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
    res.render('show', {mes:"追加しました"});
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

app.post("/pokemon/update/status", (req, res) => {
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
    let t_data;
    let mes = "";
    let m = "";
    if( req.query.order ) order = " order by type." + req.query.order;
    else order = " order by type.number";
    if( req.query.desc ) desc = " desc";  
    else desc = "";
  
    if( req.query.type ){
      if(req.query.sc){
        if(req.query.sc == "1") {
          n = "";
          se = " type";
          wh = " opponent";
          m = m + "にこうかばつぐん"
        } else if(req.query.sc == "2") {
          n = " not";
          se = " type";
          wh = " opponent";
          m = m + "にこうかいまひとつ"
        }else if(req.query.sc == "3") {
          n = "";
          se = " opponent";
          wh = " type";
          m = m + "が弱点"
        }else {
          n = " not";
          se = " opponent";
          wh = " type";
          m = m + "に耐性がある"
        }
        search = " where type.number in("  
          + "select" + se + " from compatibility" 
          + " where " + wh + " = " + req.query.type + " and" + n + " s_id = 1)";   
      }
      else search = " where type.number = " + req.query.type;
   }
    else search = "";
 
    let sql = "select * from type" 
      + search + order + desc + ";";
    //console.log(sql);
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            t_data = data;
        })
    })
  
    let newsql = "select * from type order by number;";
    db.serialize( () => {
        db.all(newsql, (error, types) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(types);    // ③
            for(let row of types){
                if(req.query.type == row.number){
                  mes = mes + "「" + row.name + "タイプ」" + m;
                } 
            }
            res.render('type', {data:t_data,mes:mes,types:types});
        })
    })
})

app.get("/type/detail/:number", (req, res) => {
    //console.log(req.query.pop);    // ①
    let at_data;
    let df_data
    
    let sql = "select type.name,scale.value" 
      + " from type,compatibility inner join scale" 
      + " on ((type.number = compatibility.type) and (compatibility.s_id = scale.id))" 
      + " where compatibility.opponent = " + req.params.number 
      +" order by scale.value desc"
      + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            df_data = data;
        })
    })

    let newsql = "select type.name,scale.value" 
      + " from type,compatibility inner join scale" 
      + " on ((type.number = compatibility.opponent) and (compatibility.s_id = scale.id))"
      + " where compatibility.type = " + req.params.number 
      +" order by scale.value desc"
      + ";";
  
    db.serialize( () => {
        db.all(newsql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            at_data = data;
        })
    })

    let n_sql = "select name from type"
      + " where number = " + req.params.number + ";";

    db.serialize( () => {
        db.all(n_sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('type_detail', {at_data:at_data,df_data:df_data,type:data[0].name});
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
            res.render('type_edit', {data:data});
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
            res.render('type_insert', {data:data});
        })
    })
})

app.post("/type/insert", (req, res) => {
    //console.log(req.body.pop);    // ①
    let number = req.body.number + ",";
    let name = "'" + req.body.name + "'";
    let sql = "insert into type (number,name)" 
      + " values (" + req.body.number + "," + "'" + req.body.name + "');";
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

app.post("/type/delete", (req, res) => {
    //console.log(req.body.pop);    // ①
    let sqls = [
      "delete from type where id = " + req.body.id + ";",
      "delete from pt where t_num = " + req.body.number + ";"
    ]
    //console.log(sqls);    // ②
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
            res.render('cp_calc', {data:data});
        })
    })
})

app.post("/calc/cp", (req, res) => {
    //console.log(req.body.attack);
    if(req.body.name) name = req.body.name;
    else return res.render('show', {mes:"ポケモンを選択してください"});

    let mes = "攻撃：" + req.body.attack 
      + "　防御：" + req.body.defence
      + "　HP：" + req.body.hp; 

    let id;
    let a;
    let d;
    let h; 
    let sql = "select id,attack,defence,hp from pokemon" 
      + " where name like '" + name + "%' limit 1;";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                return res.render('show', {mes:"エラーです"});
            }
            id = data[0].id;
            a = data[0].attack　+ parseInt(req.body.attack);
            d = data[0].defence + parseInt(req.body.defence); 
            h = data[0].hp + parseInt(req.body.hp); 
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
              c = parseInt((a * Math.sqrt(d) * Math.sqrt(h) * cp.cpm ** 2) / 10);
              scp = parseInt(((a * d * parseInt(h) * cp.cpm **3) ** 0.66666666666) /10);
              pl = cp.pl;
              st[0] = a * cp.cpm;
              st[1] = d * cp.cpm;
              st[2] = parseInt(h * cp.cpm);
              if(c <= 1500){
                su= [pl,c,scp,st[0],st[1],st[2]];
              } else if(c <= 2500){
                hy= [pl,c,scp,st[0],st[1],st[2]];
              }          
            }
            if(hy.length == 0) hy = [pl,c,scp,st[0],st[1],st[2]];
            ms = [pl,c,scp,st[0],st[1],st[2]];
            res.render('cp_result', {id:id,name:name,su:su,hy:hy,ms:ms,mes:mes});
        })
    })
})

/* */

app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
