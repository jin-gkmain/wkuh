import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import ModalFrame from "./ModalFrame";
import Select, { SelectOptionType } from "../common/inputs/Select";
import langFile from "@/lang";
import { LanguageContext } from "@/context/LanguageContext";
import { editNotice, getNotice, registNotice } from "@/data/notice";

type Props = {
  onComplete: (notice: NoticeModal | number) => void;
  closeModal: () => void;
  modalType: ModalType;
  id?: string; // noticeId
  organization?: Organization;
  notice?: Notice;
};

type SelectType = "organization";

export default function NoticeModal({
  onComplete,
  closeModal,
  modalType,
  id: noticeId,
  organization,
  notice,
}: Props) {
  const { webLang } = useContext(LanguageContext);
  // const [noticeObj, setNoticeObj] = useState({
  //   organization: 'default',
  //   title: '',
  //   body: '',
  // });

  const [noticeObj, setNoticeObj] = useState<NoticeModal>({
    n_idx: 0,
    title: "",
    content: "",
  });

  // 전달받은 id 에 해당하는 공지사항 내용 받아오기
  // useEffect(() => {
  //   if (modalType === 'view' || modalType === 'manage') {
  //     if (noticeId) {
  //       console.log('notice id 받아서 해당 공지사항 요청');
  //     }
  //     setNoticeObj({
  //       title: '공지사항1',
  //       content: `공지사항 내용`,
  //     });
  //   }
  // }, [modalType, noticeId]);

  // input update 함수
  const handleInputChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = ev.target;
    const { name, value } = target;

    setNoticeObj({ ...noticeObj, [name]: value });
  };

  // const handleSumbmit = (ev: FormEvent<HTMLFormElement>) => {
  //   ev.preventDefault();
  //   let notice: Notice;
  //   // if (modalType === 'new') {
  //   //   // ✨ 새로운 공지사항 등록 api 통신....
  //   //   // 응답으로 받은 notice
  //   //   notice = {
  //   //     n_idx: 10,
  //   //     title: '공지제목',
  //   //     contents: '공지 내용',
  //   //     writer: '작성자',
  //   //     registdate_local: new Date('2024-03-01'),
  //   //     registdate_utc: new Date('2024-03-01'),
  //   //     target_org: '몽골 제1병원',
  //   //   };
  //   //   onComplete(notice);
  //   // } else if (modalType === 'manage') {
  //   //   // ✨ 기존 공지사항 수정 api 통신....
  //   //   // 응답으로 받은 notice
  //   //   notice = {
  //   //     n_idx: 11,
  //   //     title: '공지제목',
  //   //     contents: '공지 내용',
  //   //     writer: '작성자',
  //   //     registdate_local: new Date('2024-03-01'),
  //   //     registdate_utc: new Date('2024-03-01'),
  //   //     target_org: '몽골 제1병원',
  //   //   };
  //   //   onComplete(notice);
  //   // } else if (modalType === 'view') {
  //   //   closeModal();
  //   // }
  // };

  const handleSumbmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    let { title, content } = noticeObj;

    if (modalType === "new") {
      const res = await registNotice({
        o_idx: organization.o_idx,
        title,
        content,
      });

      if (res.message === "SUCCESS") {
        onComplete(res.n_idx);
      }
    } else if (modalType === "manage") {
      const res = await editNotice(noticeObj.n_idx, {
        o_idx: organization.o_idx,
        title,
        content,
      });

      if (res === "SUCCESS") {
        onComplete(noticeObj);
      }
    }
    // if (modalType === 'new') {
    //   // ✨ 새로운 공지사항 등록 api 통신....
    //   // 응답으로 받은 notice
    //   notice = {
    //     n_idx: 10,
    //     title: '공지제목',
    //     contents: '공지 내용',
    //     writer: '작성자',
    //     registdate_local: new Date('2024-03-01'),
    //     registdate_utc: new Date('2024-03-01'),
    //     target_org: '몽골 제1병원',
    //   };
    //   onComplete(notice);
    // } else if (modalType === 'manage') {
    //   // ✨ 기존 공지사항 수정 api 통신....
    //   // 응답으로 받은 notice
    //   notice = {
    //     n_idx: 11,
    //     title: '공지제목',
    //     contents: '공지 내용',
    //     writer: '작성자',
    //     registdate_local: new Date('2024-03-01'),
    //     registdate_utc: new Date('2024-03-01'),
    //     target_org: '몽골 제1병원',
    //   };
    //   onComplete(notice);
    // } else if (modalType === 'view') {
    //   closeModal();
    // }
  };

  useEffect(() => {
    if (modalType !== "new") {
      if (notice) {
        setNoticeObj(notice);
      }
    }
  }, [modalType]);

  return (
    <div className="notice-modal">
      <ModalFrame
        view={modalType === "view"}
        onClose={closeModal}
        onComplete={handleSumbmit}
        title={
          modalType === "new"
            ? langFile[webLang].NOTICE_MODAL_NEW_TITLE_TEXT // 공지사항 등록
            : modalType === "manage"
            ? langFile[webLang].NOTICE_MODAL_MANAGE_TITLE_TEXT // 공지사항 수정
            : langFile[webLang].NOTICE_MODAL_VIEW_TITLE_TEXT // 공지사항 확인
        }
        completeBtnText={
          webLang === "en"
            ? modalType === "new"
              ? langFile[webLang].NOTICE_MODAL_NEW_TITLE_TEXT // Add Notice
              : langFile[webLang].MODAL_MANAGE_COMPLETE_BUTTON_TEXT // Save
            : ""
        }
        hideBtns={modalType === "view"}
        onCancel={closeModal}
      >
        {
          <div className="flex flex-col gap-10">
            <div className="flex gap-10">
              <div className="flex flex-1 flex-col gap-10">
                <label htmlFor="title" className="label">
                  {langFile[webLang].NOTICE_TITLE_TEXT}
                  {/* 제목 */}
                </label>
                <input
                  autoComplete="off"
                  disabled={modalType === "view"}
                  className="input"
                  type="text"
                  name="title"
                  id="title"
                  value={noticeObj.title || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex-1 flex flex-col gap-10">
                <span className="label">
                  {langFile[webLang].NOTICE_TARGE_ORG_TEXT}
                  {/* 대상기관 */}
                </span>
                <div className="input input-disabled">
                  {webLang === "ko"
                    ? organization.o_name_kor
                    : organization.o_name_eng}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <label htmlFor="content" className="label">
                {langFile[webLang].NOTICE_CONTENTS_TEXT}
                {/* 내용 */}
              </label>
              <textarea
                autoComplete="off"
                disabled={modalType === "view"}
                className="input body"
                name="content"
                id="content"
                value={noticeObj.content || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        }
      </ModalFrame>
    </div>
  );
}
