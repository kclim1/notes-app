exports.homepage = async (req,res)=>{
    try{
        const locals = {
            title : "notes app",
            description:"a full stack notes app"
        }
        res.render('index',locals)
    }catch(error){
        res.status(500).send('error while loading homepage')
    }
}


exports.about = async (req,res) =>{
    const locals = {
        title: "About- Notes app ",
        description:"notes app that's hosted on AWS "
    }
    res.render('about',locals)
}

exports.reviews = async(req,res)=>{
    try{
        res.status(200).render('reviews')
    }catch(error){
        res.status(500).send("error loading features")
    }
}
exports.page404 = async (req,res) =>{
    res.status(404).render('page404')
}