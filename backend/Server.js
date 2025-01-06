import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Routes
import userRoutes from './routes/userRoutes.js'
import ComplaintRoutes from './routes/ComplaintRoutes.js'
import notificationRoutes from './routes/NotificationRoutes.js'


//config imports
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import { protectRoute } from './middleware/protectRoute.js';
import cookieParser from 'cookie-parser';


const app = express();
const PORT=ENV_VARS.PORT;

app.use(cookieParser());//it will allow you to parse cookies like "req.cookies"

// Middleware
app.use(cors());
app.use(bodyParser.json());




app.use('/api/users', userRoutes);
app.use('/api/complaints',protectRoute, ComplaintRoutes);
app.use('/api/notifications',protectRoute, notificationRoutes);

app.listen(PORT,()=>{
    console.log("server started at http://localhost:"+PORT);
    connectDB(); 
})