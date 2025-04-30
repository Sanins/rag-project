import { pool } from './db.js';
import { smartRAG } from './ragService.js';

export async function getSelectedRawText(selectedIds) {
  if (!selectedIds.length) return [];

  const placeholders = selectedIds.map(() => '?').join(', ');
  const query = `SELECT id, raw_text FROM property_notes WHERE id IN (${placeholders})`;

  const [rows] = await pool.query(query, selectedIds);
  return rows;
}

export async function bulkInsert(selectedIds, customRules) {
  try {
    const rows = await getSelectedRawText(selectedIds);
    const textFields = rows.map((row) => row.raw_text);

    const { results } = await smartRAG(textFields, customRules);

    const updates = rows.map((row, i) => ({
      id: row.id,
      ...results[i],
    }));

    for (const row of updates) {
      const {
        id,
        access_instructions,
        confidence_score,
        confidence_tip,
        parking_info,
        amenities,
        postcode,
        city,
      } = row;

      const updateQuery = `
        UPDATE property_notes
        SET 
          access_instructions = ?,
          confidence_score = ?,
          confidence_tip = ?,
          parking_info = ?,
          amenities = ?,
          postcode = ?,
          city = ?
        WHERE id = ?
      `;

      await pool.query(updateQuery, [
        access_instructions,
        confidence_score,
        confidence_tip,
        parking_info,
        Array.isArray(amenities) ? amenities.join(', ') : amenities,
        postcode,
        city,
        id,
      ]);
    }

    return { status: 'ok', updated: updates.length };
  } catch (e) {
    console.error('bulkInsert error:', e);
    throw e;
  }
}