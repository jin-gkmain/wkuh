// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const body = req.body;
  const response = await fetch('https://api.whereby.dev/v1/meetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_MEETING_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log('미팅생성? ', data);

  if (response.ok) {
    // const data = await response.json();

    console.log('response > ', data);
    res.status(200).json(data);
  } else {
    // console.log('Error scheduling meeting:', error);
    res.status(200).json({});
  }

  // res.status(200).json({ name: 'John Doe' });
}
