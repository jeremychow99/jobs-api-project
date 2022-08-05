require('dotenv').config();
require('express-async-errors');

//security packages
const xss = require('xss-clean')
const cors = require('cors')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')


const express = require('express');
const app = express();


const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window`
}))
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(cors())


app.get('/',(req,res)=>{
  res.send('jobs-api')
})

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)


//displays error if url route doesnt exist in routes above
app.use(notFoundMiddleware);

// error handling for when controllers throw an error
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
