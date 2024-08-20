const path = require('path')
const mongoose = require('mongoose')
const notes = require(path.join(__dirname, '..', 'config', 'notes'))



exports.dashboard = async (req, res) => {
    try {
      let perPage = 12 
      let page = parseInt(req.query.page) || 1 //current page 

      const userNotes = await notes.aggregate([
        {$match: {user:req.user.id} },
        {$sort:{createdAt:-1}},
        {$skip : (perPage * page) - perPage},
        {$limit : perPage}
      ])

      const count = await notes.countDocuments({user:req.user.id})

      const locals = {
        title: "Dashboard",
        description: "A full stack notes app dashboard"
      };
      res.render('dashboard', {
        username : req.user.username,
        notes : userNotes,
        locals,
        current:page,
        totalPages : Math.ceil(count/perPage),
        layout: 'layouts/dashboard' // Specify the dashboard layout
      });
    } catch (error) {
      console.error(error)
      res.status(500).send("error loading dashboard");
    }
  };

