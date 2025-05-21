import React, { ReactNode } from 'react';
import DoctorChart from './icons/DoctorChart';
import Patient from './icons/Patient';
import Location from './icons/Location';
import Calendar from './icons/Calendar';
import Gender from './icons/Gender';
import Height from './icons/Height';
import Weight from './icons/Weight';
import Nurse from './icons/Nurse';
import Phone from './icons/Phone';
import Hospitals from './icons/Hospitals';
import Email from './icons/Email';
import User from './icons/User';
import Qr from './icons/Qr'

export type InfoBoxIconType =
  | 'patient'
  | 'calendar'
  | 'gender'
  | 'height'
  | 'weight'
  | 'nurse'
  | 'phone'
  | 'address'
  | 'organization'
  | 'user'
  | 'chart'
  | 'mail'
  | 'qr';

export type InfoBoxType = {
  defaultIcon?: ReactNode;
  iconType: InfoBoxIconType;
  title: string;
  onDownload?: (value: any) => void;
};

type Props<T> = {
  keys: InfoBoxType[];
  data?: { [key: string]: string | number | null };
};

export default function InfoBox<T>({ keys, data }: Props<T>) {
  const keysArr = keys.map((keyObj) => {
    switch (keyObj.iconType) {
      case 'patient':
        return { ...keyObj, icon: <Patient /> };
      case 'calendar':
        return { ...keyObj, icon: <Calendar /> };
      case 'gender':
        return { ...keyObj, icon: <Gender /> };
      case 'height':
        return { ...keyObj, icon: <Height /> };
      case 'weight':
        return { ...keyObj, icon: <Weight /> };
      case 'nurse':
        return { ...keyObj, icon: <Nurse /> };
      case 'phone':
        return { ...keyObj, icon: <Phone /> };
      case 'address':
        return { ...keyObj, icon: <Location /> };
      case 'organization':
        return { ...keyObj, icon: <Hospitals /> };
      case 'mail':
        return { ...keyObj, icon: <Email /> };
      case 'user':
        return { ...keyObj, icon: <User /> };
      case 'qr':
        return { ...keyObj, icon: <Qr /> };
      default:
        return { ...keyObj, icon: <DoctorChart /> };
    }
  });
  return (
    <div className="info-box">
      {keysArr.map(({ title, icon, defaultIcon, onDownload }, idx) => {
        const value = data ? Object.values(data)[idx] : null;
        const key = data ? Object.keys(data)[idx] : '';
        
        return (
          <div key={title} className="info-item flex flex-col justify-between">
            <span className="flex gap-5 align-center">
              {icon} {defaultIcon && defaultIcon} {title}
            </span>

            <div className="flex items-center">
              {(onDownload && key === 'qr_code' && value) ? (
                <button 
                  onClick={() => onDownload(value)}
                  className="primary-btn flex align-center font-semi-bold"
                  style={{
                    padding:'5px 10px',
                    fontSize:'12px'
                  }}
                >
                  다운로드
                </button>
              ) : <span>{value ?? '-'}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
