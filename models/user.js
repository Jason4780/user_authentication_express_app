const mongoose= require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    }
})

//authenticate input against database, make sure email and password match ones in our database.
userSchema.statics.authenticate = function(email, password, callback){
    User.findOne({email: email})
    .exec(function(error, user){
        if(error){
            callback(error)
        }else if(!user){
        const err = new Error('User not found.')    
        err.status = 401
        callback(err)
        }
        bcrypt.compare(password, user.password, function(error, result){
            if(result === true){
                return callback(null, user)
            }else{
                return callback()
            }
        })
    })

}

//hash the password before it is saved to mongo
userSchema.pre('save', function(next){
    const user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err){
          return next(err)
        }
        user.password = hash;
        next()
    })
})
/*creates collection called users inside our database, 
because model automically makes name lowercase and plural so 'User' becomes users*/
const User = mongoose.model('User', userSchema);

module.exports = User;