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
        res.status(500).send("error loading reviews")
    }
}
exports.page404 = async (req,res) =>{
    res.status(404).render('page404')
}

exports.login = async (req,res)=>{
    try{
        console.log('login route hit')
        res.status(200).render('login')
    }catch(error){
        console.error(error)
        res.render('page404')
    }
}

exports.signup = async (req,res)=>{
    try{
        res.status(200).render('signup')
    }catch(error){
        console.error(error)
        res.render('page404')
    }
}


