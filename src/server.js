import express from 'express';
import { smartRAG } from './ragService.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());

// Increase the JSON body size limit to handle large HTML strings
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/ask', async (req, res) => {
    const { textField, customRules } = req.body;

    if (!Array.isArray(textField) || textField.length === 0) {
        return res.status(400).json({ error: "textField must be a non-empty array" });
    }

    try {
        const result = await smartRAG(textField, customRules);
        res.json(result);
    } catch (error) {
        console.error('Error processing /ask:', error);
        res.status(500).json({ 
            error: "Couldn't process your request" 
        });
    }
});

app.listen(3000, () => {
    console.log('RAG API running on port 3000');
});