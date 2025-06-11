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

type Props = {
  labelText?: boolean;
  short?: boolean;
  type?: string;
  docType?: "pdf" | "all";
  dropFile?: (files: File[]) => void;
  disabled?: boolean;
  files: File[] | SavedFile[];
  setFiles: (files: File[], inputName: string) => void;
  onRemove: (name: string, inputName: string) => void;
};

export default function DropFileInput({
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

  const inputEle = useRef(null);

  const checkExt = (fileName: string) => {
    const filetypes =
      /mp4|avi|mov|wmv|flv|mkv|webm|m4v|m4a|m4b|m4p|m4v|m4a|m4b|m4p/;
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

      setFiles(addedFiles, type || "");
    },
    [setFiles, type]
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
          {
            labelText &&
              (short
                ? langFile[lang].ATTACHED_VIDEO_FILE_PLACEHOLDER2
                : langFile[lang].ATTACHED_VIDEO_FILE_PLACEHOLDER) // 파일 추가 혹은 여기로 드래그 (20MB 이하, 최대 10개)
          }
          <Clip className="clip" />
        </label>
      </div>

      {files && files.length > 0 && (
        <div className="files-container">
          {files.length &&
            files.map((file: File | SavedFile) => {
              return "f_idx" in file ? (
                <FileItem
                  disabled={disabled}
                  key={file.f_idx}
                  file={file}
                  length={files.length}
                  onRemove={(name) => onRemove(name, type || "")}
                />
              ) : (
                <FileItem
                  disabled={disabled}
                  key={file.name}
                  file={file}
                  length={files.length}
                  onRemove={(name) => onRemove(name, type || "")}
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
  file?: File | SavedFile;
  length: number;
  onRemove: (name: string) => void;
};

function FileItem({ file, length, onRemove, disabled }: ItemProps) {
  const { lang } = useContext(LanguageContext);

  const handleRemove = (ev?: MouseEvent<HTMLDivElement>) => {
    ev?.stopPropagation();
    if ("f_idx" in file) {
      // 파일을 삭제하시겠습니까?
      if (confirm(langFile[lang].DELETE_FILE_CONFIRM_TEXT)) {
        onRemove(file.f_idx.toString());
      }
    } else {
      onRemove(file.name);
    }
  };

  const handleDownload = async () => {
    if ("f_idx" in file) {
      const res = await downloadFile(file.f_idx);
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
        {"f_idx" in file ? file.file_ori || "" : file?.name || ""}
      </span>
    </div>
  );
}
