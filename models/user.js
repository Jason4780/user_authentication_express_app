const mongoose= require('mongoose');

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

/*creates collection called users inside our database, 
because model automically makes name lowercase and plural so 'User' becomes users*/
const User = mongoose.model('User', userSchema);

module.exports = User;