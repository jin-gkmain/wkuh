import Layout from '@/components/common/Layout';
import AddButton from '@/components/common/inputs/AddButton';
import TableHead from '@/components/common/table/TableHead';
import useModal from '@/hooks/useModal';
import React, {
  ReactElement,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import TableRow from '@/components/common/table/TableRow';
import NoticeModal from '@/components/modal/NoticeModal';
import useAlertModal from '@/hooks/useAlertModal';
import ConfirmAlertBox from '@/components/common/ConfirmAlertBox';
import CheckAlertbox from '@/components/common/CheckAlertBox';
import Select, { SelectOptionType } from '@/components/common/inputs/Select';
import langFile from '@/lang';
import { LanguageContext } from '@/context/LanguageContext';
import MyHead from '@/components/common/MyHead';
import { useAppSelector } from '@/store';
import getOrgs from '@/data/org';
import { convertTimeToStr } from '@/utils/date';
import { useRouter } from 'next/router';
import getNoticeList, { deleteNotice, getNotice } from '@/data/notice';
import SearchNoticeContent from '@/components/pages/notice/SearchNoticeContent';

export type NoticeSearchOptions = {
  title: string;
  content: string;
  regist_date: string;
  regist_u_name: string;
};

export type NoticeSearchInputs = {
  search_title: string;
  search_content: string;
  search_date: string;
};

export default function NoticePage() {
  const { lang } = useContext(LanguageContext);
  const { userInfo } = useAppSelector(({ user }) => user);
  const tds = getTableHeadData(lang);
  const [tableDropOptions, setTableDropOptions] = useState<TableMenuOption[]>(
    []
  );
  const [hospitals, setHospitals] = useState<Organization[]>([]);
  const [hospitalsOptions, setHospitalsOptions] = useState<SelectOptionType[]>(
    []
  );
  const [selectedHospital, setSelectedHospital] = useState('');

  const [noticeList, setNoticeList] = useState<Notice[] | null>(null);
  const [searchInputs, setSearchInputs] = useState<NoticeSearchOptions>({
    title: '',
    regist_u_name: '',
    regist_date: '',
    content: '',
  });
  const [modalType, setModalType] = useState<ModalType>('new');

  const { ModalPortal, openModal, closeModal } = useModal();
  const {
    ModalPortal: RemoveModalPortal,
    openModal: openRemoveModal,
    closeModal: closeRemoveModal,
  } = useModal();
  const { AlertModalPortal, closeAlertModal, openAlertModal } = useAlertModal();

  const selectedNotice = useRef('');
  const router = useRouter();

  const modalOpen = (type: ModalType) => {
    setModalType(type);
    openModal();
  };

  const handleMenu = (type: string, noticeId: number) => {
    selectedNotice.current = noticeId.toString();
    if (type === 'manage') {
      modalOpen(type);
    } else if (type === 'remove') {
      setModalType('remove');
      openRemoveModal();
    }
  };

  const handleRowBtnClick = (noticeId: number) => {
    selectedNotice.current = noticeId.toString();
    setModalType('view');
    openModal();
  };

  const handleModalComplete = async (notice: NoticeModal | number) => {
    // 공지 추가 성공한 경우
    if (typeof notice === 'number') {
      const res = await getNotice(notice);
      if (res !== 'ServerError' && res) {
        setNoticeList((prev) => (prev ? [res, ...prev] : [res]));
      }
    } //
    // 공지 수정 성공한 경우, 수정된 데이터 update
    else {
      setNoticeList((prev) =>
        prev.map((n) => (n.n_idx === notice.n_idx ? { ...n, ...notice } : n))
      );
    }

    closeModal();
    openAlertModal();
  };

  const removeNotice = async () => {
    // ✨ notice 삭제 api 통신...
    const res = await deleteNotice(parseInt(selectedNotice.current));
    if (res === 'SUCCESS') {
      setNoticeList((prev) =>
        prev.filter((item) => item.n_idx.toString() != selectedNotice.current)
      );
      closeRemoveModal();
      openAlertModal();
    }
  };

  const setSelected = (selected: string) => {
    const matched = hospitalsOptions.find((item) => item.value === selected);
    if (matched) {
      setSelectedHospital(matched.value);
    }
  };

  const getCurOrg = useCallback(() => {
    return hospitals.find((h) => h.o_idx === parseInt(selectedHospital));
  }, [selectedHospital]);

  const handleSearch = (searchInputs: NoticeSearchInputs) => {
    setSearchInputs((prev) => ({ ...prev, ...searchInputs }));
  };

  // 병원목록 받기
  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.p_idx) {
      router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
      return;
    }

    let search = userInfo.country === 'korea' ? 'parent_o_idx' : 'o_idx';
    let search_key = userInfo.o_idx;

    const fetchOrgs = async () => {
      const h = await getOrgs({
        search,
        search_key,
      });

      if (h !== 'ServerError') {
        setHospitals(h);
      } else {
        console.log('병원 목록 데이터 받기 실패');
      }
    };

    fetchOrgs();
  }, [userInfo]);

  // 병원목록을 이용하여 병원 select options 를 조합하여 설정
  useEffect(() => {
    let options: SelectOptionType[] = [];
    hospitals.forEach((o) => {
      const option: SelectOptionType = {
        key: o.o_name_kor || '',
        keyEn: o.o_name_eng || '',
        value: o.o_idx.toString(),
      };
      options.push(option);
    });

    setHospitalsOptions(options);

    if (options.length) {
      setSelectedHospital(options[0].value);
    } else {
      setSelectedHospital('');
    }
  }, [hospitals]);

  // ✨공지목록 설정
  useEffect(() => {
    if (selectedHospital) {
      const fetchNoticeList = async () => {
        const res = await getNoticeList(
          parseInt(selectedHospital),
          searchInputs
        );

        if (res !== 'ServerError') {
          setNoticeList(res);
        }
      };

      fetchNoticeList();
      // 공지목록 데이터 받아오기 api 통신...
      // 성공시 공지목록 설정
    }
  }, [selectedHospital, searchInputs]);

  // table menu 접근제한, 언어에 따른 option text 변경
  useEffect(() => {
    if (userInfo) {
      let { country, permission } = userInfo;
      let dropOptions = [];
      if (country === 'korea') {
        if (permission === 'admin') {
          dropOptions.push('remove');
          dropOptions.push('manage');
        }
      }

      setTableDropOptions(dropOptions);
    }
  }, [userInfo]);

  return (
    <div className="notice-page page-contents">
      <MyHead subTitle="notice" />
      <ModalPortal>
        <NoticeModal
          onComplete={handleModalComplete}
          closeModal={closeModal}
          modalType={modalType}
          id={selectedNotice.current}
          organization={
            userInfo.country === 'korea'
              ? hospitals.find((h) => h.o_idx === parseInt(selectedHospital))
              : hospitals[0]
          }
          notice={
            selectedNotice.current && noticeList
              ? noticeList?.find(
                  (n) => n.n_idx === parseInt(selectedNotice.current)
                )
              : null
          }
        />
      </ModalPortal>

      <RemoveModalPortal>
        <ConfirmAlertBox
          iconType="remove"
          handleClose={closeRemoveModal}
          handleMainClick={removeNotice}
          title={langFile[lang].DELETE_NOTICE_ALERT_TITLE} // 공지사항을 삭제하시겠습니까?
          desc={langFile[lang].DELETE_NOTICE_ALERT_DESC} // 삭제 버튼을 클릭하시면 공지사항이 삭제됩니다.
        />
      </RemoveModalPortal>

      <AlertModalPortal>
        <CheckAlertbox
          title={
            modalType === 'new'
              ? langFile[lang].ADD_NOTICE_ALERT_TITLE // 공지사항 등록 완료
              : modalType === 'manage'
              ? langFile[lang].EDIT_NOTICE_ALERT_TITLE // 공지사랑 수정 완료'
              : langFile[lang].CP_DELETE_NOTICE_ALERT_TITLE // 공지사항 삭제 완료'
          }
          desc={
            modalType === 'new'
              ? langFile[lang].ADD_NOTICE_ALERT_DESC // 공지사항 등록이 완료되었습니다.'
              : modalType === 'manage'
              ? langFile[lang].EDIT_NOTICE_ALERT_DESC // 공지사랑 수정이 완료되었습니다.'
              : langFile[lang].CP_DELETE_NOTICE_ALERT_DESC // 공지사항 삭제가 완료되었습니다.'
          }
          handleClose={closeAlertModal}
        />
      </AlertModalPortal>

      {/* 검색 영역 */}
      <SearchNoticeContent handleSearch={handleSearch} />

      {userInfo &&
        userInfo.country === 'korea' &&
        userInfo.permission === 'admin' && (
          <div className="controll-table-area">
            <div className="flex justify-between">
              <Select
                options={hospitalsOptions}
                selectType="hospitalSelect"
                selected={selectedHospital}
                setSelected={setSelected}
              />
              <AddButton
                text={langFile[lang].ADD_NOTICE_BUTTON_TEXT} // 공지 추가하기
                onClick={() => {
                  modalOpen('new');
                }}
              />
            </div>
          </div>
        )}

      <table className="w-full table">
        <TableHead tds={tds} />
        <tbody>
          {noticeList &&
            noticeList.length &&
            noticeList.map(
              (
                {
                  n_idx,
                  title,
                  content,
                  regist_u_idx,
                  regist_name_eng,
                  regist_name_kor,
                  registdate_utc,
                },
                idx
              ) => (
                <TableRow<TableMenuOption>
                  key={n_idx}
                  handleClick={() => handleRowBtnClick(n_idx)}
                  buttonText={langFile[lang].NOTICE_VIEW_TEXT} // 확인하기
                  onClickMenu={(type) => handleMenu(type, n_idx)}
                  tableRowOptionType={tableDropOptions}
                  lang={lang}
                >
                  <td>{idx + 1}</td>
                  <td className="truncate">{title}</td>
                  <td className="body">{content}</td>
                  <td>
                    {regist_u_idx
                      ? lang === 'ko'
                        ? regist_name_kor
                        : regist_name_eng
                      : '-'}
                  </td>
                  <td>
                    {convertTimeToStr(
                      userInfo?.country,
                      new Date(registdate_utc + ' UTC').toISOString(),
                      '.'
                    )}
                  </td>
                  <td>
                    {lang === 'ko'
                      ? getCurOrg().o_name_kor
                      : getCurOrg().o_name_eng}
                  </td>
                </TableRow>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}

NoticePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function getTableHeadData(lang: 'ko' | 'en') {
  const tds: TableHeadCol[] = [
    {
      key: langFile[lang].NOTICE_NUMBER_TEXT, // 공지번호
      valueType: 'id',
      type: 'text',
    },
    {
      key: langFile[lang].NOTICE_TITLE_TEXT, // 제목
      value: 'title',
      valueType: 'title',
      type: 'text',
    },
    {
      key: langFile[lang].NOTICE_CONTENTS_TEXT, // 내용
      valueType: 'body',
      type: 'text',
    },
    {
      key: langFile[lang].NOTICE_WRITER_TEXT, // 작성자
      value: 'writer',
      valueType: 'name',
      type: 'text',
    },
    {
      key: langFile[lang].USER_REGIST_DATE_TEXT, // 등록일
      valueType: 'date',
      type: 'text',
    },
    {
      key: langFile[lang].NOTICE_TARGE_ORG_TEXT, // 대상기관
      valueType: 'organization',
      type: 'text',
    },
    {
      key: '',
      value: null,
      type: 'button',
    },
    {
      key: '',
      value: null,
      type: 'menu',
    },
  ];
  return tds;
}
