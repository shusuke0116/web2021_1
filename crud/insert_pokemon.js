const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql =
  `insert into pokemon (number,name,attack,defence,hp) values
  (184,"マリルリ",112,152,225),
  (365,"トドゼルガ",182,176,242),
  (302,"ヤミラミ",141,136,137),
  (260,"ラグラージ",208,175,225),
  (308,"チャーレム",121,152,155),
  (618,"マッギョ（ガラル）",144,171,240),
  (709,"オーロット",201,154,198),
  (031,"ニドクイン",180,173,207),
  (379,"レジスチル",143,285,190),
  (334,"チルタリス",141,201,181)
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
