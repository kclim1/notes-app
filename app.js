require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', './layouts/main'); // Ensure the layout path is correct
app.set('view engine', 'ejs');


//routes
app.use('/',require('./server/routes/index'))


app.get('*',(req,res)=>{
    res.status(404).render("404 page not found.")
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
