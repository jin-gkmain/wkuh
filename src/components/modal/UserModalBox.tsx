import React, {
  ChangeEvent,
  FormEvent,
  useRef,
  useContext,
  useEffect,
  useState,
} from 'react';
import ModalFrame from '../modal/ModalFrame';
import Select from '../common/inputs/Select';
import langFile from '@/lang';
import { LangType, LanguageContext } from '@/context/LanguageContext';
import instance from '@/utils/myAxios';
import { editUser, registUser } from '@/data/users';
import CheckDuplicateInput from '../common/inputs/CheckDuplicateInput';

type Props = {
  regist_u_idx?: number;
  org: Organization;
  userData?: User | null;
  onComplete: (data?: any) => void;
  closeModal: () => void;
  type: ModalType;
};

export default function UserModalBox({
  regist_u_idx,
  org,
  closeModal,
  type,
  onComplete,
  userData,
}: Props) {
  const { lang } = useContext(LanguageContext);
  const permissionOptions = getPermissionOptions(lang);

  const [user, setUser] = useState<UserModal>({
    u_idx: 0,
    o_idx: 0,
    u_code: '',
    p_idx: 0,
    u_name_kor: '',
    u_name_eng: '',
    u_id: '',
    tel: '',
    permission: permissionOptions[0].value,
    job: 'doctor',
    note: '',
  });
  const jobOptions = getJobOptions(lang, user.job);
  const [idDuplicated, setIdDuplicated] = useState<
    'ready' | 'success' | 'duplicated'
  >('ready');
  const [idAlert, setIdAlert] = useState(false);
  const userId = useRef('');

  // SelectInput 값 설정
  function setSelectedValue<SelectType>(
    selected: string,
    selectType: SelectType
  ) {
    if (selectType === 'job') setUser((prev) => ({ ...prev, job: selected }));
    else if (selectType === 'permission')
      setUser((prev) => ({ ...prev, permission: selected }));
  }

  // 사용자 수정, 등록
  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    const {
      u_idx,
      u_code,
      u_name_eng,
      u_name_kor,
      u_id,
      tel,
      permission,
      job,
      note,
    } = user;

    if (!u_id.trim().length || idDuplicated !== 'success') {
      if (
        !(
          idDuplicated === 'ready' &&
          type === 'manage' &&
          userId.current === user.u_id
        )
      ) {
        return setIdAlert(true);
      }
    }

    let body: any = {
      u_code,
      u_name_eng,
      u_name_kor,
      u_id: u_id + org.domain,
      tel,
      permission,
      job,
      note,
      country: org.country,
    };

    // 시용자 등록 모달에서 submit 한 경우
    if (type === 'new') {
      // body.u_code = `${org.o_code}_U_018`; // 자동 생성전 임시코드
      body.u_pwd = body.u_id;

      const res = await registUser(org.o_idx, regist_u_idx, body);
      if (res === 'SUCCESS') {
        onComplete();
      } else {
        console.log('사용자 등록 실패');
      }
    }
    // 사용자 관리 모달에서 submit 한 경우
    else if (type === 'manage') {
      const res = await editUser(u_idx, body);
      if (res === 'SUCCESS') {
        onComplete({ ...user, u_id: u_id + org.domain });
      } else {
        console.log('사용자 정보 수정 실패');
      }
    }
  };

  // input 값 update
  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    console.log('===');
    const target = ev.target;
    let { name, value } = target;

    if (name === 'u_id') {
      if (idDuplicated === 'success') {
        setIdDuplicated('ready');
        setIdAlert(false);
      } else if (idDuplicated === 'duplicated') {
        if (userId.current === value) {
          setIdDuplicated('ready');
          setIdAlert(false);
        }
      }
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // 아이디 중복체크
  const checkIdDuplicated = async () => {
    try {
      const res = await instance.post('/id_duplicate', {
        u_id: `${user.u_id}${org.domain}`,
      });

      const data: MyResponse<'USABLE' | 'DUPLICATE'> = res.data;
      if (data.result === 'USABLE') {
        setIdDuplicated('success');
        setIdAlert(true);
      } else {
        setIdDuplicated('duplicated');
        setIdAlert(true);
        alert(langFile[lang].USER_ALERT_DUPLICATED_ID); // 중복되는 아이디 입니다.
      }
    } catch (err) {
      console.log('아이디 중복확인 에러 / 500');
    }
  };

  // 사용자 관리시 선택한 사용자 정보 초기 설정
  useEffect(() => {
    if (userData) {
      setUser({
        ...userData,
        u_id: userData.u_id.slice(0, userData.u_id.lastIndexOf('@')),
      });
      userId.current = userData.u_id.slice(0, userData.u_id.lastIndexOf('@'));
    } else {
      setUser((prev) => ({ ...prev, o_idx: org.o_idx }));
    }
  }, []);

  return (
    <div className="user-modal-box">
      <ModalFrame
        title={
          type === 'new'
            ? langFile[lang].USER_MODAL_NEW_TITLE_TEXT // 사용자 등록
            : langFile[lang].USER_MODAL_MANAGE_TITLE_TEXT // 사용자 정보 수정
        }
        completeBtnText={
          lang !== 'ko' ? langFile[lang].USER_MODAL_COMPLETE_BUTTON_TEXT : ''
        }
        onClose={closeModal}
        onComplete={handleSubmit}
      >
        <div className="flex flex-col">
          <div className="flex flex-col gap-10">
            <div className="input-row-wrap">
              <section className="flex-1 flex flex-col gap-10">
                <div className="flex flex-col gap-10">
                  <label htmlFor="u_name_eng" className="label">
                    {langFile[lang].USER_MODAL_USER_NAME_EN_TEXT}
                    {/* 사용자명(영문) */}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="input"
                    id="u_name_eng"
                    name="u_name_eng"
                    onChange={handleInputChange}
                    value={user.u_name_eng || ''}
                  />
                </div>

                <div className="flex flex-col gap-10">
                  <label htmlFor="u_id" className="label">
                    *{langFile[lang].USER_EMAIL_TEXT}
                    {/* 이메일(ID) */}
                  </label>
                  <div className="w-full flex">
                    <CheckDuplicateInput
                      disabled={type === 'manage'}
                      name="u_id"
                      alert={idAlert}
                      alertType={
                        idDuplicated === 'success' ? 'success' : 'fail'
                      }
                      checkDuplicate={checkIdDuplicated}
                      value={user.u_id}
                      handleInputChange={handleInputChange}
                      alertText=""
                    >
                      <span className="o-code">
                        {org?.domain ? org.domain : ''}
                      </span>
                    </CheckDuplicateInput>
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  <span className="label">
                    {langFile[lang].USER_PERMISSION_TEXT}
                    {/* 권한 */}
                  </span>
                  <Select
                    disabled={user.job === 'admin' || user.job === 'patient'}
                    selected={user.permission}
                    options={permissionOptions}
                    setSelected={setSelectedValue}
                    selectType="permission"
                  />
                </div>
              </section>

              <section className="flex-1 flex flex-col gap-10">
                <div className="flex flex-col gap-10">
                  <label htmlFor="u_name_kor" className="label">
                    {langFile[lang].USER_MODAL_USER_NAME_KO_TEXT}
                    {/* 사용자명(국문) */}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="input"
                    id="u_name_kor"
                    name="u_name_kor"
                    onChange={handleInputChange}
                    value={user.u_name_kor || ''}
                  />
                </div>

                <div className="flex flex-col gap-10">
                  <label htmlFor="tel" className="label">
                    {langFile[lang].USER_TEL_TEXT}
                    {/* 연락처 */}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className="input"
                    id="tel"
                    name="tel"
                    onChange={handleInputChange}
                    value={user.tel || ''}
                  />
                </div>

                <div className="flex flex-col gap-10">
                  <span className="label">
                    {langFile[lang].USER_JOB_TEXT}
                    {/* 직무 */}
                  </span>
                  <Select
                    disabled={user.job === 'patient' || user.job === 'admin'}
                    selected={user.job}
                    options={jobOptions}
                    setSelected={setSelectedValue}
                    selectType="job"
                  />
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-10">
              <label htmlFor="note" className="label">
                {langFile[lang].ORG_MODAL_MEMO_TEXT}
                {/* 메모 */}
              </label>
              <input
                autoComplete="off"
                type="text"
                name="note"
                id="note"
                className="input"
                onChange={handleInputChange}
                value={user.note || ''}
              />
            </div>
          </div>
        </div>
      </ModalFrame>
    </div>
  );
}

function getPermissionOptions(lang: LangType) {
  return [
    {
      key: langFile[lang].USER_MODAL_USER_PERMISSION1, // 관리자
      value: 'admin',
    },
    {
      key: langFile[lang].USER_MODAL_USER_PERMISSION2, // 일반
      value: 'user',
    },
  ];
}

function getJobOptions(lang: LangType, job: string) {
  const jobList = [
    {
      key: langFile[lang].USER_MODAL_USER_JOB1, // 간호사
      value: 'nurse',
    },
    {
      key: langFile[lang].USER_MODAL_USER_JOB2, //의사
      value: 'doctor',
    },
    {
      key: langFile[lang].USER_MODAL_USER_JOB3, //통역사
      value: 'interpreter',
    },
    {
      key: langFile[lang].USER_MODAL_USER_JOB4, // 기타
      value: 'ect',
    },
  ];

  if (job === 'patient' || job === 'admin') {
    jobList.push(
      {
        key: langFile[lang].USER_MODAL_USER_JOB5, // 환자
        value: 'patient',
      },
      {
        key: langFile[lang].USER_MODAL_USER_JOB6, // 관리자
        value: 'admin',
      }
    );
  }
  console.log('job > ', job);
  return jobList;
}
