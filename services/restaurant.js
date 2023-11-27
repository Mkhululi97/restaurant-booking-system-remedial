const restaurant = (db) => {
  async function getTables() {
    // get all the available tables
    return await db.manyOrNone(
      "SELECT * FROM bookings.table_booking ORDER BY id LIMIT 6"
    );
  }
  function capitalizeFirstLetter(username) {
    username = username.toLowerCase().split("");
    username = username[0].toUpperCase() + username.splice(1).join("");
    return username;
  }
  async function bookTable(tableData) {
    //get variables from object
    let { tableName, username, phoneNumber, seats } = tableData;
    //capitalize first letter of username
    if (username !== undefined && username !== "") {
      username = capitalizeFirstLetter(username);
    }
    //get id for the provided table name
    let validTable = await db.any(
      "SELECT id FROM bookings.table_booking WHERE table_name=$1",
      [tableName]
    );
    //check the id for the provided table name
    if (validTable.length > 0) {
      phoneNumber = phoneNumber.replace(/\s/g, ""); // Remove white spaces
      let num_of_people = await db.any(
        "SELECT capacity FROM bookings.table_booking WHERE table_name = $1",
        [tableName]
      );

      let countTables = await db.manyOrNone(
        "SELECT COUNT (table_name) FROM bookings.table_booking WHERE table_name=$1",
        [tableName]
      );

      num_of_people = num_of_people[0]["capacity"];

      if (countTables[0].count < 2 && Number(seats) <= num_of_people) {
        await db.none(
          "INSERT INTO bookings.table_booking(table_name, capacity, booked, username, number_of_people, contact_number) VALUES ($1,$2,$3,$4,$5,CAST($6 AS integer))",
          [tableName, num_of_people, true, username, seats, phoneNumber]
        );
        await db.none(
          "UPDATE bookings.table_booking SET booked=$1 WHERE table_name=$2",
          [true, tableName]
        );
        return "Table Booked";
      }
      //can't book table when guests more than table seats
      if (num_of_people !== null && seats > num_of_people) {
        return "capacity greater than the table seats";
      }
    }
    if (username === undefined || username === "") {
      return "Please enter a username";
    }
    if (phoneNumber === undefined || phoneNumber === "") {
      return "Please enter a contact number";
    }

    if (validTable.length < 1) {
      return "Invalid table name provided";
    }
  }

  async function getBookedTables() {
    // get all the booked tables
    let tables = await db.any(
      "SELECT table_name, capacity, number_of_people, username, contact_number FROM bookings.table_booking WHERE id > 6"
    );
    return tables;
  }

  async function isTableBooked(tableName) {
    let res = await db.any(
      "SELECT booked FROM bookings.table_booking WHERE table_name=$1",
      [tableName]
    );
    return res[0].booked;
    // get booked table by name
  }

  async function cancelTableBooking(tableName) {
    //cancel a table by name

    //delete record with matching table name
    await db.none(
      "DELETE FROM bookings.table_booking WHERE id > 6 AND table_name = $1",
      [tableName]
    );
    //update booked variable to false, that has the matching table name
    await db.none(
      "UPDATE bookings.table_booking SET booked=false WHERE table_name=$1",
      [tableName]
    );
  }

  async function getBookedTablesForUser(username) {
    // get user table booking
    username !== "" ? (username = capitalizeFirstLetter(username)) : "";
    const result = await db.any(
      "SELECT table_name, username, number_of_people, contact_number FROM bookings.table_booking WHERE username=$1 ORDER BY id",
      [username]
    );
    return result;
  }

  return {
    capitalizeFirstLetter,
    getTables,
    bookTable,
    getBookedTables,
    isTableBooked,
    cancelTableBooking,
    getBookedTablesForUser,
  };
};

export default restaurant;
