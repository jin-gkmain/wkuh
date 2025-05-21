import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    console.log('room name id > ', req.query.id);
    getSessionInfo(`/${req.query.id}` as string, res);
  }
}

const getSessionInfo = async (roomName: string, res: NextApiResponse) => {
  try {
    const url = `https://api.whereby.dev/v1/insights/room-sessions?roomName=${roomName}`;
    console.log(' session 요청 보내기 위한 url > ', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MEETING_API}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      console.log('session정보 > ', data);

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
