const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sqls =[

  `insert into scale (value) values (1.6);`,
  `insert into scale (value) values (0.625);`,
  `insert into scale (value) values (0.390625);`
 
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