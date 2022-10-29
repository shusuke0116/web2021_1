const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql = `
select p.number,p.name,type.name as type1,p.type2 from (select pokemon.number,pokemon.name,pokemon.type1_id,type.name as type2 from pokemon left join type on pokemon.type2_id = type.id) as p inner join type on p.type1_id = type.id;
`

db.serialize( () => {
	db.all( sql, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		for( let data of row ) {
      if(data.type2 != null){
        console.log('No.' + data.number + ' : ' + data.name + ' : ' + data.type1 + '・' + data.type2);
      } else{
        console.log('No.' + data.number + ' : ' + data.name + ' : ' + data.type1);
      }
		}
	});
});
