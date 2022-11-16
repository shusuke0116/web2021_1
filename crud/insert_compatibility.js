const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sqls =[

  `insert into compatibility (type,opponent,scale_id) values (7,1,2);`,
  `insert into compatibility (type,opponent,scale_id) values (14,1,3);`,
  `insert into compatibility (type,opponent,scale_id) values (2,2,2);`,
  `insert into compatibility (type,opponent,scale_id) values (3,2,1);`,
  `insert into compatibility (type,opponent,scale_id) values (5,2,2);`,
  `insert into compatibility (type,opponent,scale_id) values (6,2,2);`,
  `insert into compatibility (type,opponent,scale_id) values (9,2,1);`,
  `insert into compatibility (type,opponent,scale_id) values (12,2,2);`,
  `insert into compatibility (type,opponent,scale_id) values (13,2,1);`,
  `insert into compatibility (type,opponent,scale_id) values (17,2,2);`,
  `insert into compatibility (type,opponent,scale_id) values (18,2,2);`,
 
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