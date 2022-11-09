const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sqls =[
  `insert into type (number,name) values (1,"ノーマル");`,
  `insert into type (number,name) values (2,"ほのお");`,
  `insert into type (number,name) values (3,"みず");`,
  `insert into type (number,name) values (4,"でんき");`,
  `insert into type (number,name) values (5,"くさ");`,
  `insert into type (number,name) values (6,"こおり");`,
  `insert into type (number,name) values (7,"かくとう");`,
  `insert into type (number,name) values (8,"どく");`,
  `insert into type (number,name) values (9,"じめん");`,
  `insert into type (number,name) values (10,"ひこう");`,
  `insert into type (number,name) values (11,"エスパー");`,
  `insert into type (number,name) values (12,"むし");`,
  `insert into type (number,name) values (13,"いわ");`,
  `insert into type (number,name) values (14,"ゴースト");`,
  `insert into type (number,name) values (15,"ドラゴン");`,
  `insert into type (number,name) values (16,"あく");`,
  `insert into type (number,name) values (17,"はがね");`,
  `insert into type (number,name) values (18,"フェアリー");`
]
  

for(let sql of sqls){
  db.serialize( () => {
	  db.run( sql, (error, row) => {
	  	if(error) {
	  		console.log('Error: ', error );
		  	return;
		  }
		  console.log( "データを追加しました" );
  	});
  });  
}
