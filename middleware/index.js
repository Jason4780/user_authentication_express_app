function loggedIn(req, res, next){
    if(req.session && req.session.userId){
        res.redirect('/profile')
    }
    return next()
}

module.exports.loggedIn = loggedIn;

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        next()
    }else{
        const err = new Error('Must be logged in to view this page.')
        err.status = 401
        next(err)
    }
}

module.exports.requiresLogin = requiresLogin