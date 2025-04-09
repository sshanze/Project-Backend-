import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import fs from 'fs/promises'; // You forgot this import for fs.access

// Routes
import userRoutes from './routes/userRoutes.js';
import ComplaintRoutes from './routes/ComplaintRoutes.js';
import notificationRoutes from './routes/NotificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminloginRoute from './routes/adminloginRoute.js';
import facultyRoutes from './routes/facultyRoutes.js';

// Config imports
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import { protectRoute } from './middleware/protectRoute.js';

// Create Express app
const app = express();
const server = http.createServer(app);  // Create server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL (you may update this for Render deployment)
    credentials: true
  }
});

// Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment Config
const PORT = ENV_VARS.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Public 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Download route
app.get("/download/:filename", async (req, res) => {
  const fileName = decodeURIComponent(req.params.filename);
  const filePath = path.join(__dirname, "uploads", fileName);

  try {
    await fs.access(filePath);
    res.download(filePath);
  } catch (err) {
    res.status(404).send("File not found!");
  }
});

// Attach io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', protectRoute(['Student']), ComplaintRoutes);
app.use('/api/faculty', protectRoute(['Faculty']), facultyRoutes);
app.use('/api/admin/adminAuthority', protectRoute(['Admin']), adminRoutes);
app.use('/api/notifications', protectRoute, notificationRoutes);
app.use('/api/admin/adminLogin', adminloginRoute);

// Socket.IO
io.on('connection', (socket) => {
  socket.on('newComplaint', (data) => {
    io.emit('updateComplaintList', { id: data.id, status: data.status });
  });

  socket.on('disconnect', () => {
    // Cleanup if needed
  });
});

// Serve frontend (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  connectDB(); // Connect to MongoDB
});
