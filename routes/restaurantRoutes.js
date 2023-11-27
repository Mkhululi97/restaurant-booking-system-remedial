export default function routes(restaurant) {
  async function home(req, res) {
    res.render("index", { tables: await restaurant.getTables() });
  }
  async function bookTable(req, res) {
    let result = await restaurant.bookTable({
      tableName: req.body.tableId,
      username: req.body.username,
      phoneNumber: req.body.phone_number,
      seats: req.body.booking_size,
    });

    //take this function to route that checks for bookedtables
    await restaurant.isTableBooked("Table three");
    result === "Table Booked"
      ? req.flash("successText", result)
      : req.flash("errorText", result);

    res.redirect("/");
  }
  async function bookings(req, res) {
    let tables = await restaurant.getBookedTables();
    res.render("bookings", { bookedTables: tables });
  }
  async function getTableForUser(req, res) {
    let user = req.body.inputsearch;
    let tableForUser = await restaurant.getBookedTablesForUser(user);
    //shows flash messages for users that haven't booked any table(s) yet
    tableForUser.length < 1 && user !== ""
      ? req.flash("errorText", `No table(s) booked for ${user}`)
      : "";
    //shows flash messages for users that booked table(s)
    tableForUser.length > 0 && user !== ""
      ? req.flash("successText", `Table(s) ${user} booked`)
      : "";
    //shows flash messages when the input field is empty
    user === "" ? req.flash("errorText", "Please enter username") : "";
    res.render("bookings", { bookedTables: tableForUser });
  }
  async function cancelTableBooking(req, res) {
    let tables = await restaurant.getBookedTables();
    let tableName = req.body.table_name;
    console.log(tableName);
    // await restaurant.cancelTableBooking(table);

    res.redirect("/bookings");
  }
  return {
    home,
    bookTable,
    bookings,
    getTableForUser,
    cancelTableBooking,
  };
}
