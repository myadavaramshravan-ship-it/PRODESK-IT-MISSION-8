import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiKey = env.VITE_GEMINI_API_KEY;
  const geminiModel = env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
  const openaiKey = env.VITE_OPENAI_API_KEY;

  return {
    plugins: [
      {
        name: 'ai-proxy',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.method !== 'POST' || req.url !== '/api/ai') {
              return next();
            }

            let rawBody = '';
            req.on('data', (chunk) => {
              rawBody += chunk;
            });

            req.on('end', async () => {
              try {
                const payload = rawBody ? JSON.parse(rawBody) : {};
                const provider = (payload.provider || 'gemini').toLowerCase();

                let endpoint;
                let fetchOptions;

                if (provider === 'gemini') {
                  if (!geminiKey) {
                    throw new Error('Missing VITE_GEMINI_API_KEY');
                  }

                  endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
                    geminiModel
                  )}:generateContent`;
                  const headers = {
                    'Content-Type': 'application/json'
                  };

                  if (geminiKey.startsWith('AIza')) {
                    endpoint += `?key=${encodeURIComponent(geminiKey)}`;
                  } else {
                    headers.Authorization = `Bearer ${geminiKey}`;
                  }

                  fetchOptions = {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                      contents: [{ text: payload.prompt }],
                      temperature: payload.temperature ?? 0.7,
                      maxOutputTokens: payload.maxOutputTokens ?? 20
                    })
                  };
                } else if (provider === 'openai') {
                  if (!openaiKey) {
                    throw new Error('Missing VITE_OPENAI_API_KEY');
                  }
                  endpoint = 'https://api.openai.com/v1/chat/completions';
                  fetchOptions = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${openaiKey}`
                    },
                    body: JSON.stringify(payload.requestBody)
                  };
                } else {
                  throw new Error(`Unsupported AI provider: ${provider}`);
                }

                const upstream = await fetch(endpoint, fetchOptions);
                const responseText = await upstream.text();

                res.statusCode = upstream.status;
                upstream.headers.forEach((value, key) => {
                  if (key.toLowerCase() === 'content-length') return;
                  res.setHeader(key, value);
                });
                res.end(responseText);
              } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: error.message }));
              }
            });
          });
        }
      }
    ]
  };
});
