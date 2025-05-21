import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    getMeeting(req.query.id as string, res);
  } else if (req.method === 'DELETE') {
    deleteMeeting(req.query.id as string, res);
  }
}

const getMeeting = async (meetingId: string, res: NextApiResponse) => {
  try {
    const response = await fetch(
      `https://api.whereby.dev/v1/meetings/${meetingId}?fields=hostRoomUrl,viewerRoomUrl`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MEETING_API_KEY}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      console.log('meeting 정보 > ', data);
      res.status(200).json(data);
    } else {
      res.status(400).json({ message: 'Failed to fetch meeting info' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteMeeting = async (meetingId: string, res: NextApiResponse) => {
  try {
    const response = await fetch(
      `https://api.whereby.dev/v1/meetings/${meetingId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MEETING_API_KEY}`,
        },
      }
    );

    if (response.ok) {
      // const data = await response.json();
      res.status(200).json({ message: 'ok' });
    } else {
      res.status(400).json({ message: 'Failed to fetch meeting info' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
