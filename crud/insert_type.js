const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sqls =[
  `insert into type (name) values ("ノーマル");`,
  `insert into type (name) values ("ほのお");`,
  `insert into type (name) values ("みず");`,
  `insert into type (name) values ("でんき");`,
  `insert into type (name) values ("くさ");`,
  `insert into type (name) values ("こおり");`,
  `insert into type (name) values ("かくとう");`,
  `insert into type (name) values ("どく");`,
  `insert into type (name) values ("じめん");`,
  `insert into type (name) values ("ひこう");`,
  `insert into type (name) values ("エスパー");`,
  `insert into type (name) values ("むし");`,
  `insert into type (name) values ("いわ");`,
  `insert into type (name) values ("ゴースト");`,
  `insert into type (name) values ("ドラゴン");`,
  `insert into type (name) values ("あく");`,
  `insert into type (name) values ("はがね");`,
  `insert into type (name) values ("フェアリー");`
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
