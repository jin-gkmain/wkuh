import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    getParticiptants(req.query.id as string, res);
  }
}

const getParticiptants = async (
  roomSessionId: string,
  res: NextApiResponse
) => {
  try {
    const response = await fetch(
      `https://api.whereby.dev/v1/insights/participants?roomSessionId=${roomSessionId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MEETING_API}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('참여자 > ', data);

      res.status(200).json(data);
    } else {
      console.log('err > ', await response.json());
      res.status(400).json({ message: 'Failed to fetch participants list' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
