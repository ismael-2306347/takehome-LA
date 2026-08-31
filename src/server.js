import 'dotenv/config';
import express from 'express';
import { validateDomain } from './validate.js';
import { analyze } from './analyze.js';

const app = express();
app.use(express.json());

app.post('/analyze', async (req, res) => {
  let domain;
  try {
    domain = validateDomain(req.body?.target);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  const result = await analyze(domain);

  if (result.notFound) {
    return res.status(404).json({ error: 'El dominio no existe' });
  }

  res.json(result.data);
});

// manejador de errores: JSON malformado y cualquier fallo inesperado
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('server running on port ' + port));
