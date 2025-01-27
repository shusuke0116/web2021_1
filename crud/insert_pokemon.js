const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql =
  `insert into pokemon (number,name,attack,defence,hp) values
  (618,"マッギョ（ガラル）",144,171,240),
  (302,"ヤミラミ",141,136,137),
  (709,"オーロット",201,154,198),
  (260,"ラグラージ",208,175,225),
  (031,"ニドクイン",180,173,207),
  (308,"チャーレム",121,152,155),
  (184,"マリルリ",112,152,225),
  (334,"チルタリス",141,201,181),
  (171,"ランターン",146,137,268),
  (862,"タチフサグマ",180,194,212),
  (108,"ベロリンガ",108,137,207),
  (038,"キュウコン（アローラ）",170,193,177),
  (227,"エアームド",148,226,163),
  (411,"トリデプス",94,286,155),
  (197,"ブラッキー",126,240,216),
  (003,"フシギバナ",198,189,190),
  (164,"ヨルノズク",145,156,225),
  (630,"バルジーナ",129,205,242),
  (663,"ファイアロー",176,155,186),
  (365,"トドゼルガ",182,176,242)
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
