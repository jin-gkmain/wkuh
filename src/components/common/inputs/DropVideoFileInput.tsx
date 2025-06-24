import React, {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import { useDropzone } from "react-dropzone";
import Clip from "../icons/Clip";
import File from "../icons/File";
import Close from "../icons/Close";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";
import { downloadFile } from "@/data/file";
import { downloadVideoFile } from "@/data/video_file";

// 타입 가드 함수들
const isVideoFile = (file: File | VideoFile): file is VideoFile => {
  return "vf_idx" in file;
};

const isBrowserFile = (file: File | VideoFile): file is File => {
  return !("vf_idx" in file);
};

type Props = {
  labelText?: boolean;
  short?: boolean;
  type?: string;
  docType?: "pdf" | "all";
  dropFile?: (files: File[]) => void;
  disabled?: boolean;
  files: (File | VideoFile)[];
  setFiles: (files: File[]) => void;
  onRemove: (name: string) => void;
};

export default function DropVideoFileInput({
  labelText = false,
  type,
  docType,
  dropFile,
  disabled = false,
  files,
  setFiles,
  onRemove,
  short,
}: Props) {
  const { lang } = useContext(LanguageContext);
  const fileIdRef = useRef(0);
  console.log("files:", files);
  const inputEle = useRef(null);

  const checkExt = (fileName: string) => {
    const filetypes = /.*/;
    const ext = fileName.slice(fileName.lastIndexOf("."));
    return filetypes.test(ext.toLowerCase());
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      let length = files.length;

      fileIdRef.current = 0;

      const addedFiles: File[] = [];

      acceptedFiles.map((file) => {
        if (file.size > 20 * 1024 * 1024) {
          console.log("20MB 초과됨");
        } else {
          if (length < 10) {
            const passOrNot = checkExt(file.name);
            if (passOrNot) {
              addedFiles.push(file);
              length += 1;
            } else {
              console.log("형식이 올바르지 않음 > ", file);
            }
          }
        }
      });

      setFiles(addedFiles);
    },
    [setFiles, files.length]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
    disabled: disabled,
  });

  const onClickLabel = (ev: MouseEvent<HTMLLabelElement>) => {
    ev.stopPropagation();
  };

  const handleOnChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    onDrop(Array.from(files));
    ev.target.value = null;
  };

  return (
    <div className="drop-file-input">
      <div
        {...getRootProps()}
        className={`file-drop-area input flex align-center ${
          isDragActive ? "active" : ""
        } ${disabled ? "input-disabled" : ""}`}
      >
        <input
          ref={inputEle}
          {...getInputProps()}
          type="file"
          id={type ? type : "file"}
          disabled={disabled}
          onChange={handleOnChange}
        />
        <label
          htmlFor={type ? type : "file"}
          className="w-full"
          onClick={onClickLabel}
        >
          {labelText && langFile[lang].ATTACHED_VIDEO_FILE_PLACEHOLDER2}
          <Clip className="clip" />
        </label>
      </div>

      {files && files.length > 0 && (
        <div className="files-container">
          {files.length &&
            files.map((file: File | VideoFile, index: number) => {
              const uniqueKey = isVideoFile(file)
                ? `saved-${file.f_registdate}-${index}`
                : `new-${file.name}-${index}-${file.size}`;

              return (
                <FileItem
                  disabled={disabled}
                  key={uniqueKey}
                  file={file}
                  length={files.length}
                  onRemove={(name) => onRemove(name)}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

type ItemProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  disabled?: boolean;
  file?: File | VideoFile;
  length: number;
  onRemove: (name: string) => void;
};

function FileItem({ file, length, onRemove, disabled }: ItemProps) {
  const { webLang } = useContext(LanguageContext);
  const handleRemove = (ev?: MouseEvent<HTMLDivElement>) => {
    ev?.stopPropagation();
    if (isVideoFile(file)) {
      // 파일을 삭제하시겠습니까?
      if (confirm(langFile[webLang].DELETE_FILE_CONFIRM_TEXT)) {
        onRemove(
          (file as any).vf_idx?.toString() || (file as any).f_idx?.toString()
        );
      }
    } else {
      onRemove(file.name);
    }
  };

  const handleDownload = async () => {
    if (isVideoFile(file)) {
      const res = await downloadVideoFile(
        (file as any).vf_idx || (file as any).f_idx
      );
      console.log("res:", res);
      if (res.message === "SUCCESS") {
        const response = await fetch(`/api/downloadFile`, {
          body: JSON.stringify({
            url: res.file_url,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        if (response.ok) {
          let blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = res.file_name; // 저장할 파일 이름
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }
    }
  };
  useEffect(() => {
    console.log("file:", file);
  }, [file]);
  return (
    <div
      onClick={handleDownload}
      className="file-item"
      style={{ width: `calc(100% / ${length > 3 ? 3 : length}  - 8px)` }}
    >
      {!disabled && <Close className="close-btn" onClose={handleRemove} />}

      <File />
      {/* {'f_idx' in file ? file.file_ori || '' : file?.name || ''} */}
      <span className="file-name">
        {isVideoFile(file)
          ? (file as any).file_name || (file as any).f_name
          : file.name}
      </span>
    </div>
  );
}
