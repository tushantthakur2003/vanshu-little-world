import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-content-saver',
      configureServer(server) {
        server.middlewares.use('/__api/save-content', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                const filePath = path.resolve(__dirname, 'src/data/content.js');
                const fileContent = `// =====================================================================
// VANSHU'S LITTLE WORLD 🎀 - CENTRAL CONTENT CONFIGURATION
// =====================================================================
// Auto-saved directly from /admin on ${new Date().toLocaleDateString()}

export const siteContent = ${JSON.stringify(parsed, null, 2)};

// Aliases for seamless component compatibility
siteContent.card1Letter = siteContent.loveLetter;
siteContent.card2Hug = siteContent.whenYouMissMe;
siteContent.card3Reasons = siteContent.reasonsILoveYou;
siteContent.card4Comfort = siteContent.openWhenSad;
siteContent.card5Memories = siteContent.photoGallery;
siteContent.card6Surprise = siteContent.surpriseGift;
siteContent.secretSurprise = siteContent.finalSecretSurprise;

export default siteContent;
`;
                fs.writeFileSync(filePath, fileContent, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          }
        });
      },
    },
  ],
  server: {
    port: 3000,
    open: false,
  },
});
