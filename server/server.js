require("dotenv").config()
const mongoose = require('mongoose');
const express = require("express")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const PORT = process.env.PORT || 2173
const app = express()

const userRoute = require("./routes/user")
const serviceRoute = require("./routes/service")
const appointmentRoute = require("./routes/appointment")
const providerRoute = require("./routes/provider")
const waitlistRoute = require("./routes/waitlist")
const authRoute = require('./routes/auth')
connectDB()


//middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("public"))
//routes
app.get("/", (req, res) => {
    res.send("this is the home page")
})

app.use("/api/users", userRoute)
app.use('/api/auth', authRoute)
app.use("/api/services", serviceRoute)
app.use("/api/appointments", appointmentRoute)
app.use("/api/waitlist", waitlistRoute)
app.use("/api/providers", providerRoute)




mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
${PORT}`))
})
mongoose.connection.on('error', err => {
    console.log(err)
})
