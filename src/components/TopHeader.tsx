import React, { memo, useEffect, useRef, useState, useImperativeHandle, forwardRef, Ref } from 'react'
import CalendarComponent from '@components/CalendarComponent'
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import { CreateDateResetType, CreateResetType, Value } from '@/types/dateType';
import BookAppointmentForm from '@components/BookAppointmentForm';
import Image from 'next/image';


const TopHeader = forwardRef(({
    setRender,
    setFilters,
    filters,
    pillDisabled
}: {
    setRender: (arg: boolean) => void,
    setFilters: (arg: Record<string, string>) => void,
    filters: Record<string, string>,
    pillDisabled: boolean
}, ref: Ref<CreateDateResetType | null>) => {
    const bookingFormRef = useRef<CreateResetType | null>(null)
    const [dateChange, setDateChange] = useState<Value | string>(new Date());
    const [dateChangeForFilter, setDateChangeForFilter] = useState<Value | string>('');
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false)
    const [openForm, setOpenForm] = useState(false)

    useEffect(() => {
        if (dateChangeForFilter) {
            setFilters({
                ...filters,
                date: dateChangeForFilter ? dayjs(dateChangeForFilter?.toString()).format('MM-DD-YYYY') : ''
            })
        }
    }, [dateChangeForFilter, setFilters])

    // to reset date via parent
    useImperativeHandle(ref, () => ({
        setDateChange: setDateChange,
    }))

    return (
        <div className='bg-[#151515] hide-scrollbar py-5 md:py-6 md:px-6 lg:flex items-center justify-between sticky top-0 z-[5] px-3 md:px-8'>
            {/* <div className='bg-[#151515] overflow-x-scroll md:overflow-x-auto lg:overflow-x-[visible] hide-scrollbar py-5 md:py-6 md:px-6 flex items-center justify-between sticky top-0 z-[5] px-3 md:px-8'> */}

            {/* for mobile view */}
            <span className='flex justify-around flex-end items-center w-full lg:hidden'>
                <span className='flex flex-col items-center'>
                    <Image onClick={() => { if (!openForm && !pillDisabled) setCalendarOpen(!calendarOpen) }} role="button" tabIndex={0} width={18} height={18} title="Filter by date" src="/icons/calendar.png" alt="calendar icon" />
                    <small className='inline-block mt-2 text-[9px] md:text-xs lg:text-md'>
                        {dayjs((dateChange)?.toString()).format("ddd D, MMMM")}
                    </small>
                </span>
                <span className='flex flex-col items-center'>
                    <Image
                        onClick={() => {
                            if (!calendarOpen && !pillDisabled) {
                                setOpenForm(!openForm)
                            }
                            if (!calendarOpen && openForm) {
                                bookingFormRef?.current?.handleResetForm()
                            }
                        }}
                        role="button" tabIndex={0} width={18} height={18} title="Book Your Appointment" src="/icons/appointment.png" alt="Appointment icon" />
                    <small className='inline-block mt-2 text-[9px] md:text-xs lg:text-md'>
                        Book Your Appointment
                    </small>
                </span>
                <span className='flex flex-col items-center'>
                    <Image role="button" tabIndex={0} width={18} height={18} title="Settings" src="/icons/settings.png" alt="settings icon" />
                    <small className='inline-block mt-2 text-[9px] md:text-xs lg:text-md'>
                        Settings
                    </small>
                </span>
            </span>

            {/* calendar pill */}
            <span className='ml-2 flex items-center relative'>
                {/* for laptop view */}
                <span className='lg:py-2 lg:pr-3 lg:pl-6 rounded-full lg:border-[#595959] lg:border-solid lg:border inline-block mr-7 min-w-max'>
                    <span className='hidden lg:flex items-center justify-between'>
                        <Image width={30} height={30} src="/icons/calendar.png" alt="calendar icon" className='w-4 mr-3' />
                        <span className="mr-2">
                            {/* show current data or selected as placeholder */}
                            {dayjs((dateChange || new Date())?.toString()).format("ddd D, MMMM")}
                        </span>
                        {/* caret to open calendar */}
                        <span role="button" className={(openForm || pillDisabled) ? 'cursor-not-allowed' : 'cursor-pointer'} tabIndex={0} onClick={() => {
                            if (!openForm && !pillDisabled) setCalendarOpen(!calendarOpen)
                        }}>
                            <Image width={30} height={30} src="/icons/down.png" alt="down cart" className={`w-7 transition-all duration-75 ease-in-out ${calendarOpen ? 'rotate-180' : ''}`} />
                        </span>
                    </span>
                    {/* calendar to filter appointment */}
                    <CalendarComponent
                        setCalendarOpen={setCalendarOpen}
                        dateChange={dateChange}
                        setDateChange={setDateChange}
                        setDateChangeForFilter={setDateChangeForFilter}
                        calendarOpen={calendarOpen}
                        styles="top-[7px]"
                    />
                </span>

                {/* for book and update appointment */}
                <span className='lg:py-2 lg:px-5 rounded-full lg:border-[#595959] lg:border-solid lg:border inline-block mr-7 min-w-max cursor-auto'>
                    <span className='hidden lg:flex items-center justify-between'>
                        Book Your Appointment
                        {/* caret to open form */}
                        <span className={`${(calendarOpen || pillDisabled) ? 'cursor-not-allowed' : 'cursor-pointer'} ml-3`} onClick={() => {
                            if (!calendarOpen && !pillDisabled) {
                                setOpenForm(!openForm)
                            }
                            if (!calendarOpen && openForm) {
                                bookingFormRef?.current?.handleResetForm()
                            }
                        }} role="button" tabIndex={0}>
                            <Image width={30} height={30} src="/icons/down.png" alt="down cart" className={`w-7 transition-all duration-75 ease-in-out ${openForm ? 'rotate-180' : ''}`} />
                        </span>
                    </span>
                    {/* to booking appointment */}
                    <BookAppointmentForm
                        openForm={openForm}
                        setOpenForm={setOpenForm}
                        styles="top-[46px]"
                        ref={bookingFormRef}
                        setRender={setRender}
                    />
                </span>
            </span>

            {/* all appointments filter pill */}
            <span className='hidden lg:flex items-center min-w-max'>
                <span className='py-2 pr-3 pl-6 rounded-full border-[#595959] border-solid border inline-block mr-7 flex items-center cursor-pointer'>
                    <h4 className='mr-3'>All Appointments</h4>
                    <Image width={30} height={30} src="/icons/down.png" alt="" className='w-7' />
                </span>
                <span className='cursor-pointer p-3 rounded-full border-[#595959] border-solid border inline-block'>
                    <Image width={30} height={30} src="/icons/settings.png" alt="" className='w-5' />
                </span>
            </span>
        </div>
    )
})
TopHeader.displayName = 'TopHeader';

export default memo(TopHeader)
