const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql =
  `insert into pt (p_id,t_num) values 
  (1,9),(1,17),
  (2,16),(2,14),
  (3,14),(3,5),
  (4,3),(4,9),
  (5,8),(5,9),
  (6,7),(6,11),
  (7,3),(7,18),
  (8,15),(8,10),
  (9,3),(9,4),
  (10,16),(10,1),
  (11,1),(11,0),
  (12,6),(12,18),
  (13,17),(13,10),
  (14,13),(14,17),
  (15,16),(15,0),
  (16,5),(16,8),
  (17,1),(17,10),
  (18,16),(18,10),
  (19,2),(19,10),
  (20,6),(20,3)
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
