const connectDb = async () => {
  // get the client
  const mysql = require("mysql2/promise");
  // create the connection
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "TH_Web",
  });
  // query database
  //   const [rows, fields] = await connection.execute(
  //     "SELECT * FROM `table` WHERE `name` = ? AND `age` > ?",
  //     ["Morty", 14]
  //   );
  return connection;
};

export default connectDb;
