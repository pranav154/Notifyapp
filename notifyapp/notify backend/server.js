const express = require('express');
const { exec } = require("child_process");
const {connectDB,user,task} = require('./database');
const fs = require('fs');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const middleware =require('./middleware');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const { ObjectId } = require('mongoose').Types;
const nodemailer = require('nodemailer');
const cron = require('node-cron');

connectDB();


// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
  
    try {
      // Check if the username is already taken
      const existingUser = await user.findOne({ username });
      const existingmail=await user.findOne({email});
      if (existingmail) {
        return res.status(400).send({ message: 'email already registered' });
      }
      if (existingUser) {
        return res.status(400).send({ message: 'Username already taken ' });
      }
      
      
      const newUser = new user({ username, password,email });
      await newUser.save();
  
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  // Login endpoint
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the user exists
      const User = await user.findOne({ username });
      if (!User) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Compare the password
      const passwordMatch = (password === User.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: User._id }, 'secretKey', { expiresIn: 3600000 }
      );


  
      // Send the token in the response
      res.json({token});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  // Create Nodemailer transporter
  const transporter = nodemailer.createTransport({
    
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'notifyapp3@gmail.com',
      pass: 'ifnpdffwjjzdpsaj',
    },
  });

// Function to send notification email
  const sendNotificationEmail = (email, Task) => {
    const mailOptions = {
      from: 'notifyapp3@gmail.com',
      to: `"${email}"`,
      subject: 'Task Deadline Notification',
      text: `The deadline for your task "${Task.title}" has been reached.`,
      
    };
    
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending notification email:', error);
      } else {
        console.log('Notification email sent:', info.response);
        try{
            
         }catch(err){
          console.log(err);
         }
      }
    });
  };

  // Function to check task deadlines and send notification emails
  const checkTaskDeadlines = async () => {
    try {
      //  current time
      const currentTime = new Date();

      // Find all tasks with deadline in the past
      const overdueTasks = await task.find({ targetDate: { $lt: currentTime } });
      
      //  overdue tasks
      for (const Task of overdueTasks) {
        // Find the user associated with the task
        const User = await user.findById(Task.userId);

        // Sending notification email
        if (User && User.email) {
           sendNotificationEmail(User.email, Task);
           const t=Task._id.toString();
            console.log(t);
           await task.findByIdAndRemove(t);
        }
        
        
      }
    } catch (error) {
      console.error('Error checking task deadlines:', error);
    }
  };

  // Scheduled the task to run every minute
  cron.schedule('* * * * *', () => {
    checkTaskDeadlines();
  });

  app.use(middleware);
  app.post('/api/tasks', async (req, res) => {
    try {
        
        const userId = req.userId;
        
        console.log(userId);
        const newTask = new task({
          ...req.body,
          userId,
        });
        console.log(newTask);
        const savedTask = await newTask.save();

        
    
        
        res.json(savedTask._id);
      } catch (error) {
        
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the task' });
      }
  });
  
  //  a route for retrieving tasks
  app.get('/api/tasks',middleware, async (req, res) => {
    try {
        //  user ID from the authenticated user
        const userid = req.userId;
      console.log(userid);
        // tasks associated with the user ID
        const tasks = await task.find({ userId : userid });
        console.log(tasks);
        // Return the tasks as the response
        res.json(tasks);
      } catch (error) {
        
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving tasks' });
      }
  });
 
// a route for deleting a task
  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      //user ID from the authenticated user
      const userId = req.userId;
      const taskId = req.params.id;
      
      
      
      // Delete the task
      await task.findByIdAndRemove(taskId);
  
      // Return a success message
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the task' });
    }
  });

  
  
app.listen(4040, () => {
  console.log("app is listening on port 4040");
});