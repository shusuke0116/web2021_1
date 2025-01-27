const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql =

  `insert into type (number,name) values 
  (0,"タイプなし"),
  (1,"ノーマル"),
  (2,"ほのお"),
  (3,"みず"),
  (4,"でんき"),
  (5,"くさ"),
  (6,"こおり"),
  (7,"かくとう"),
  (8,"どく"),
  (9,"じめん"),
  (10,"ひこう"),
  (11,"エスパー"),
  (12,"むし"),
  (13,"いわ"),
  (14,"ゴースト"),
  (15,"ドラゴン"),
  (16,"あく"),
  (17,"はがね"),
  (18,"フェアリー")
  ;`;

db.serialize( () => {
	db.run( sql, (error, row) => {
	  if(error) {
	  	console.log('Error: ', error );
		  return;
		}
		console.log( "データを追加しました" );
  });
});  

