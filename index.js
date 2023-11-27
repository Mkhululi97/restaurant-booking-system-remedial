import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import db from "./database.js";
import routes from "./routes/restaurantRoutes.js";
import restaurant from "./services/restaurant.js";

/*INITIALIZE SERVICES MODULE */
const Restaurant = restaurant(db);
/*INITIALIZE ROUTES MODULE */
const restaurantRoute = routes(Restaurant);

const app = express();

app.use(express.static("public"));
app.use(
  session({
    secret: "mkhululicoder",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const handlebarSetup = exphbs.engine({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
});

app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");

app.get("/", restaurantRoute.home);
app.post("/book", restaurantRoute.bookTable);

app.get("/bookings", restaurantRoute.bookings);
app.post("/bookings", restaurantRoute.getTableForUser);
app.post("/cancel", restaurantRoute.cancelTableBooking);
var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
  console.log("🚀  server listening on:", portNumber);
});
