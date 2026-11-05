import './env';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { githubRouter } from './routes/github';
import { soundcloudRouter } from './routes/soundcloud';
import { spotifyRouter } from './routes/spotify';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/github', githubRouter);
app.use('/api/soundcloud', soundcloudRouter);
app.use('/api/spotify', spotifyRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
