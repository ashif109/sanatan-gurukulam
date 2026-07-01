import { Router, Request, Response } from 'express';
import db from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

import { randomUUID } from 'crypto';

const router = Router();

// Get all courses
router.get('/', (req: Request, res: Response) => {
  try {
    const courses = db.prepare('SELECT * FROM courses').all();
    // parse JSON fields
    const parsedCourses = courses.map((c: any) => ({
      ...c,
      highlights: c.highlights ? JSON.parse(c.highlights) : [],
      chapters: c.chapters ? JSON.parse(c.chapters) : []
    }));
    res.json(parsedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get single course
router.get('/:id', (req: Request, res: Response) => {
  try {
    const course: any = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    course.highlights = course.highlights ? JSON.parse(course.highlights) : [];
    course.chapters = course.chapters ? JSON.parse(course.chapters) : [];
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create course (Admin only)
router.post('/', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, difficulty, thumbnail, price, originalPrice, instructorId, instructorName, highlights, chapters } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const id = randomUUID();
    const highlightsJson = highlights ? JSON.stringify(highlights) : '[]';
    const chaptersJson = chapters ? JSON.stringify(chapters) : '[]';

    db.prepare(`
      INSERT INTO courses (id, title, description, category, difficulty, thumbnail, price, originalPrice, instructorId, instructorName, highlights, chapters)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, description, category, difficulty, thumbnail, price, originalPrice, instructorId, instructorName, highlightsJson, chaptersJson);

    res.status(201).json({ message: 'Course created successfully', id });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
