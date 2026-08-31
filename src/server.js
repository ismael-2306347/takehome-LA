import express from 'express';
import 'dotenv/config'

const app = express();

app.use(express.json());

app.post('/analyze', (req, res) => {res.json({ ok: true, target: req.body?.target })})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("server running on port " + port));