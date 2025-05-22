import SendBirdCall, { RoomType } from 'sendbird-calls';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

type Props = {
  roomUrl: string;
  userName: string;
  meetingId: string;
  onLeave: () => void;
};

export default function SendbirdMeeting({
  roomUrl,
  userName,
  meetingId,
  onLeave,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    SendBirdCall.authenticate({ userId: userName , accessToken: '1c6a1a64688d3df62833b3f8493b26b42e279a8c'})
    .then(() => {
      console.log('인증 성공');
      const roomParams = {
        roomType: RoomType.SMALL_ROOM_FOR_VIDEO, // 최대 6명 비디오콜
      };
      SendBirdCall.createRoom(roomParams)
      .then(room => {
        console.log(room);
        SendBirdCall.fetchRoomById(room.roomId)
        .then(room => {
          const enterParams = {
            videoEnabled: true,
            audioEnabled: true,
            localMediaView: document.getElementById('local_video_element_id'),
            remoteMediaView: document.getElementById('remote_video_element_id')
          }
        
        room.enter(enterParams)
            .then(() => {
                console.log('입장 성공');
            })
            .catch(e => {
                console.log('입장 실패', e);
            });
        })
        .catch(e => {
          console.log('방 찾기 실패', e);
        });
      })
      .catch(error => {
        console.log('방 생성 실패', error);
      });
    })
    .catch(e => {
      console.log('인증 실패', e);
    });
    
  }, []);

  return (
    <div>
      <p>Room</p>
      <video id="local_video_element_id" autoPlay muted></video>
      <video id="remote_video_element_id" autoPlay muted></video>
    </div>
  );
}