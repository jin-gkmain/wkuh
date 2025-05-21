import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { url } = await req.body;

    const response = await fetch(url);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const contentType =
        response.headers.get('content-type') || 'application/octet-stream';

      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="downloaded-file"`
      );
      res.send(Buffer.from(buffer));
    } else {
      res.status(400).json({ message: 'Failed to fetch the file' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
