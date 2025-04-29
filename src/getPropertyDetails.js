import { pool } from './db.js';

export async function getPropertyDetails() {
    try {
      const [rows] = await pool.query('SELECT * FROM property_notes');
      return rows;
    } catch (error) {
      console.error('Error fetching property notes:', error);
      throw error;
    }
  }