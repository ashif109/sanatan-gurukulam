import db from './index';
import { INITIAL_COURSES } from '../seed';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const runSeed = async () => {
  console.log('Seeding SQLite database...');

  // 1. Create Admin User
  const adminEmail = 'admin@occultgurukul.com';
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(randomUUID(), 'Admin User', adminEmail, hash, 'admin');
    console.log('Created Admin User: admin@occultgurukul.com / admin123');
  }

  // 2. Insert Courses
  const insertCourse = db.prepare(`
    INSERT OR IGNORE INTO courses (id, title, description, category, difficulty, thumbnail, price, originalPrice, instructorId, instructorName, highlights, chapters)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let addedCourses = 0;
  for (const course of INITIAL_COURSES) {
    const highlightsJson = JSON.stringify(course.highlights || []);
    const chaptersJson = JSON.stringify(course.chapters || []);
    
    const info = insertCourse.run(
      course.id, 
      course.title, 
      course.description, 
      course.category, 
      course.difficulty, 
      course.thumbnail, 
      course.price, 
      course.originalPrice, 
      course.instructorId || 'guru-1', 
      course.instructorName || 'Arun Pandit', 
      highlightsJson, 
      chaptersJson
    );
    if (info.changes > 0) addedCourses++;
  }

  console.log(`Seeded ${addedCourses} new courses from INITIAL_COURSES.`);
  console.log('Seeding complete.');
};

runSeed().catch(console.error);
