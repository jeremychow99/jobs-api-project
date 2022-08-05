const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    }
})
// as the userSchema is created when a user inputs their details, pre-saving the mongoose doc, we hash the password and save it.
// hence the usage of .pre and 'save'
userSchema.pre('save', async function () {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt)
})

//create token
userSchema.methods.createJWT = function () {
    return jwt.sign({ userID: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

// check if input password string matches the password hash version stored in the database
userSchema.methods.checkPassword = async function (candidatePassword) {
    const isMatch = await bcryptjs.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', userSchema)