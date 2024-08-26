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
        {$match: {user:req.user.profileId} },
        {$sort:{createdAt:-1}},
        {$skip : (perPage * page) - perPage},
        {$limit : perPage}
      ])
      const count = await notes.countDocuments({user:req.user.profileId})
      console.log("Profile ID :",req.user.profileId)
      const totalPages = Math.ceil(count / perPage);
      const locals = {
        title: "Dashboard",
        description: "A full stack notes app dashboard"
      };
      res.render('dashboard', {
        username : req.user.username,
        notes : userNotes,
        locals,
        current: page,
        totalPages : totalPages,
        layout: 'layouts/dashboard' // Specify the dashboard layout
      });
    } catch (error) {
      console.error(error)
      res.render('authenticated404',{layout : 'layouts/dashboard'})
    }
  };

  exports.addNote = async(req,res)=>{
    try{
      console.log(req.body)
      const newNote = await notes.create({
        user : req.user.profileId,
        profileId : req.user.profileId,
        title: req.body.title,
        body : req.body.body,
      })
      res.redirect('/dashboard/notes')
    }catch(error){
      console.error(error)
      res.render('authenticated404',{layout : 'layouts/dashboard'})
    }
  }

  //gets all notes
  exports.notes = async(req, res) => {
    try {
        let perPage = 12; 
        let page = parseInt(req.query.page) || 1;

        // Fetch the total count of notes for the user
        const count = await notes.countDocuments({ user: req.user.profileId });
      console.log("user profileId:",req.user.profileId)
        // Fetch the notes for the current page
        const userNotes = await notes.find({ user: req.user.profileId})
            .skip((perPage * page) - perPage) // Skip the previous pages
            .limit(perPage); // Limit the result to the notes per page
        
        // Calculate the total number of pages
        const totalPages = Math.ceil(count / perPage);

        // Render the dashboard view, passing the necessary variables
        res.render('dashboard', {
            notes: userNotes,
            username: req.user.username,
            current: page,
            totalPages: totalPages, // Pass totalPages to the view
            layout: 'layouts/dashboard'
        });
    } catch (error) {
        console.error(error);
        res.render('authenticated404',{layout : 'layouts/dashboard'})
    }
};


exports.addNotePage = async (req,res)=>{
  try{
    res.render('addNote.ejs',{
      layout : 'layouts/dashboard'
    })
  }
  catch(error){
    console.error(error)
    rres.render('authenticated404',{layout : 'layouts/dashboard'})
  }
}

exports.authenticated404 = async (req,res)=>{
  res.render('authenticated404',{layout : 'layouts/dashboard'})
}