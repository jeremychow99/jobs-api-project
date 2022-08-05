const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50,
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    createdBy:{
        //tie the Job.js model to the User.js model
        type:mongoose.Types.ObjectId,
        // the ref below makes it so that we reference the User.js model everytime we create a job / jobschema
        ref:'User',
        required:[true, ' Please provide user']
    }
},{timestamps:true})

module.exports = mongoose.model('Job',jobSchema)