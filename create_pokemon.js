const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let schema = `
create table pokemon(
  id integer primary key,
  number integer ,
  name text NOT NULL,
  attack integer NOT NULL,
  defence integer NOT NULL,
  hp integer NOT NULL,
  type1_id integer NOT NULL,
  type2_id integer
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
