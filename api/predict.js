// api/predict.js
export default async function handler(req, res) {
  // Hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, input } = req.body;

  // Validasi input
  if (!model || !input) {
    return res.status(400).json({ error: 'Missing "model" or "input"' });
  }

  try {
    // Panggil Replicate API
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: model,  // model version ID dari Replicate
        input: input,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: 'Replicate error', details: err });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Konfigurasi Vercel (opsional)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // jika kirim data besar
    },
  },
};