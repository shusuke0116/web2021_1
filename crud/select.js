const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql = `
select pokemon.number,pokemon.name as p_name,t.name as t_name from (select pt.p_id,type.name from pt inner join type on pt.t_num = type.number) as t inner join pokemon on t.p_id = pokemon.id;
`

db.serialize( () => {
	db.all( sql, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		for( let data of row ) {
        console.log('No.' + data.number + ' : ' + data.p_name + ' : ' + data.t_name);
      }
	});
});
