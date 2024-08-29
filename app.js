const dotenv = require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
const path = require("path");
const mongooseConnect = require(path.join(__dirname, "server", "config", "db"));
const session = require("express-session");
const passport = require("passport");
const connectMongo = require("connect-mongo");
const user = require(path.join(__dirname, "server", "config", "db"));
const methodOverride = require('method-override');
const http = require('http'); 
const socketIo = require('socket.io'); 
const server = http.createServer(app); 
const io = socketIo(server); 


app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(expressLayouts);
app.set("layout", "./layouts/main"); // Ensure the layout path is correct
app.set("view engine", "ejs");

// Connect to the database
mongooseConnect(); 

// Set up session middleware before defining routes
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define routes after session and passport setup
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/index"));

io.on('connection',(socket)=>{
  console.log('A user has connected')
  console.log(socket.id)
})



socket.on('disconnect',()=>{
  console.log('A user has disconnected')
})

server.listen(port, () => {
  console.log(`Socket.io server running on port ${port}`);
});



// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });
