import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

// Routes
import userRoutes from './routes/userRoutes.js';
import ComplaintRoutes from './routes/ComplaintRoutes.js';
import notificationRoutes from './routes/NotificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminloginRoute from './routes/adminloginRoute.js';

// Config imports
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import { protectRoute } from './middleware/protectRoute.js';
import { resolveComplaint } from './controllers/faculty.controller.js';

// Create Express app
const app = express();
const server = http.createServer(app);  // Create server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
  }
});

// Environment Config
const PORT = ENV_VARS.PORT || 5000; // Use 5000 if PORT is not defined

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', protectRoute(['Student']), ComplaintRoutes); // Call the controller here
app.post('/api/complaints/:id/resolve', protectRoute(['Faculty']), resolveComplaint);
app.use('/api/admin/adminAuthority', protectRoute(['Admin']), adminRoutes);
app.use('/api/notifications', protectRoute, notificationRoutes);
app.use('/api/admin/adminLogin', adminloginRoute);

// Real-time Communication with Socket.IO
io.on('connection', (socket) => {   
  console.log('A user connected');

  // Listen for new complaints and emit updates to all connected clients
  socket.on('newComplaint', (data) => {
    io.emit('updateComplaintList', { id: data.id, status: data.status });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  connectDB(); // Connect to the database
});
