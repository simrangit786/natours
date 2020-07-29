const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "config.env" });

console.log(process.env);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(con.connections);
    console.log("DB connection succesfull");
  });
//.catch((err) => {
//console.log(DB connection error : ${err.message});
//});

/*const testTour = new Tourmodel({
  name: "The sea ",
  price: 447,
});
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("error !");
  });
  */

//const port = process.env.PORT;
const port = 8000;
app.listen(port, () => {
  console.log(`server is listening on ${port}.....`);
});
