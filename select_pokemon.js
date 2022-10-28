const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql = `
select * from pokemon;
`

db.serialize( () => {
	db.all( sql, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		for( let data of row ) {
			console.log(data.number + ' : ' + data.name + ' : ' + data.attack + ' : ' + data.defence + ' : ' + data.hp + ' : ' + data.type1_id + ' : ' + data.type2_id );
		}
	});
});
