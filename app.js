const express = require('express');
const app = express();

const session = require("express-session");

const config = require('./lib/config');
const port = config.PORT;
const host = config.HOST;
const isProduction = (process.NODE_ENV == "production");
const PgPersistence = require('./lib/pg-persistence');
const catchError = require("./lib/catch-error");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.set("trust proxy", 1);
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000,
    path: "/",
    secure: isProduction
  },
  secret: config.SECRET,
  name: "jelk-cookie",
  resave: false,
  saveUninitialized: true
}));


app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
})

app.use((req, res, next) => {
  // console.log("info", req.session);
  res.locals.username = req.session.username;
  res.locals.signedIn = req.session.signedIn;
  next();
});

const requiresAuthentication = (req, res, next) => {
  if (!res.locals.signedIn) {
    res.redirect(302, '/users/signin');
  } else {
    next();
  }
};

app.get("/users/signin", (req, res) => {
  // res.locals.store.testQuery1();
  res.render("login");
});

app.post("/users/signin", 
  catchError(async (req, res, next) => {
    let username = req.body.username.trim();
    let password = req.body.password;
    let authenticated = await res.locals.store.authenticate(username, password);
    if (!authenticated) {
      console.log("Invalid credentials");
      res.render("login");
    } else {
      let session = req.session;
      session.username = username;
      session.signedIn = true;

      // console.log(req.session);
      res.redirect("/home");
    }
}));

app.post("/users/signout", (req, res) => {
  delete req.session.username;
  delete req.session.signedin;
  res.redirect("/users/signin");
});

app.post("/portfolios/:portfolioId/items/:itemId/destroy",
  requiresAuthentication,
  catchError(async (req, res, next) => {
    let { portfolioId, itemId } = req.params;
    let deleted = await res.locals.store.deleteItem(+portfolioId, +itemId);
    if (!deleted) throw new Error("Not found.");

    // req.flash("success", "The todo has been deleted.");
    res.redirect(`/home`);
  }
));

app.post("/portfolios/:portfolioId/items",
  requiresAuthentication,
  catchError(async (req, res, next) => {
    let itemTitle = req.body.itemTitle;
    let portfolioId = req.params.portfolioId;
    let created = await res.locals.store.createItem(+portfolioId, itemTitle);
    if (!created) throw new Error("Not found.");

    // req.flash("success", "The todo has been created.");
    res.redirect(`/home`);
  }
));

app.get("/", (req, res) => {
  // res.send("Hello world!");
  res.redirect("/home");
  
});

app.get("/home", 
  requiresAuthentication,
  catchError(async (req, res) =>{
    let items = await res.locals.store.loadItems(1);
    res.render("home", {items});
    // res.redirect("/");
}));

app.get("/stocks", (req, res) => {
  let stocks = ["$ANVS", "$GME"];
  res.render("home", {stocks});
})

app.use((err, req, res, next) => {
  console.log(err);
  res.status(404).send(err.message);
});

app.listen(port, host, () => console.log(`App listening on Port: ${PORT}`));