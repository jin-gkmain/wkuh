import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import useModal from '@/hooks/useModal';
import { useAppSelector } from '@/store';
import { LangType, LanguageContext } from '@/context/LanguageContext';
import getOrgs, { deleteOrg, editOrg } from '@/data/org';
import Layout from '@/components/common/Layout';
import TableHead from '@/components/common/table/TableHead';
import TableRow from '@/components/common/table/TableRow';
import OrganizationModalBox from '@/components/modal/OrganizationModalBox';
import useAlertModal from '@/hooks/useAlertModal';
import InfoBox, { InfoBoxType } from '@/components/common/InfoBox';
import ConfirmAlertBox from '@/components/common/ConfirmAlertBox';
import CheckAlertbox from '@/components/common/CheckAlertBox';
import AddButton from '@/components/common/inputs/AddButton';
import langFile from '@/lang';
import MyHead from '@/components/common/MyHead';

type OrganizationInfoBox = OrganizationInfo & { org_number: number };

export default function OrganizationsPage() {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { lang } = useContext(LanguageContext);
  const tds = getTableHeadData(lang);
  const infoKeys = getInfoBoxHeadData(lang);

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(false);
  const [infoData, setInfoData] = useState<OrganizationInfoBox>({
    org_number: 0,
    u_number: 0,
    p_number: 0,
    completed_tele_number: 0,
    completed_visit_number: 0,
    duration: '',
    contract_email: null,
    o_name_eng: null,
    o_name_kor: null,
  });
  const { ModalPortal, openModal, closeModal } = useModal();
  const [modalType, setModalType] = useState<ModalType>('new');
  const {
    ModalPortal: RemoveModalPortal,
    openModal: openRemoveModal,
    closeModal: closeRemoveModal,
  } = useModal();
  const { AlertModalPortal, openAlertModal, closeAlertModal } = useAlertModal();

  const router = useRouter();

  const selectedOrgId = useRef(0);

  // 기관 등록, 삭제 등 모달의 타입을 지정하고 모달을 연다.
  const modalOpen = (type: ModalType) => {
    setModalType(type);
    openModal();
  };

  // 기관목록 table 에서 사용자목록 버튼을 클릭했을 때 동작 ( 사용자목록 페이지로 이동 )
  const handleTableRowBtnClick = (id: number) => {
    router.push(`/organizations/${id}/users`);
  };

  // TableRow 에서 dropdown menu 를 선택했을 때 실행됨
  const handleTableMenu = (type: string, organizationsId: number) => {
    // 기관 수정, 삭제는 한국 병원의 관리자만 가능하도록 접근을 막는다.
    if (userInfo.permission !== 'admin' || userInfo.country !== 'korea') return;

    selectedOrgId.current = organizationsId;

    if (type === 'manage') {
      modalOpen('manage');
    } else {
      setModalType(type as ModalType);
      openRemoveModal();
    }
  };

  // OrganizationModal 에서 등록, 수정 요청을 위한 버튼을 클릭했을 때 실행됨
  const onComplete = useCallback(
    async (data?: Organization) => {
      if (modalType === 'new') {
        let org = await getOrgs();
        if (org === 'ServerError') {
          console.log('기관 목록 불러오기 에러 /500');
        } else {
          setOrganizations(org);
        }
      } //
      // manage인 경우 전달받은 객체를 organizations에서 찾아서 업데이트
      else if (modalType === 'manage') {
        setOrganizations((prev) =>
          prev.map((org) => (org.o_idx === data.o_idx ? { ...data } : org))
        );
      }
      closeModal();
      openAlertModal();
    },
    [modalType, closeModal, openAlertModal]
  );

  const handleConfirm = async () => {
    // 기관 비활성화
    if (modalType === 'disabled') {
      const res = await deleteOrg(selectedOrgId.current);
      if (res === 'SUCCESS') {
        setOrganizations((prev) =>
          prev.map((item) =>
            item.o_idx === selectedOrgId.current
              ? { ...item, use_ch: 'n' }
              : { ...item }
          )
        );
        closeRemoveModal();
        openAlertModal();
      } else {
        console.log('organizations 기관 삭제 실패');
      }
    } //
    // 기관 활성화
    else if (modalType === 'activate') {
      const matched = organizations.find(
        (o) => o.o_idx === selectedOrgId.current
      );
      if (matched) {
        const {
          o_idx,
          u_idx,
          o_code,
          parent_o_idx,
          o_name_eng,
          o_name_kor,
          country,
          domain,
          contract_ed,
          contract_sd,
          contract_email,
          contract_tel,
          note,
        } = matched;
        const body = {
          u_idx,
          o_code,
          parent_o_idx,
          o_name_eng,
          o_name_kor,
          country,
          domain,
          contract_ed,
          contract_sd,
          contract_email,
          contract_tel,
          note,
          use_ch: 'y',
        };

        const res = await editOrg(o_idx, body);
        if (res === 'SUCCESS') {
          setOrganizations((prev) =>
            prev.map((item) =>
              item.o_idx === selectedOrgId.current
                ? { ...item, use_ch: 'y' }
                : { ...item }
            )
          );
          closeRemoveModal();
          openAlertModal();
        }
      }
    }
  };

  // 기관목록 불러오기
  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.p_idx) {
      router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
      return;
    }

    if (userInfo.country === 'korea') {
      const fetchOrg = async () => {
        const org = await getOrgs();

        if (org === 'ServerError') {
          console.log('기관 목록 불러오기 에러 / 500');
        } else {
          setOrganizations(org);

          let orgInfoData = { ...infoData };

          const targetOrg = org.find((o) => o.o_idx === userInfo?.o_idx);

          if (targetOrg) {
            if (targetOrg.contract_sd && targetOrg.contract_ed) {
              orgInfoData.duration = `
        ${dayjs(new Date(targetOrg.contract_sd)).format('YYYY.MM.DD')}~
        ${dayjs(new Date(targetOrg.contract_ed)).format('YYYY.MM.DD')}
        `;
            } else {
              orgInfoData.duration = '-';
            }

            setInfoData(orgInfoData);
          }
        }

        setOrganizationsLoading(true);
      };

      fetchOrg();
    } else {
      router.push(`/organizations/${userInfo.o_idx}/users`);
    }
  }, [userInfo]);

  // 해당 기관의 전체 기관수, 사용자 수 등 infoBox 의 정보 설정
  useEffect(() => {
    const orgInfoData: OrganizationInfoBox = {
      ...infoData,
      u_number: 0,
      p_number: 0,
      org_number: 0,
      completed_tele_number: 0,
      completed_visit_number: 0,
    };

    organizations.forEach((o) => {
      orgInfoData.org_number += 1;
      orgInfoData.u_number += o.u_number || 0;
      orgInfoData.p_number += o.p_number || 0;
      orgInfoData.completed_tele_number += o.completed_tele_number || 0;
      orgInfoData.completed_visit_number += o.completed_visit_number || 0;
    });

    setInfoData(orgInfoData);
  }, [organizations]);

  if (!organizationsLoading) return null;

  return (
    <div className="organizations-page page-contents">
      <MyHead subTitle="organizations" />
      {/* 기관 추가, 수정 모달 */}
      <ModalPortal>
        <OrganizationModalBox
          item={
            modalType === 'manage'
              ? organizations.find(
                  (org) => org.o_idx === selectedOrgId.current
                )!
              : null
          }
          onComplete={onComplete}
          closeModal={closeModal}
          type={modalType}
        />
      </ModalPortal>

      {/* 기관 삭제 모달 */}
      <RemoveModalPortal>
        <ConfirmAlertBox
          iconType={modalType}
          title={getConfirmModalText(modalType, lang).title}
          desc={getConfirmModalText(modalType, lang).desc}
          handleClose={closeRemoveModal}
          handleMainClick={handleConfirm}
        />
      </RemoveModalPortal>

      {/* 확인 모달 */}
      <AlertModalPortal>
        <CheckAlertbox
          title={getAlertModalText(modalType, lang).title}
          desc={getAlertModalText(modalType, lang).desc}
          handleClose={closeAlertModal}
        />
      </AlertModalPortal>

      {/* 모든 기관에 대한 종합정보 */}
      <InfoBox keys={infoKeys} data={infoData} />

      <section className="organizations-contents">
        <div className="flex justify-end add-btn-wrap controll-table-area">
          <AddButton
            show={userInfo.permission === 'admin'}
            onClick={() => modalOpen('new')}
            text={langFile[lang].ADD_ORG_BUTTON_TEXT} // 기관 추가하기
          />
        </div>

        <table className="w-full table">
          <TableHead tds={tds} />
          <tbody>
            {organizations.map(
              ({
                o_idx,
                o_code,
                o_name_kor,
                o_name_eng,
                country,
                contract_sd,
                contract_ed,
                contract_email,
                completed_tele_number,
                completed_visit_number,
                u_number,
                p_number,
                use_ch,
              }) => (
                <TableRow
                  rowDisabled={use_ch === 'n'}
                  tableRowOptionType={
                    userInfo.country === 'korea' &&
                    userInfo.permission === 'admin'
                      ? use_ch === 'y'
                        ? ['manage', 'disabled']
                        : ['manage', 'activate']
                      : []
                  }
                  lang={lang}
                  key={o_idx}
                  handleClick={() => handleTableRowBtnClick(o_idx)}
                  buttonText={langFile[lang].ORG_TABLE_ROW_BUTTON} // 사용자 목록
                  onClickMenu={(type) => handleTableMenu(type, o_idx)}
                >
                  <td>{o_code}</td>
                  <td>
                    {
                      country === 'korea'
                        ? langFile[lang].COUNTRY_KOREA // 한국
                        : langFile[lang].COUNTRY_MONGOLIA // 몽골
                    }
                  </td>
                  <td>{lang === 'ko' ? o_name_kor : o_name_eng || '-'}</td>
                  <td>{u_number ?? '-'}</td>
                  <td>{p_number ?? '-'}</td>
                  <td>{completed_tele_number ?? '-'}</td>
                  <td>{completed_visit_number ?? '-'}</td>
                  <td>
                    {contract_sd && contract_ed
                      ? `${dayjs(contract_sd).format('YYYY.MM.DD')}~
                      ${dayjs(contract_ed).format('YYYY.MM.DD')}`
                      : '-'}
                  </td>
                  <td>{contract_email ? contract_email : '-'}</td>
                </TableRow>
              )
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

OrganizationsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function getTableHeadData(lang: 'ko' | 'en') {
  const tds: TableHeadCol[] = [
    {
      key: langFile[lang].ORG_ORG_CODE_TEXT, // 기관번호
      valueType: 'id',
      type: 'text',
    },
    {
      key: langFile[lang].ORG_ORG_COUNTRY_TEXT, // 국가
      valueType: 'country',
      type: 'text',
    },
    {
      key: langFile[lang].ORG_ORG_NAME_TEXT, // 기관명
      valueType: 'organization',
      type: 'text',
    },
    {
      key: langFile[lang].ORG_USER_NUMBER_TEXT, // 사용자수
      valueType: 'number',
      type: 'text',
    },
    {
      key: langFile[lang].ORG_PATIENT_NUMBER_TEXT, // 환자수
      valueType: 'number',
      type: 'text',
    },
    {
      key: langFile[lang].ORG_COMPLETED_TELECONSULTING_NUMBER_TEXT, // 완료 협진수
      valueType: 'number',
      type: 'text',
    },
    {
      key: langFile[lang].ORG_COMPLETED_VISIT_NUMBER_TEXT, // 완료 내원수
      valueType: 'number',
      type: 'text',
    },
    {
      key: langFile[lang].ORG_CONTRACT_DURATION_TEXT, //  계약기간
      valueType: 'duration',
      type: 'text',
    },
    {
      key: langFile[lang].ORG_CONTACT_EMAIL_TEXT, // 대표메일
      valueType: 'email',
      type: 'text',
    },
    {
      key: '',
      type: 'button',
    },
    {
      key: '',
      type: 'menu',
    },
  ];
  return tds;
}

function getInfoBoxHeadData(lang: 'ko' | 'en') {
  const INFO_KEYS: InfoBoxType[] = [
    {
      iconType: 'organization',
      title: langFile[lang].ORG_ORG_NUMBER_TEXT, // 기관수
    },
    {
      iconType: 'user',
      // type: 'users',
      title: langFile[lang].ORG_USER_NUMBER_TEXT, // 사용자수',
    },
    {
      iconType: 'patient',
      // type: 'patients',
      title: langFile[lang].ORG_PATIENT_NUMBER_TEXT, // 환자수',
    },
    {
      iconType: 'chart',
      // type: 'completedCoDiagnosis',
      title: langFile[lang].ORG_COMPLETED_TELECONSULTING_NUMBER_TEXT, // 완료 협진수',
    },
    {
      iconType: 'chart',
      // type: 'completedVisit',
      title: langFile[lang].ORG_COMPLETED_VISIT_NUMBER_TEXT, // 완료 내원수',
    },
    {
      iconType: 'calendar',
      // type: 'duration',
      title: langFile[lang].ORG_CONTRACT_DURATION_TEXT, // 계약기간',
    },
  ];

  return INFO_KEYS;
}

function getConfirmModalText(type: ModalType, lang: LangType) {
  let title;
  let desc;

  if (type === 'activate') {
    title = langFile[lang].ACTIVATE_ORG_ALERT_TITLE; // 기관을 활성화 하시겠습니까?
    desc = langFile[lang].ACTIVATE_ORG_ALERT_DESC; // 확인 버튼을 클릭하시면 기관이 활성화됩니다.
  } //
  else if (type === 'disabled') {
    title = langFile[lang].DISABLED_ORG_ALERT_TITLE; // 기관을 비활성화 하시겠습니까?
    desc = langFile[lang].DISABLED_ORG_ALERT_DESC; // 확인 버튼을 클릭하시면 기관이 비활성화됩니다.
  }
  return { title, desc };
}

function getAlertModalText(type: ModalType, lang: LangType) {
  let title;
  let desc;

  if (type === 'new') {
    title = langFile[lang].ADD_ORG_ALERT_TITLE; // 기관 등록 완료
    desc = langFile[lang].ADD_ORG_ALERT_DESC; // 기관등록이 완료되었습니다.
  } //
  else if (type === 'manage') {
    title = langFile[lang].EDIT_ORG_ALERT_TITLE; // 기관정보 수정 완료
    desc = langFile[lang].EDIT_ORG_ALERT_DESC; // 기관정보 수정이 완료되었습니다.
  } //
  else if (type === 'disabled') {
    title = langFile[lang].CP_DISABLED_ORG_ALERT_TITLE; // 기관 비활성화 완료
    desc = langFile[lang].CP_DISABLED_ORG_ALERT_DESC; // 기관 비활성화가 완료되었습니다.
  } //
  else if (type === 'activate') {
    title = langFile[lang].CP_ACTIVATE_ORG_ALERT_TITLE; // 기관 활성화 완료
    desc = langFile[lang].CP_ACTIVATE_ORG_ALERT_DESC; // 기관 활성화가 완료되었습니다.
  }

  return { title, desc };
}
