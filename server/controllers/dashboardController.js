const path = require('path')
const mongoose = require('mongoose')
const notes = require(path.join(__dirname, '..', 'config', 'notes'))



exports.dashboard = async (req, res) => {
    try {
      let perPage = 12 
      let page = parseInt(req.query.page) || 1 //current page 

      //determine sort option 
      let sortOption = {}
      if (req.query.sort && req.query.sort.startsWith('-')){
        sortOption[req.query.sort.slice(1)] = -1 //descending 
      }else if(req.query.sort){
        sortOption[req.query.sort] = 1 //ascending 
      }else{
        sortOption['createdAt'] = -1 //default descending 
      }

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

  // exports.addNote = 

  //gets all notes
  exports.notes = async(req,res)=>{
    try{
      const userNotes = await notes.find({user: req.user.id})
      res.render('dashboard', {userNotes: userNotes})
    }catch(error){
      console.error(error)
      res.status(500).render('page404')
    }
  }

