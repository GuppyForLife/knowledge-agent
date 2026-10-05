import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  })
})

app.post('/api/test-llm', async (c) => {
  const apiKey = process.env.LLM_API_KEY
  
  if (!apiKey) {
    return c.json({ error: 'API Key is missing' }, 500)
  }

  const body = await c.req.json().catch(() => ({}))
  const userMessage = body.message || 'Say hello!'

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: userMessage }]
      }],
      generationConfig: {
        maxOutputTokens: 100
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    return c.json({ error: 'Gemini request failed', details: errorData }, response.status)
  }

  const data = await response.json()

  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

  return c.json({
    raw: data,
    message: textOutput
  })
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})