import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TopHeader from '@components/TopHeader'
import AppintmentCard from '@components/AppointmentCard'
import { times } from '@utils/rowData';
import BookAppointmentForm from '@components/BookAppointmentForm'
import { CreateDateResetType, CreateResetType } from '@/types/dateType';
import dayjs from 'dayjs';

const filterInitValue = {
    status: '',
    date: ''
}
function Scheduler({
    drawarOpen
}: {
    drawarOpen: boolean
}) {

    const createDateResetRef = useRef<CreateDateResetType | null>(null)
    const [reRender, setRender] = useState(false)
    const [editAppointment, setEditAppointment] = useState<Record<string, string>>({})
    // 
    const bookingFormRef = useRef<CreateResetType | null>(null)
    const [appointmentData, setAppointmentData] = useState<Record<string, Record<string, string>[]> | null>({})
    const [filters, setFilters] = useState<Record<string, string>>(filterInitValue);
    const [openForm, setOpenForm] = useState(false)

    // grouping the data and cache
    const groupingData = useCallback((arg: Record<string, string>[]) => {
        // grouping by start_time
        const hashMap: Record<string, Record<string, string>[]> = {}
        if (arg?.length) {
            arg.forEach((o: Record<string, string>) => {
                const startTime = `${o?.start_time}`
                if (hashMap?.[startTime]?.length) {
                    hashMap[startTime] = [...hashMap[startTime], o]
                } else {
                    hashMap[startTime] = [o];
                }
            })
        }
        return hashMap
    }, [])

    // fetch data only initial render 
    useEffect(() => {
        const fetchApi = async () => {
            // fetch
            const serverReq = await fetch('/api/appointment')
            const resData = await serverReq.json()

            if (resData?.success) {
                const mapped = groupingData(resData?.appointments || [])
                // set to state
                setAppointmentData(mapped)
            }
        }
        // call fn
        fetchApi()
        setRender(false)
        setEditAppointment({})
    }, [reRender, groupingData])

    // filtered data by filer params
    const appointmentsMappedData = useMemo(() => {
        // if not data then return
        if (!appointmentData) return {};
        const currentDateTime = dayjs();
        // map date by match statue and date
        const filteredData: Record<string, string>[] = Object.values(appointmentData || {}).flat().filter((o: Record<string, string>) => {
            // check appointment date and time if in past from current date and time
            const appointmentDateTime = dayjs(`${o?.date} ${o?.start_time}`, 'MM-DD-YYYY h:mm A');
            let _status = true;
            if (filters?.status === "completed") {
                _status = appointmentDateTime.isBefore(currentDateTime) && o?.status !== "cancelled";
            } else if (filters?.status === "booked") {
                _status = appointmentDateTime.isAfter(currentDateTime) && o?.status !== "cancelled";
            } else if (filters?.status) {
                _status = o?.status?.includes(filters.status);
            }
            const _date = o?.date?.includes(filters.date || '');
            return _status && _date;
        });
        // Group and return the filtered data
        return filteredData?.length ? groupingData(filteredData) : {};
    }, [filters, appointmentData, groupingData])


    // To delete appointment
    const handleDeleteAppointment = async (uuid: string) => {
        try {
            const serverRes = await fetch(`/api/appointment?uuid=${uuid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const response = await serverRes.json()
            if (response.success) {
                setRender(true)
                alert(response.message)
            } else {
                alert(response.message)
            }
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <div className={`${drawarOpen ? 'w-[95%]' : ' w-[5%] md:w-[60%] lg:w-[70%] xl:w-4/5'} h-full bg-[#1f1f1f] relative transition-all duration-75 ease-in-out md:block`}>
            <TopHeader
                pillDisabled={openForm}
                ref={createDateResetRef}
                filters={filters}
                setFilters={setFilters}
                setRender={setRender}
            />
            {/* header status badge for fitler */}
            <div className='flex items-center mx-2 md:py-6 lg:pr-8 py-3 mb-2 md:mb-0 pl-4 overflow-x-scroll md:overflow-x-auto snap-x snap-mandatory md:ml-8 lg:ml-0 hide-scrollbar'>
                {['booked', 'cancelled', 'completed', 'reset']?.map((s: string) => <span
                    onClick={() => {
                        if (!openForm) {
                            if (s === "reset") {
                                setFilters(filterInitValue)
                                createDateResetRef?.current?.setDateChange(new Date())
                            } else {
                                setFilters((pre) => ({
                                    ...pre,
                                    status: s
                                }))
                            }
                        }
                    }}
                    title="Clear all filters"
                    role="button" tabIndex={0} key={s} className={`snap-start mx-1 md:mx-2 flex items-center border border-solid border-${s} ${filters?.status === s ? `bg-${s}` : ''} w-max rounded-[15px] px-3 py-1  ${openForm ? "cursor-not-allowed" : "cursor-pointer"}`}>
                    <span className={`w-4 h-4 mr-2 bg-${filters?.status === s ? 'white' : s} rounded-full`} />
                    <small className='capitalize'>{s}</small>
                </span>)}
            </div>
            {/* end */}

            {/* schedule map start */}
            <ul className={`${openForm ? 'overflow-hidden' : 'overflow-y-scroll'} h-full snap-y snap-mandatory hide-scrollbar !m-0 !p-0`}>
                {times.map((t: string) => (
                    <li key={t} className={`ml-3 sm:mx-5 md:mx-8 snap-start ${t === '10:00 PM' ? 'mb-44' : ''}`}>
                        <span className='inline-block min-h-[200px] w-full'>
                            <span className='flex items-start '>
                                <small className='min-w-[90px]'>{t}</small>
                                <span className='time-divider' />
                            </span>
                            {/* map your appointments by time */}
                            <span className={`flex mt-[15px] justify-start w-full snap-x snap-mandatory hide-scrollbar md:ml-[90px] ${openForm ? 'overflow-x-hidden' : 'overflow-x-scroll'}`}>
                                {(appointmentsMappedData?.[`${t}`] || []).map((o: Record<string, string>) =>
                                        <AppintmentCard data={o}
                                            key={o?.uuid}
                                            setOpenForm={setOpenForm}
                                            handleDeleteAppointment={handleDeleteAppointment}
                                            setEditAppointment={setEditAppointment}
                                            isPastAppointment={dayjs(`${o?.date} ${o?.start_time}`, 'MM-DD-YYYY h:mm A').isAfter(dayjs())}
                                        />
                                )}

                            </span>
                        </span>
                    </li>
                ))}
            </ul>
            {/* schedule map end */}

            {/* to booking appointment */}
            <BookAppointmentForm
                openForm={openForm}
                setOpenForm={setOpenForm}
                styles="top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
                ref={bookingFormRef}
                setRender={setRender}
                editAppointment={editAppointment}
                setEditAppointment={setEditAppointment}
            />
        </div >
    )
}

export default Scheduler
