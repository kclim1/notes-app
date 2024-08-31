const path = require('path')
const mongoose = require('mongoose')
const notes = require(path.join(__dirname, '..', 'config', 'notes'))
const User = require("../config/user.js");




exports.dashboard = async (req, res) => {
    try {
      let perPage = 12 
      let page = parseInt(req.query.page) || 1 //current page 

      let sortOption = {};
      if (req.query.sort && req.query.sort.startsWith('-')) {
        sortOption[req.query.sort.slice(1)] = -1; // descending 
      } else if (req.query.sort) {
        sortOption[req.query.sort] = 1; // ascending 
      } else {
        sortOption['createdAt'] = -1; // default descending (newest first)
      }
  
      // Use .sort() to sort the documents directly
      const userNotes = await notes.find({
        $or: [
          { user: req.user.profileId },
          { sharedWith: req.user.profileId }
        ]
      })
        .sort(sortOption)
        .skip((perPage * page) - perPage)
        .limit(perPage);
      

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
        sharedWith: [req.user.profileId]
      })
      res.redirect('/dashboard')
    }catch(error){
      console.error(error)
      res.render('authenticated404',{layout : 'layouts/dashboard'})
    }
  }

  exports.viewNote = async (req, res) => {
    try {
      const noteId = req.params.id;
  
      // Find the note by its ID
      const view = await notes.findById(noteId);
  
      if (!view) {
        // If the note is not found, render a 404 page
        return res.status(404).render('authenticated404', { layout: 'layouts/dashboard' });
      } else {
        // Render the editNote view with the note's data
        return res.render('editNote', { note : view, layout: 'layouts/dashboard' });
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).render('error', { layout: 'layouts/dashboard' });
    }
  };
  
exports.updateNote = async (req,res)=>{
  try{
    const noteId = req.params.id 
    const update = await notes.findOneAndUpdate({_id : noteId},{title:req.body.title , body:req.body.body},{new : true })
    if(!update){
      res.render('authenticated404',{layout : 'layouts/dashboard'} )
    }
    res.redirect(`/dashboard`)
  }catch(error){
    console.error(error)
    res.render("authenticated404" , {layout : 'layouts/dashboard'})
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
            .skip((perPage * page) - perPage) 
            .limit(perPage); 
        
        // Calculate the total number of pages
        const totalPages = Math.ceil(count / perPage);

        res.render('dashboard', {
            notes: userNotes,
            username: req.user.username,
            current: page,
            totalPages: totalPages, 
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
    res.render('authenticated404',{layout : 'layouts/dashboard'})
  }
}

exports.authenticated404 = async (req,res)=>{
  res.render('authenticated404',{layout : 'layouts/dashboard'})
}


exports.deleteNote = async (req, res) => {
  try {
      const noteIdToDelete = req.params.id;
      console.log('noteId:', noteIdToDelete) 
      const result = await notes.deleteOne({ _id: req.params.id, user: req.user.profileId });

    console.log('Deleted note ID:', req.params.id, 'User profileId:', req.user.profileId);

    if (result.deletedCount > 0) {
      res.redirect('/dashboard?deleted=true');

    } else {
      console.error('No note found to delete or user not authorized');
      res.status(404).render('authenticated404', { layout: 'layouts/dashboard' });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).render('authenticated404', { layout: 'layouts/dashboard' });
  }
};

exports.shareNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { sharedWith } = req.body; // Get the email from the request body

    // Find the user by email
    const collaborator = await User.findOne({ email: sharedWith });
    if (!collaborator) {
      return res.status(404).json({ error: 'User not found.' }); // Send a JSON response with error
    }

    const collaboratorProfileId = collaborator.profileId;

    // Update the note to add the collaborator's profileId to the sharedWith array
    const updatedNote = await notes.findByIdAndUpdate(noteId, {
      $addToSet: { sharedWith: collaboratorProfileId } // Use the profileId (String)
    });

    if (!updatedNote) {
      return res.status(400).json({ error: 'Failed to update note.' }); // Send a JSON response with error
    }

    res.status(200).json({ message: 'Note shared successfully.' }); // Send a success response in JSON
  } catch (error) {
    console.error('Error sharing note:', error);
    res.status(500).json({ error: 'Internal server error.' }); // Send a JSON response for server errors
  }
};
