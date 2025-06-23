import React, { useRef, useEffect, useContext } from "react";
import ModalFrame from "./ModalFrame";
import QRCode from "react-qr-code";
import { LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang";

type Props = {
  qrString: string; // QR 코드로 생성할 문자열
  fileName?: string; // 다운로드될 파일 이름
  closeModal: () => void; // 모달 닫기 함수
};

const QRCodeModal: React.FC<Props> = ({
  qrString,
  fileName = "qr-code",
  closeModal,
}) => {
  const { webLang } = useContext(LanguageContext);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // QR 코드 PNG로 다운로드하는 함수
  const downloadQR_PNG = () => {
    if (qrCodeRef.current) {
      // SVG 엘리먼트 찾기
      const svgElement = qrCodeRef.current.querySelector("svg");
      if (svgElement) {
        // Canvas에 SVG 그리기
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const svgSize = 160; // QR 코드 사이즈

        // 캔버스 크기 설정
        canvas.width = svgSize;
        canvas.height = svgSize;

        // SVG를 이미지로 변환
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          // 흰색 배경 먼저 그리기
          if (ctx) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, svgSize, svgSize);

            // PNG로 다운로드
            const pngUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = pngUrl;
            link.download = `${fileName}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(url);
        };

        img.src = url;
      }
    }
  };

  // 컴포넌트가 마운트되면 자동으로 QR 코드 다운로드 실행
  useEffect(() => {
    // 모달이 완전히 마운트된 후 다운로드 실행
    const timer = setTimeout(() => {
      downloadQR_PNG();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ModalFrame
      title={langFile[webLang].QR_CODE_MODAL_TITLE}
      onClose={closeModal}
      hideBtns={true}
      width="small"
    >
      <div className="qr-code-modal-container">
        <div className="qr-code-wrapper flex flex-col items-center">
          <div
            ref={qrCodeRef}
            style={{
              background: "white",
              padding: "16px",
              margin: "20px 0",
            }}
            className="flex justify-center"
          >
            <QRCode
              value={qrString || ""}
              size={160}
              level="H"
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>

          <div className="qr-download-buttons flex justify-center gap-4 mt-4">
            <button onClick={downloadQR_PNG} className="primary-btn">
              {langFile[webLang].DOWNLOAD_PNG_BUTTON_TEXT}
            </button>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

export default QRCodeModal;
