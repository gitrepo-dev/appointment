import React, { memo } from 'react'
import dayjs from 'dayjs';
import Image from 'next/image';

function AppintmentCard({
    data,
    setOpenForm,
    handleDeleteAppointment,
    setEditAppointment,
    isPastAppointment
}: {
    data: Record<string, string>,
    setOpenForm: (arg: boolean) => void,
    handleDeleteAppointment: (id: string) => void,
    setEditAppointment: (arg: Record<string, string>) => void,
    isPastAppointment: boolean
}) {
    return (
        <span className={`rounded-[15px] bg-white relative py-4 px-4 snap-start max-w-64 border-2 border-solid border-${isPastAppointment ? data?.status : 'completed'} text-[#444444] mr-4 min-w-[250px] min-h-[150px]`}>
            {/* status tag */}
            {data?.status && <small className={`font-bold white text-white bg-${isPastAppointment ? data?.status : 'completed'} py-1 px-2 rounded-bl-[15px] rounded-tr-[13px] absolute right-0 top-0 text-[10px]`}>{isPastAppointment ? data?.status : 'completed'}</small>}

            {/* edit & delete */}
            {(isPastAppointment && data?.status !== "cancelled") ? <span className='absolute flex items-center justify-between flex-col h-[70px] right-[8px] top-[35px]'>
                <Image width={30} height={30} role="button" tabIndex={0} onClick={() => handleDeleteAppointment(data?.uuid)}
                    src="/icons/delete.png" alt="delete icon" title="Delete your appointment" className='p-2 max-w-[30px] rounded-full bg-red-600 cursor-pointer hover:bg-red-900 transition-all mb-3 ease-in-out duration-[300ms]' />

                <Image width={30} height={30} role="button" tabIndex={0} onClick={() => {
                    setOpenForm(true)
                    setEditAppointment(data)
                }}
                    src="/icons/edit.png" alt="edit icon" title="Edit your appointment" className='p-2 max-w-[30px] rounded-full bg-green-600 cursor-pointer hover:bg-green-900 transition-all mb-3 ease-in-out duration-[300ms]' />
            </span> : null}


            {/* data mapped */}
            <span className='flex items-center mt-2'>
                <Image width={30} height={30} src={`/images/t${Math.floor(Math.random() * 3) + 1}.jpg`} className='rounded-lg mr-2 w-14' alt="" />
                <span title={(`${data?.first_name} ${data?.last_name}`)?.length > 15 ? `${data?.first_name} ${data?.last_name}` : ''} className='inline-block leading-[15px] capitalize truncate'>
                    {data?.first_name && <small className='font-bold block'>{data?.first_name} {data?.last_name}</small>}
                    {data?.last_name && <small className='font-[100] font-xs text-[#9a9999]'>@{data?.last_name?.charAt(0)}</small>}
                </span>
            </span>
            {data?.appointment && <h4 title={(data?.appointment?.length > 20) ? data?.appointment : ''} className='font-bold my-3 capitalize truncate !w-[85%]'>{data?.appointment}</h4>}
            {data?.start_time && <span className='flex items-center text-gray-600'>
                <Image width={30} height={30} src="/icons/calendar-dark.png" alt="calendar icon" className='w-4 mr-2' />
                <small>{dayjs(data?.date, 'YYYY-MM-DD hh:mm A').format('DD MMMM')} - {data?.start_time || ''}</small>
            </span>}
        </span>
    )
}

export default memo(AppintmentCard)
