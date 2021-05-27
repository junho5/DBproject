const maria = require('mysql');
const conn = maria.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    port: 3306,
    user:'bc969c6beabaa9',
    password:'65029b1b',
    database:'heroku_d57af3a00f950b4',
    multipleStatements: true
});
function handleDisconnect() {
    conn.connect(function(err) {            
      if(err) {                            
        console.log('error when connecting to db:', err);
        // setTimeout(handleDisconnect, 2000); 
      }                                   
    });                                 
                                           
    conn.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
        return handleDisconnect();                      
      } else {                                    
        // throw err;                              
      }
    });
}
  
handleDisconnect();
module.exports = conn;