const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql =
  `insert into scale (value) values 
  (1.6),
  (0.625),
  (0.390625)
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
