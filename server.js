import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Idea from './models/Idea.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ideaforge';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// GET all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ updatedAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new idea
app.post('/api/ideas', async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const newIdea = new Idea({
      title,
      description,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update an idea
app.put('/api/ideas/:id', async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        tags,
        updatedAt: Date.now() 
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedIdea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
    res.json(updatedIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an idea
app.delete('/api/ideas/:id', async (req, res) => {
  try {
    const deletedIdea = await Idea.findByIdAndDelete(req.params.id);
    if (!deletedIdea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
