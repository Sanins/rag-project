import { pool } from './db.js';

export async function resetDb() {
    const query = `
      UPDATE property_notes
      SET
        postcode = NULL,
        city = NULL,
        access_instructions = NULL,
        confidence_score = NULL,
        confidence_tip = NULL,
        parking_info = NULL,
        amenities = NULL;
    `;
  
    await pool.query(query);
  }