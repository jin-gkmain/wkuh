import React, { useEffect, useRef, useState } from 'react';
import CalendarIcon from '../icons/Calendar';
import dynamic from 'next/dynamic';
import 'react-calendar/dist/Calendar.css';
import { getDateToStr } from '@/utils/date';
import { OnArgs } from 'react-calendar';

type Props = {
  value: Value;
  disabled?: boolean;
  range: boolean;
  onComplete: (dates: Value) => void;
};

const SmallCalendar = dynamic(() => import('react-calendar'), { ssr: false });

type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DateInput({
  value: defaultValue,
  range,
  disabled,
  onComplete,
}: Props) {
  const [calendar, setCalendar] = useState(false);
  const calendarRef = useRef<null | HTMLDivElement>(null);
  const [dateStr, setDateStr] = useState('');
  const [view, setView] = useState<'year' | 'month' | 'year' | 'century' | 'decade'>('month');

  const controllCalendar = () => {
    if (disabled) return;
    setCalendar(!calendar);
  };

  const handleOutsideClick = (ev: MouseEvent) => {  
    const target = ev.target as HTMLElement;

    if (calendarRef.current && !calendarRef.current.contains(target)) { 
      // if(target.tagName !== 'ABBR' && !target.className?.includes('react-calendar')) { 
      //   setCalendar(false);
      // }
      if(target.tagName === 'ABBR' || (typeof target.className === 'string' && target.className?.includes('react-calendar'))) {
        return ;
      }

      setCalendar(false);
    }
  };

  const handleChangeCalendar = (ev: Value) => {
    onComplete(ev);
    setCalendar(false);
  };

  const handleViewChange = (ev: OnArgs) => {
    setView(ev.view);
  }

  // const handleActiveStartDateChange = ({ activeStartDate }) => {
  //   onComplete(activeStartDate);
  // };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!defaultValue) {
      setDateStr('');
    } else {
      if (Array.isArray(defaultValue)) {
        if (defaultValue[0]) {
          setDateStr(getDateToStr(defaultValue, '.'));
        } else {
          setDateStr('');
        }
      } else {
        setDateStr(getDateToStr(defaultValue, '.'));
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    if(calendar) setView('month');
  },[calendar]);

  return (
    <div
      className={`${
        disabled ? 'input-disabled' : ''
      } input flex align-center date-input`}
      ref={calendarRef}
    >
      <div
        className="flex justify-between align-center w-full h-full"
        onClick={controllCalendar}
      >
        <span className="flex-1 justify-start" onClick={controllCalendar}>
          {dateStr}
        </span>
        <CalendarIcon className="icon-medium" />
      </div>

      <div className="calendar-wrap">
        {calendar && (
          <SmallCalendar
            view={view}
            onViewChange={handleViewChange}
            selectRange={range}
            onChange={handleChangeCalendar}
            value={defaultValue}
            locale="en"
          />
        )}
      </div>
    </div>
  );
}
