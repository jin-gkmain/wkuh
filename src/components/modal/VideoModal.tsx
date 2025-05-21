import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import DropFileInput from '../common/inputs/DropFileInput';
import ModalFrame from '../modal/ModalFrame';
import DateInput, { Value } from '../common/inputs/DateInput';
import SelectInput from '../common/inputs/SelectInput';
import FlagKoreaSq from '../common/icons/FlagKoreaSq';
import langFile from '@/lang';
import { LangType, LanguageContext } from '@/context/LanguageContext';
import Select from '../common/inputs/Select';
import dayjs from 'dayjs';
import { useAppSelector } from '@/store';
import { editOrg, registOrg } from '@/data/org';
import getFiles, { deleteFile, uploadFiles } from '@/data/file';
import getVideoFiles, { uploadVideoFiles } from '@/data/video_file';
import { editVideo, registVideo } from '@/data/video';
import { getPatient } from '@/data/patient';

type Props = {
  item: Video | null;
  closeModal: () => void;
  type: ModalType;
  onComplete: (data?: any) => void;
};


function VideoModalBox({ closeModal, type, onComplete, item }: Props) {
  const { userInfo } = useAppSelector(({ user }) => user);
  const { lang } = useContext(LanguageContext);

  const [modalInfo, setModalInfo] = useState<VideoModal>({
    video: {
      v_idx: 0,
      p_idx: 0,
      di_hospital: '',
      di_doctor: '',
      di_date: null,
      di_memo: '',
      gubun: '',
      videos: [],
    },
    patient: {
      p_idx: 0,
      o_idx: 0, 
      nurse_idx: null,
      p_chart_no: null, 
      u_name_eng: '', 
      sex: '', 
      birthday: '', 
      weight: '', 
      tall: '', 
      tel: '', 
      address: '', 
      note: '', 
      registdate_locale: new Date(), 
      registdate_utc: new Date(), 
      visit_paths: '', 
      p_serial_no: '', 
    
      nurse_name_eng: '',
      nurse_name_kor: '',
      p_email: '',
      p_id: '',
    },
  });
  const [inputAlert, setInputAlert] = useState({
    di_hospital: false,
    di_doctor: false,
    di_date: false,
    di_memo: false,
    gubun: false,
  });
  const [videos, setVideos] = useState<File[] | VideoFile[]>([]);

  const isSavedFile = (file: File | VideoFile): file is VideoFile => {
    return (file as VideoFile).f_idx !== undefined;
  };

  const handleRemove = async (id: string) => {
    if (isSavedFile(videos[0])) {
      const res = await deleteFile(parseInt(id));
      if (res === 'SUCCESS') {
        setVideos((prev) =>
          (prev as VideoFile[]).filter((file) => file.f_idx.toString() !== id)
        );
      } else {
        console.log('파일 삭제 실패');
      }
    } else {
      setVideos((prev) => (prev as File[]).filter((file) => file.name !== id));
    }
  };

  // 파일 설정
  const setSelectedFiles = async (acceptedFiles: File[]) => {
    if (type === 'manage') {
      const formData = getFormDataWithFiles(acceptedFiles);
      const res = await uploadVideoFiles(
        formData,
        modalInfo.video.v_idx,
      );
      if (res === 'SUCCESS') {
        const res = await getVideoFiles(modalInfo.video.v_idx);
        if (res !== 'ServerError') {
          setVideos(res);
        }
      }
    } else {
      if (!videos.length || !isSavedFile(videos[0])) {
        setVideos((prev) => [...(prev as File[]), ...acceptedFiles]);
      }
    }
  };

  // 날짜 선택
  const getDates = useCallback((dates: Value) => {
    if (Array.isArray(dates)) {
      setModalInfo((prev) => ({
        ...prev,
        contract_sd: dayjs(dates[0]!).format('YYYY.MM.DD'),
        contract_ed: dayjs(dates[1]!).format('YYYY.MM.DD'),
      }));
    }
  }, []);

  // 모달 필수항목 확인
  const checkRequirements = (keys: Array<keyof Video>) => {
    let submitable = true;
    keys.forEach((k) => {
      let val =
        typeof modalInfo[k] === 'string' ? modalInfo[k].trim() : modalInfo[k];

      if (!val) {
        setInputAlert((prev) => ({ ...prev, [k]: true }));
        submitable = false;
      } else {
        setInputAlert((prev) => ({ ...prev, [k]: false }));
      }
    });

    return submitable;
  };

  // 전달받은 인자를 토대로 formData를 생성해 반환
  const getFormDataWithFiles = (acceptedFiles: (VideoFile | File)[]) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      if (!('f_idx' in file)) {
        formData.append('files', file);
      }
    });

    return formData;
  };

  // 기관 등록, 수정
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const {
      video: {
        v_idx,
        p_idx,
        di_hospital,
        di_doctor,
        di_date,
        di_memo,
        gubun,
      }
    } = modalInfo;

    let submitable = checkRequirements([
      'di_hospital',
      'di_doctor',
      'di_date',
      'di_memo',
      'gubun',
    ]);

    if (!submitable) return;

    // 비디오 등록 모달에서 submit 한 경우
    let body: any = {
      v_idx,
      p_idx,
      di_hospital,
      di_doctor,
      di_date,
      di_memo,
      gubun,
    };


    const data = await registVideo(body);
    if (data.message === 'SUCCESS') {
      const formData = getFormDataWithFiles(videos);
      const res = await uploadVideoFiles(
        formData,
        data.v_idx,
      );
      if (res === 'SUCCESS') {
        onComplete();
      } else {
        console.log('비디오 등록은 성공했는데, 파일 업로드에 실패한 경우');
      }
    } else {
      console.log('비디오 등록 실패');
    }
  };


  // input onChange시 변경된 값 반영
  const handleOnChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;
    const { name, value } = target;
    setModalInfo((prev) => ({ ...prev, [name]: value }));
  };


  // 기관수정의 경우 page에서 props로 기관 정보를 받아와 초기 설정
  useEffect(() => {
    const patient = getPatient(item?.p_idx).then((patient) => {
      if (patient != 'ServerError') {
        setModalInfo({
          video: item,
          patient: patient,
        });
      } else {
        console.log('환자 정보 불러오기 실패');
      }
    });
  }, [item]);

  return (
    <div className="org-modal-box">
      <ModalFrame
        title={
            langFile[lang].VIDEO_MODAL_TITLE_TEXT
        }
        completeBtnText={
          lang !== 'ko' ? langFile[lang].VIDEO_MODAL_COMPLETE_BUTTON_TEXT : ''
        }
        onClose={closeModal}
        onComplete={handleSubmit}
      >
        <div className="input-col-wrap">
          <div className="input-row-wrap">
            <section className="flex-1 input-col-wrap">
              <div className="input-col-wrap">
                <label htmlFor="u_name_eng" className="label">
                  *{langFile[lang].WORKFLOW_MODAL_PT_NAME}
                  {/* 환자명 */}
                </label>
                <input
                  autoComplete="off"
                  value={modalInfo.patient.u_name_eng!}
                  onChange={handleOnChange}
                  type="text"
                  className="input-disabled"
                  id="u_name_eng"
                  name="u_name_eng"
                />
              </div>

              <div className="input-col-wrap">
                <span className="label">
                  *{langFile[lang].WORKFLOW_MODAL_PT_BIRTH}
                  {/* 생년월일 */}
                </span>
                <div className="input input-disabled">
                  {modalInfo.patient.birthday}
                </div>
              </div>

              <div className="input-col-wrap">
                <label htmlFor="sex" className="label">
                  {langFile[lang].WORKFLOW_MODAL_PT_GENDER}
                  {/* 성별 */}
                </label>
                <div className="input input-disabled">
                  {modalInfo.patient.sex}
                </div>
              </div>

              <div className="input-col-wrap">
                <label htmlFor="tell" className="label">
                  *{langFile[lang].WORKFLOW_MODAL_PT_TEL}
                  {/* 연락처 */}
                </label>
                <div className="input input-disabled">
                  {modalInfo.patient.tel}
                </div>
              </div>

              <div className="input-col-wrap">
                <span className="label flex gap-3 align-center">
                  <FlagKoreaSq />*{langFile[lang].WORKFLOW_MODAL_PT_HEIGHT}
                  {/* 키 */}
                </span>
                <div className="input input-disabled">
                  {modalInfo.patient.tall}
                </div>
              </div>
            </section>

            <section className="flex-1 input-col-wrap">
              <div className="input-col-wrap">
                <label htmlFor="o_name_eng" className="label">
                  {langFile[lang].WORKFLOW_MODAL_PT_WEIGHT}
                  {/* 몸무게 */}
                </label>  
                <div className="input input-disabled">
                  {modalInfo.patient.weight}
                </div>
              </div>
            </section>
          </div>

          <div className="input-col-wrap upload-area">
            <label className="label" htmlFor="note">
              {langFile[lang].ORG_MODAL_MEMO_TEXT}
              {/* 메모 */}
            </label>
            <input
              autoComplete="off"
              type="text"
              name="note"
              id="note"
              className="input"
              value={modalInfo.video.di_memo || ''}
              onChange={handleOnChange}
            />
          </div>

          <div className="input-col-wrap upload-area">
            <p className="label">
              {langFile[lang].ORG_MODAL_ATTACH_CONTRACT_FILE}
              {/* 계약서 파일 첨부 */}
            </p>

            <DropFileInput
              labelText={true}
              files={new Array<File>().concat(videos as File[])}
              setFiles={setSelectedFiles}
              onRemove={handleRemove}
              type="pdf"
            />
          </div>
        </div>
      </ModalFrame>
    </div>
  );
}

export default React.memo(VideoModalBox);

