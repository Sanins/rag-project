import { pool } from './db.js';

export async function resetDb() {
    const query = `
      UPDATE property_notes
      SET
        postcode = NULL,
        city = NULL,
        access_instructions = NULL,
        parking_info = NULL,
        amenities = NULL;
    `;
  
    await pool.query(query);
  }