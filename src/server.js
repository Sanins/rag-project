import express from 'express';
import { smartRAG } from './ragService.js';
import { resetDb } from './resetDb.js';
import { bulkInsert } from './bulkInsert.js';
import { getPropertyDetails } from './getPropertyDetails.js'
import { generateMockFreeText } from './generateText.js';
import { generateSuggestions } from './generateSuggestions.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());

// Increase the JSON body size limit to handle large HTML strings
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/ask', async (req, res) => {
    const { textField, customRules, aiModel } = req.body;

    if (!Array.isArray(textField) || textField.length === 0) {
        return res.status(400).json({ error: "textField must be a non-empty array" });
    }

    try {
        const result = await smartRAG(textField, customRules, aiModel);
        res.json(result);
    } catch (error) {
        console.error('Error processing /ask:', error);
        res.status(500).json({ 
            error: "Couldn't process your request" 
        });
    }
});

app.get('/property-notes', async (req, res) => {
    try {
        const result = await getPropertyDetails();
        res.json(result);
    } catch (error) {
        console.error('Error processing /property-notes:', error);
        res.status(500).json({ 
        error: "Couldn't process your request" 
    });
    }
});

app.post('/bulk-property-notes', async (req, res) => {
    const { selectedIds, customRules, aiModel } = req.body;

    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
        return res.status(400).json({ error: "textField must be a non-empty array" });
    }

    try {
        const result = await bulkInsert(selectedIds, customRules, aiModel);
        res.json(result);
    } catch (error) {
        console.error('Error processing /bulk-property-notes:', error);
        res.status(500).json({ 
            error: "Couldn't process your request" 
        });
    }
});

app.post('/generate-text', async (req, res) => {
    try {
        const result = await generateMockFreeText();
        res.json({ content: result.choices[0].message.content });
    } catch (error) {
        console.error('Error processing /generate-text:', error);
        res.status(500).json({ 
            error: "Couldn't process your request" 
        });
    }
});

app.post('/suggestions', async (req, res) => {
    const { input } = req.body;
    try {
        const result = await generateSuggestions(input);
        res.json({ content: result.choices[0].message.content });
    } catch (error) {
        console.error('Error processing /generate-text:', error);
        res.status(500).json({ 
            error: "Couldn't process your request" 
        });
    }
});


app.delete('/reset', async (req, res) => {
    try {
      await resetDb();
      res.status(200).json({ message: 'Database reset successfully' }); // ✅ add response
    } catch (error) {
      console.error('Error processing /reset:', error);
      res.status(500).json({ 
        error: "Couldn't process your request" 
      });
    }
  });

app.listen(3000, () => {
    console.log('RAG API running on port 3000');
});