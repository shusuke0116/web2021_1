const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sqls =[
  `insert into pt (p_id,t_num) values (1,3);`,
  `insert into pt (p_id,t_num) values (1,18);`,
  `insert into pt (p_id,t_num) values (2,3);`,
  `insert into pt (p_id,t_num) values (2,6);`,
  `insert into pt (p_id,t_num) values (3,14);`,
  `insert into pt (p_id,t_num) values (3,16);`,
  `insert into pt (p_id,t_num) values (4,3);`,
  `insert into pt (p_id,t_num) values (4,9);`,
  `insert into pt (p_id,t_num) values (5,11);`,
  `insert into pt (p_id,t_num) values (5,7);`,
  `insert into pt (p_id,t_num) values (6,9);`,
  `insert into pt (p_id,t_num) values (6,17);`,
  `insert into pt (p_id,t_num) values (7,5);`,
  `insert into pt (p_id,t_num) values (7,14);`,
  `insert into pt (p_id,t_num) values (8,8);`,
  `insert into pt (p_id,t_num) values (8,9);`,
  `insert into pt (p_id,t_num) values (9,17);`,
  `insert into pt (p_id,t_num) values (10,15);`,
  `insert into pt (p_id,t_num) values (10,10);`
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