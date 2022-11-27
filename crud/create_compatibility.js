const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let schema = `
create table compatibility(
  id integer primary key,
  type integer NOT NULL,
  opponent integer NOT NULL,
  s_id integer NOT NULL
);
`

db.serialize( () => {
	db.run( schema, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		console.log( "テーブルを作成しました" );
	});
});