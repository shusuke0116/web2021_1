const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql =
  `insert into pokemon ("number","name","attack","defence","hp","type1_id","type2_id") values ("618","マッギョ（ガラル）","144","171","240","9","17");`


  db.serialize( () => {
	  db.run( sql, (error, row) => {
	  	if(error) {
	  		console.log('Error: ', error );
		  	return;
		  }
		  console.log( "データを追加しました" );
  	});
  });

