import { LanguageContext } from '@/context/LanguageContext';
import { getAllUsers, getUsersByOIdx } from '@/data/users';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import langFile from '@/lang';

type Props = {
  o_idx?: number;
  setSelectedPerson: (id: number) => void;
  value: number;
};

export default function SearchUserSelect({
  setSelectedPerson,
  value,
  o_idx,
}: Props) {
  const { lang } = useContext(LanguageContext);
  const [users, setUsers] = useState<User[] | null>(null);

  const handleOnChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPerson(parseInt(ev.target.value));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsersByOIdx(o_idx);
      if (res !== 'ServerError' && res) {
        const mapped = res.filter(
          (u) => u.job === 'doctor' || u.job === 'nurse'
        );
        setUsers(mapped);
      }
    };

    fetchUsers();
  }, []);
  return (
    <>
      <select onChange={handleOnChange} value={value} className="select-box">
        <option disabled value={'0'}>
          {
            langFile[lang]
              .APPOINTMENTS_SEARCH_CONTENT_MEDICAL_STAFF_SELECT_DEFAULT
          }
          {/* 의료진을 선택하세요 */}
        </option>
        {users &&
          users.map((u) => (
            <option value={u.u_idx} key={u.u_idx}>
              {lang === 'ko' ? u.u_name_kor || '-' : u.u_name_eng || '-'}
            </option>
          ))}
      </select>
    </>
  );
}
