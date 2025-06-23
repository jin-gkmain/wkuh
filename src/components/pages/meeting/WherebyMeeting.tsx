import "@whereby.com/browser-sdk/embed";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

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
      roomEle.current.addEventListener("leave", (ev) => {
        // 미팅 종료 처리
        onLeave();

        // 미팅 종료 후 탭 닫기 시도
        const handleMeetingEnd = () => {
          // 현재 창이 팝업이나 별도 탭으로 열린 경우 닫기 시도
          if (window.opener || window.history.length <= 1) {
            try {
              window.close();
              // 일정 시간 후에도 창이 닫히지 않으면 사용자에게 알림
              setTimeout(() => {
                if (!window.closed) {
                  alert("미팅이 종료되었습니다. 이 탭을 닫아주세요.");
                }
              }, 1000);
            } catch (error) {
              console.log("탭을 자동으로 닫을 수 없습니다.");
              alert("미팅이 종료되었습니다. 이 탭을 닫아주세요.");
            }
          } else {
            // 일반적인 브라우저 탭인 경우 대시보드로 이동
            const userChoice = confirm(
              "미팅이 종료되었습니다. 대시보드로 이동하시겠습니까?"
            );
            if (userChoice) {
              router.push("/dashboard");
            }
          }
        };

        // 약간의 지연 후 처리 (미팅 종료 애니메이션 등을 위해)
        setTimeout(handleMeetingEnd, 500);

        // fetch(`http://localhost:3000/api/meeting?meetingId=${meetingId}`, {
        //   method: 'DELETE',
        // });
      });
    }
  }, [roomEle.current, router, onLeave]);

  if (!roomUrl) return <p>Loading...</p>;

  return (
    <>
      {roomUrl ? (
        <whereby-embed
          displayName={userName}
          ref={roomEle}
          room={roomUrl}
          style={{ height: "100%" }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
