import React, { memo } from 'react'
import { Value } from '@/types/dateType';
import Calendar from "react-calendar"
import Image from 'next/image';

const CalendarComponent = ({
    dateChange,
    setDateChange,
    setCalendarOpen,
    calendarOpen,
    styles,
    minDate,
    setDateChangeForFilter
}: {
    dateChange: Value | string,
    setDateChange: (arg: Value) => void,
    setCalendarOpen: (arg: boolean) => void,
    calendarOpen: boolean,
    styles?: string,
    minDate?: undefined | Date,
    setDateChangeForFilter?: (date: Value | string)=> void | undefined 
}) => {

    // customer weekday format
    const formatShortWeekday = (_: unknown, date: Date) => {
        const weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return weekdayNames[date.getDay()];
    };

    return <div className={`absolute w-[350px] left-[0px] ${calendarOpen ? 'block' : 'hidden'} ${styles || ''}`}>
        <span role="button" onClick={() => setCalendarOpen(false)} className="absolute bg-red-700 p-2 z-[9] rounded-[50%] cursor-pointer top-[27px] left-[auto] right-[-12px]">
            <Image width={30} height={30} src="/icons/close.png" alt="close icon" className="max-w-[12px]" />
        </span>
        <Calendar
            onChange={(date, e) => {
                e.stopPropagation()
                setDateChange(date)
                if(setDateChangeForFilter) setDateChangeForFilter(date)                
            }}
            formatShortWeekday={formatShortWeekday}
            value={dateChange}
            prev2Label={null}
            next2Label={null}
            minDate={minDate}
        />
    </div>
}

export default memo(CalendarComponent)