const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

let sql = "select type.name"
  + ",scale.value"
 // + ",exp(sum(log(scale.value)))"
  + " from type,compatibility inner join scale" 
  + " on ( (type.number = compatibility.type) and (compatibility.scale_id = scale.id) )" 
  + " where compatibility.opponent = 12 or compatibility.opponent = 17"
  //+ " group by compatibility.type"
  + ";";


db.serialize( () => {
	db.all( sql, (error, row) => {
		if(error) {
			console.log('Error: ', error );
			return;
		}
		for( let data of row ) {
        console.log(data);
      }
	});
});
