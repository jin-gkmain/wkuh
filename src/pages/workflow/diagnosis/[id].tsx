import Layout from '@/components/common/Layout';
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AddButton from '@/components/common/inputs/AddButton';
import { WorkflowModalContext } from '@/context/WorkflowModalContext';
import TableHead from '@/components/common/table/TableHead';
import TableRow from '@/components/common/table/TableRow';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import InfoBox, { InfoBoxType } from '@/components/common/InfoBox';
import { useAppDispatch } from '@/store';
import { workflowModalActions } from '@/store/modules/workflowModalSlice';
import FlagKoreaSq from '@/components/common/icons/FlagKoreaSq';
import FlagMongolSq from '@/components/common/icons/FlagMongolSq';
import { LangType, LanguageContext } from '@/context/LanguageContext';
import langFile from '@/lang';
import useModal from '@/hooks/useModal';
import useAlertModal from '@/hooks/useAlertModal';
import ConfirmAlertBox from '@/components/common/ConfirmAlertBox';
import CheckAlertbox from '@/components/common/CheckAlertBox';
import getTableRowMenuOptions from '@/utils/table';
import { convertTimeToStr } from '@/utils/date';
import dayjs from 'dayjs';
import getPatients, { getPatient } from '@/data/patient';
import getWorkflows, { deleteWorkflow, getWorkflow } from '@/data/workflow';
import { useAppSelector } from '@/store';
import { registWorkflow } from '../../../data/workflow';
import MyHead from '@/components/common/MyHead';
import Tab from '@/components/common/Tab';
import { getVideo, registVideo } from '@/data/video';
import VideoModal from '@/components/modal/VideoModal';

export default function DiagnosisPage() {
  const mounted = useRef(false);
  const { userInfo } = useAppSelector(({ user }) => user);
  const { edit } = useAppSelector(({ workflowModal }) => workflowModal);
  const { lang } = useContext(LanguageContext);
  const { openModal: openWorkflowModal } = useContext(WorkflowModalContext);
  const {
    ModalPortal: DeleteModalPortal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const { AlertModalPortal, openAlertModal, closeAlertModal } = useAlertModal();
  const selectedChart = useRef(0);

  const {
    ModalPortal: VideoModalPortal,
    openModal: openVideoModal,
    closeModal: closeVideoModal,
  } = useModal();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const dispatch = useAppDispatch();
  const [tableDropOptions, setTableDropOptions] = useState<TableMenuOption[]>(
    []
  );

  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  const [infoKeys, setInfoKeys] = useState(() => getInfoBoxHeadData(lang));

  const medicaltds = getTableMedicalHeadData(lang);
  const videotds = getTableVideoHeadData(lang);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('tab')) {
      router.push(`/workflow/diagnosis/${router.query.id}?tab=medical`);
    }
  }, [searchParams, router.query.id]);

  const openWorkflowModalHandler = (diagnosisId: number) => {
    if (patientInfo) {
      dispatch(workflowModalActions.setTabType('patient'));
      dispatch(
        workflowModalActions.manageChart({
          p_idx: patientInfo.p_idx,
          w_idx: diagnosisId,
        })
      );
      openWorkflowModal();
    }
  };

  const setChartIdAndOpenAlert = (type: string, chartId: number) => {
    selectedChart.current = chartId;
    openDeleteModal();
  };

  const deleteDiagnosis = async () => {
    const res = await deleteWorkflow(selectedChart.current);
    if (res === 'SUCCESS') {
      setDiagnosis((prev) =>
        prev.filter((d) => d.w_idx !== selectedChart.current)
      );
      closeDeleteModal();
      openAlertModal();
    } else {
      console.log('진료 삭제 실패');
    }
  };

  const addChart = async () => {
    if (!confirm(langFile[lang].WORKFLOW_CONFIRM_ADD_CHART)) {
      return;
    }
    if (!patientInfo) {
      console.error('환자 정보가 없습니다.');
      return;
    }

    const res = await registWorkflow(
      patientInfo.o_idx,
      patientInfo.p_idx,
      userInfo.u_idx
    );

    if (res.message === 'SUCCESS') {
      const w = await getWorkflow(res.w_idx);
      if (w !== 'ServerError') {
        setDiagnosis((prev) => [w, ...prev]);
        dispatch(
          workflowModalActions.addChart({
            w_idx: res.w_idx,
            p_idx: patientInfo.p_idx,
          })
        );
        openWorkflowModal();
        console.log('변경된 진료정보 불러오기 성공');
      } else {
        console.log('변경된 진료정보 불러오기 실패');
      }
    } else {
      console.log('진료 생성 실패');
    }
  };
  
  const addVideo = async () => {
    console.log('[addVideo] 함수 시작');
    if (!confirm(langFile[lang].VIDEO_MODAL_CONFIRM_ADD_VIDEO)) {
      console.log('[addVideo] 영상 등록 취소');
      return;
    }
    console.log('[addVideo] 영상 등록 확인');

    if (!patientInfo) {
      console.error('[addVideo] 환자 정보가 없습니다.');
      return;
    }
    console.log('[addVideo] patientInfo 확인:', patientInfo);

    console.log('[addVideo] registVideo 호출 전, p_idx:', patientInfo.p_idx);
    const res = await registVideo({
      di_hospital: '',
      di_doctor: '',
      di_date: null,
      di_memo: '',
      p_idx: patientInfo.p_idx,
    });
    console.log('[addVideo] registVideo 응답:', res);

    if (res.message === 'SUCCESS' && res.v_idx) {
      console.log('[addVideo] registVideo 성공, getVideo 호출 전, v_idx:', res.v_idx);
      const videoData = await getVideo(res.v_idx);
      console.log('[addVideo] getVideo 응답:', videoData);

      if (videoData !== 'ServerError') {
        setVideos((prev) => {
          const newState = [videoData, ...prev];
          console.log('[addVideo] setVideos 후 상태:', newState);
          return newState;
        });
        console.log('[addVideo] setSelectedVideo 호출 전, videoData:', videoData);
        setSelectedVideo(videoData);
        console.log('[addVideo] openVideoModal 호출 직전');
        openVideoModal();
        console.log('[addVideo] openVideoModal 호출 완료');
      } else {
        console.error('[addVideo] 등록된 영상 정보 불러오기 실패');
      }
    } else {
      console.error('[addVideo] 영상 생성 실패', res);
    }
  };

  const handleTabClick = (tab: string) => {
    router.push(`/workflow/diagnosis/${router.query.id}?tab=${tab}`);
  };

  useEffect(() => {
    if (!userInfo) return;

    let p_idx = router.query.id as string;
    if (Array.isArray(p_idx)) return;

    const fetchInfo = async () => {
      if (userInfo.country === 'korea') {
        const p = await getPatient(parseInt(p_idx));
        if (p === 'ServerError') {
          console.log('한국 > 환자정보 불러오기 실패');
        } else {
          if (p) {
            setPatientInfo(p);
          } 
          else {
            console.log('해당하는 환자 없음');
            return router.replace('/workflow');
          }
        }
      } 
      else {
        const res = await getPatients(userInfo.o_idx, {
          search: 'p_idx',
          search_key: p_idx,
        });

        if (res === 'ServerError') {
          console.log('몽골 > 환자정보 불러오기 실패 / 500');
        } else {
          if (res.length) {
            setPatientInfo(res[0]);
          } 
          else {
            console.log('소속되지 않은 환자');
            if (userInfo.p_idx) {
              return router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
            } else return router.replace('/workflow');
          }
        }
      }

      const w = await getWorkflows(parseInt(p_idx));
      if (w !== 'ServerError' && w.length) {
        setDiagnosis(w);
      } 
    };

    if (userInfo.p_idx && userInfo.p_idx !== parseInt(p_idx)) {
      router.replace(`/workflow/diagnosis/${userInfo.p_idx}`);
    } else {
      fetchInfo();
    }
  }, [userInfo, router.query.id]);

  useEffect(() => {
    const newInfoKeys = getInfoBoxHeadData(lang);
    setInfoKeys(newInfoKeys);
  }, [lang]);

  useEffect(() => {
    if (userInfo) {
      let { country, permission } = userInfo;
      let dropOptions = [];
      if (country === 'korea') {
        if (permission === 'admin') {
          dropOptions.push('remove');
        }
      }
      setTableDropOptions(dropOptions);
    }
  }, [userInfo]);

  const tabs = [
    { 
      tab: 'medical',
      text: langFile[lang].WORKFLOW_MENU_1, 
    },
    { 
      tab: 'video',
      text: langFile[lang].WORKFLOW_MENU_2, 
    }
  ];

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      (async () => {
        if(edit && edit[0]) {
          const res = await getWorkflow(edit[0]);
          if (res !== 'ServerError' && res) {
            const editedDiagnosis = diagnosis.map((d) =>
              d.w_idx === edit[0] ? { ...res } : d
            );
            setDiagnosis(editedDiagnosis);
            console.log('변경됨 > 변경된 진료 정보 불러오기');
          } else {
            console.log('변경된 진료목록 불러오기 실패');
          }
        }
      })();
    }
  }, [edit]);

  return (
    <div className="diagnosis-page page-contents">
      <MyHead subTitle="workflows" />

      <DeleteModalPortal>
        <ConfirmAlertBox
          handleClose={closeDeleteModal}
          title={langFile[lang].DELETE_WORKFLOW_ALERT_TITLE} 
          desc={langFile[lang].DELETE_WORKFLOW_ALERT_DESC} 
          iconType="remove"
          handleMainClick={deleteDiagnosis}
        />
      </DeleteModalPortal>

      <AlertModalPortal>
        <CheckAlertbox
          handleClose={closeAlertModal}
          title={langFile[lang].CP_DELETE_WORKFLOW_ALERT_TITLE} 
          desc={langFile[lang].CP_DELETE_WORKFLOW_ALERT_DESC} 
        />
      </AlertModalPortal>

      <VideoModalPortal>
        <VideoModal
          item={selectedVideo}
          closeModal={closeVideoModal}
          type={'manage'}
          onComplete={() => {
            closeVideoModal();
          }}
        />
      </VideoModalPortal>

      <InfoBox
        keys={infoKeys}
        data={
          patientInfo
            ? {
                p_name: patientInfo.u_name_eng,
                p_birthday: patientInfo.birthday
                  ? dayjs(patientInfo.birthday).format('YYYY-MM-DD')
                  : '-',
                sex: patientInfo.sex || '-',
                height: patientInfo.tall ? patientInfo.tall : '-',
                weibht: patientInfo.weight ? patientInfo.weight : '-',
                nurse: patientInfo.nurse_idx
                  ? lang === 'ko'
                    ? patientInfo.nurse_name_kor
                    : patientInfo.nurse_name_eng
                  : '-',
                phone: patientInfo.tel ? patientInfo.tel : '-',
                address: patientInfo.address ? patientInfo.address : '-',
              }
            : {}
        }
      ></InfoBox>

      <div className="controll-table-area flex justify-between">
        <div className="flex justify-end">
          <Tab handleClick={handleTabClick} tabs={tabs} />
        </div>
        <div className="controll-table-area-wrap">
          {userInfo && !userInfo.p_idx && searchParams.get('tab') === 'medical' ? (
            <AddButton
              text={langFile[lang].ADD_CHART_BUTTON_TEXT} 
              onClick={addChart}
            />
          ) : (
            searchParams.get('tab') === 'video' && (
              <AddButton
                text={langFile[lang].ADD_VIDEO_BUTTON_TEXT} 
                onClick={addVideo}
              />
            )
          )}
        </div>
      </div>
      { 
        searchParams.get('tab') === 'medical'? (
          <table className="w-full table">
          <TableHead tds={medicaltds} />
          <tbody>
            {diagnosis.map(
              ({
                w_idx,
                w_code,
                nurse1_idx,
                nurse1_name_eng,
                nurse1_name_kor,
                nurse2_idx,
                nurse2_name_eng,
                nurse2_name_kor,
                doctor1_idx,
                doctor1_name_eng,
                doctor1_name_kor,
                doctor2_idx,
                doctor2_name_kor,
                doctor2_name_eng,
                registdate_utc,
                update_registdate_utc,
              }) => (
                <TableRow<TableMenuOption>
                  key={w_idx}
                  handleClick={() => openWorkflowModalHandler(w_idx)}
                  buttonText={langFile[lang].CHART_TABLE_BUTTON_TEXT} 
                  onClickMenu={(type) => {
                    setChartIdAndOpenAlert(type, w_idx);
                  }} 
                  tableRowOptionType={tableDropOptions}
                  lang={lang}
                >
                  <td>{w_code}</td>
                  <td>
                    {nurse2_idx
                      ? lang === 'en'
                        ? nurse2_name_eng
                        : nurse2_name_kor
                      : '-'}
                  </td>
                  <td>
                    {nurse1_idx
                      ? lang === 'en'
                        ? nurse1_name_eng
                        : nurse1_name_kor
                      : '-'}
                  </td>
                  <td>
                    {doctor2_idx
                      ? lang === 'en'
                        ? doctor2_name_eng
                        : doctor2_name_kor
                      : '-'}
                  </td>
                  <td>
                    {doctor1_idx
                      ? lang === 'en'
                        ? doctor1_name_eng
                        : doctor1_name_kor
                      : '-'}
                  </td>
                  <td>
                    {update_registdate_utc
                      ? convertTimeToStr(
                          userInfo?.country,
                          new Date(update_registdate_utc + ' UTC').toISOString(),
                          '.'
                        )
                      : '-'}
                  </td>
                  <td>
                    {convertTimeToStr(
                      userInfo?.country,
                      new Date(registdate_utc + ' UTC').toISOString(),
                      '.'
                    )}
                  </td>
                </TableRow>
              )
            )}
          </tbody>
        </table>
        ): (
          <table className="w-full table">
          <TableHead tds={videotds} />
          <tbody>
            {videos.map(
              ({
                v_idx,
                gubun,
                di_hospital,
                di_doctor,
                di_memo,
                di_date,
              }) => (
                <TableRow<TableMenuOption>
                  key={v_idx}
                  handleClick={() => {
                    const currentVideo = videos.find(v => v.v_idx === v_idx);
                    if (currentVideo) {
                      setSelectedVideo(currentVideo);
                      openVideoModal();
                    }
                  }}
                  buttonText={langFile[lang].CHART_VIDEO_BUTTON_TEXT}
                  onClickMenu={(type) => {
                    console.log('Video menu click:', type, v_idx);
                  }}
                  lang={lang}
                >
                  <td>{v_idx}</td> 
                  <td>{gubun || '-'}</td>
                  <td>{di_hospital || '-'}</td>
                  <td>{di_doctor || '-'}</td>
                  <td>{di_memo || '-'}</td>
                  <td>{di_date ? dayjs(di_date).format('YYYY-MM-DD') : '-'}</td>
                  <td>
                    {di_date ? dayjs(di_date).format('YYYY-MM-DD') : '-'}
                  </td>
                </TableRow>
              )
            )}
          </tbody>
        </table>
        )
      }
    </div>
  );
}

DiagnosisPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function getTableMedicalHeadData(lang: LangType) {
  const medicaltds: TableHeadCol[] = [
    {
      key: langFile[lang].CHART_NUMBER_TEXT, 
      valueType: 'id',
      type: 'text',
    },
    {
      icon: <FlagKoreaSq />,
      key: langFile[lang].CHART_NURSE_TEXT, 
      valueType: 'name',
      type: 'text',
    },
    {
      icon: <FlagMongolSq />,
      key: langFile[lang].CHART_NURSE_TEXT, 
      valueType: 'localName',
      type: 'text',
    },
    {
      icon: <FlagKoreaSq />,
      key: langFile[lang].CHART_DOCTOR_TEXT, 
      valueType: 'name',
      type: 'text',
    },
    {
      icon: <FlagMongolSq />,
      key: langFile[lang].CHART_DOCTOR_TEXT, 
      valueType: 'localName',
      type: 'text',
    },

    {
      key: langFile[lang].CHART_RECENT_UPDATE_TEXT, 
      valueType: 'date',
      type: 'text',
    },
    {
      key: langFile[lang].CHART_REGISTER_DATE_TEXT, 
      valueType: 'date',
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

  return medicaltds;
}

function getTableVideoHeadData(lang: LangType) {
  const videotds: TableHeadCol[] = [
    {
      key: langFile[lang].VIDEO_NUM_TEXT, 
      valueType: 'id',
      type: 'text',
    },
    {
      key: langFile[lang].VIDEO_SEP_TEXT, 
      valueType: 'sep',
      type: 'text',
    },
    {
      key: langFile[lang].VIDEO_HOS_NAME_TEXT, 
      valueType: 'name',
      type: 'text',
    },
    {
      key: langFile[lang].VIDEO_DOCTOR_TEXT, 
      valueType: 'name',
      type: 'text',
    },
    {
      key: langFile[lang].VIDEO_MEMO_TEXT, 
      valueType: 'title',
      type: 'text',
    },
    {
      key: langFile[lang].VIDEO_SHOOTING_DATE_TEXT, 
      valueType: 'date',
      type: 'text',
    },
    {
      key: langFile[lang].VIDEO_CREATED_DATE_TEXT, 
      valueType: 'date',
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

  return videotds;
}

function getInfoBoxHeadData(lang: LangType) {
  const INFO_KEYS: InfoBoxType[] = [
    {
      iconType: 'patient',
      title: langFile[lang].PATIENT_SEARCH_PT_NAME_TEXT, 
    },
    {
      iconType: 'calendar',
      title: langFile[lang].WORKFLOW_MODAL_PT_BIRTH, 
    },
    {
      iconType: 'gender',
      title: langFile[lang].PATIENT_MODAL_SEX_TEXT, 
    },
    {
      iconType: 'height',
      title: langFile[lang].CHART_INFO_BOX_PT_HEIGHT, 
    },
    {
      iconType: 'weight',
      title: langFile[lang].CHART_INFO_BOX_PT_WEIGHT, 
    },
    {
      defaultIcon: <FlagMongolSq />,
      iconType: 'nurse',
      title: langFile[lang].CHART_INFO_BOX_PT_NURSE_IN_CHARGE, 
    },
    {
      iconType: 'phone',
      title: langFile[lang].PATIENT_TEL_TEXT, 
    },
    {
      iconType: 'address',
      title: langFile[lang].PATIENT_ADDRESS_TEXT, 
    },
  ];

  return INFO_KEYS;
}
