import '@whereby.com/browser-sdk/embed';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

type Props = {
  roomUrl: string;
  userName: string;
  meetingId: string;
  onLeave: () => void;
};

export default function WherebyMeeting({
  roomUrl,
  userName,
  meetingId,
  onLeave,
}: Props) {
  const roomEle = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (roomEle.current) {
      roomEle.current.addEventListener('leave', (ev) => {
        router.push('/dashboard');

        onLeave();

        // fetch(`http://localhost:3000/api/meeting?meetingId=${meetingId}`, {
        //   method: 'DELETE',
        // });
      });
    }
  }, [roomEle.current]);

  if (!roomUrl) return <p>Loading...</p>;

  return (
    <>
      {roomUrl ? (
        <whereby-embed
          displayName={userName}
          ref={roomEle}
          room={roomUrl}
          style={{ height: '100%' }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
