const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sqls =[
  `insert into pokemon ("number","name","attack","defence","hp","type1_id","type2_id") values ("618","マッギョ（ガラル）","144","171","240","9","17");`,
  `insert into pokemon ("number","name","attack","defence","hp","type1_id","type2_id") values ("302","ヤミラミ","141","136","137","16","14");`,
  `insert into pokemon ("number","name","attack","defence","hp","type1_id","type2_id") values ("308","チャーレム","121","152","155","7","11");`,
  `insert into pokemon ("number","name","attack","defence","hp","type1_id","type2_id") values ("709","オーロット","201","154","198","14","5");`,
  `insert into pokemon ("number","name","attack","defence","hp","type1_id","type2_id") values ("031","ニドクイン","180","173","207","8","9");`,
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

