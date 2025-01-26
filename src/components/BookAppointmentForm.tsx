import { Fragment, forwardRef, memo, useImperativeHandle, useState, useEffect, Ref } from "react";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import CalendarComponent from "@components/CalendarComponent";
import { CreateResetType, Value } from '@/types/dateType';
import Image from "next/image";


// Default states for form inputs and errors
const initialFormData = {
    first_name: "",
    last_name: "",
    appointment: "",
    date: "",
    start_time: "",
};

const initialFormInputError = {
    first_name: true,
    last_name: true,
    appointment: true,
    date: true,
    start_time: true,
    flag: false,
};


const BookAppointmentForm = forwardRef(({
    openForm,
    setOpenForm,
    styles,
    setRender,
    editAppointment,
    setEditAppointment
}: {
    openForm: boolean,
    setOpenForm: (arg: boolean) => void,
    styles?: string,
    setRender: (arg: boolean) => void,
    editAppointment?: Record<string, string>,
    setEditAppointment?:(arg: Record<string, string>) => void
}, ref: Ref<CreateResetType | null>) => {

    //
    const [dateChange, setDateChange] = useState<string | Value>('')
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [timeInputPlaceHolder, setTimeInputPlaceHolder] = useState(true)
    // state for form inputs
    const [formData, setFormData] = useState<Record<string, string> | undefined>(initialFormData);
    // handling error
    const [formInputError, setFormInputError] = useState<Record<string, boolean>>(initialFormInputError)

    // on change handler for handling inputs of form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // handling errors
        if (value) setFormInputError((prev) => ({ ...prev, [name]: false }))
        else setFormInputError((prev) => ({ ...prev, [name]: true }))
    };

    // reset all on close form popup
    const handleResetForm = () => {
        setCalendarOpen(false)
        setOpenForm(false)
        setDateChange('')
        setTimeInputPlaceHolder(true)
        // reset error 
        setFormInputError(initialFormInputError)
        // reset inputs value
        setFormData(initialFormData)
        // reset data what get for
        if(setEditAppointment) setEditAppointment({})        
    }

    // To book an appointment handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const serverRes = await fetch('/api/appointment', {
                method: editAppointment?.date ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    status: "booked",
                    uuid: editAppointment?.uuid || null,
                }),
            })
            const response = await serverRes.json()
            if (response.success) {
                handleResetForm()
                setRender(true)
                alert(response.message)
            } else {
                alert(response.message)
            }
        } catch (e) {
            console.log(e)
        }
    };

    // to reset fn call via parent
    useImperativeHandle(ref, () => ({
        handleResetForm,
    }))

    // update the appointment
    useEffect(() => {
        if (Object.values(editAppointment || {})?.length) {
            setFormData(editAppointment)
            setDateChange(editAppointment?.date || '')
            // setError false
            const updatedFormInputError = Object.keys(initialFormInputError).reduce(
                (acc: Record<string, boolean>, key: string): Record<string, boolean> => {
                    acc[key] = false;
                    return acc;
                },
                {}
            );
            setFormInputError(updatedFormInputError)
        }
    }, [editAppointment, openForm])
   
    return (
        <div className={`bg-[#151515] left-[-3%] md:left-[-1%] lg:left-[auto] px-5 pt-10 pb-8 md:px-8 md:py-12 lg:w-[500px] absolute ${openForm ? 'block' : 'hidden'} ${styles || ''} ${calendarOpen ? 'overflow-auto hide-scrollbar' : 'overflow-visible'} ${editAppointment?.date ? '!left-[50%] w-[90%] !top-[59%] lg:top-[20%] lg:!w-[500px]' : ''}`}>
            {/* close btn */}
            <span role="button" onClick={handleResetForm} className={`absolute bg-red-700 p-2 z-[5] rounded-[50%] cursor-pointer right-[-12px] top-[-12px] ${calendarOpen ? 'hidden' : 'block'}`}>
                <Image width={30} height={30} src="/icons/close.png" alt="close icon" className="max-w-[12px]" />
            </span>

            <form aria-label="appointment form" onSubmit={(o) => {
                const {flag, ...rest} = formInputError
                o.preventDefault()
                if (Object.values(rest).filter((bln: boolean) => bln).length) {
                    setFormInputError((pre) => ({ ...pre, flag: true }))
                } else {
                    setFormInputError((pre) => ({ ...pre, flag: false }))
                    handleSubmit(o)
                }
                // true
                console.log(flag)
            }}>
                <span className="w-full inline-block md:flex items-center justify-between">
                    <span className="relative mr-4 w-full inlin-block">
                        <label htmlFor="first name" className="text-xs absolute bg-[#151515] top-[-9px] left-[8px] z-[1]">
                            First Name
                        </label>
                        <input
                            className="p-2 w-full text-sm rounded-md bg-[#151515] h-10 border border-solid border-[#6667b9]"
                            type="text"
                            name="first_name"
                            value={formData?.first_name}
                            onChange={handleChange}
                        />
                        <small className={`text-red-600 text-xs ${(formInputError?.first_name && formInputError?.flag) ? 'opacity-1' : 'opacity-0'}`}>First name is required.</small>
                    </span>
                    <span className="relative lg:ml-4 w-full inline-block">
                        <label htmlFor="last name" className="text-xs absolute  bg-[#151515] top-[-9px] left-[8px] z-[1]">Last Name</label>
                        <input
                            className="p-2 w-full text-sm rounded-md bg-[#151515] h-10 border border-solid border-[#6667b9]"
                            type="text"
                            name="last_name"
                            value={formData?.last_name}
                            onChange={handleChange}
                        />
                        <small className={`text-red-600 text-xs ${(formInputError?.last_name && formInputError?.flag) ? 'opacity-1' : 'opacity-0'}`}>Last name is required.</small>
                    </span>
                </span>
                <span className="relative w-full inline-block lg:my-5">
                    <label htmlFor="appointment" className="text-xs absolute  bg-[#151515] top-[-9px] left-[8px] z-[1]">Appoiment Description</label>
                    <input
                        className="p-2 w-full text-sm rounded-md bg-[#151515] h-10 border border-solid border-[#6667b9]"
                        type="text"
                        name="appointment"
                        value={formData?.appointment}
                        onChange={handleChange}
                    />
                    <small className={`text-red-600 text-xs ${(formInputError?.appointment && formInputError?.flag) ? 'opacity-1' : 'opacity-0'}`}>Appoiment description is required.</small>
                </span>
                <span className="w-full inline-block md:flex items-center justify-between">
                    <span className="relative mr-4 w-full inline-block">
                        <label htmlFor="date" className="text-xs absolute bg-[#151515] top-[-9px] left-[8px] z-[1]">Date</label>
                        <span onClick={() => setCalendarOpen(!calendarOpen)} role="button" tabIndex={0} className="w-full inline-block">
                            <span className="p-2 w-full text-sm rounded-md bg-[#151515] h-10 border border-solid border-[#6667b9] inline-block flex justify-between">
                                {dateChange ? dayjs(dateChange?.toString()).format("ddd D, MMMM") : <span />}
                            </span>
                            <small className={`text-red-600 text-xs ${(formInputError?.date && formInputError?.flag) ? 'opacity-1' : 'opacity-0'}`}>Date is required.</small>
                        </span>

                        {calendarOpen && <CalendarComponent
                            dateChange={dateChange}
                            setDateChange={(e) => {
                                setFormData((prev) => ({ ...prev, date: dayjs(e?.toString()).format('MM-DD-YYYY') }));
                                setDateChange(e)
                                setFormInputError((pre) => ({ ...pre, date: !e }))
                            }}
                            calendarOpen={calendarOpen}
                            setCalendarOpen={setCalendarOpen}
                            styles="top-[0px]"
                            minDate={new Date()}
                        />}
                    </span>
                    <span className="relative lg:ml-4 w-full inline-block">
                        <label htmlFor="time" className="text-xs absolute bg-[#151515] top-[-9px] left-[8px] z-[1]">Time</label>
                        <span className="relative " onClick={() => setTimeInputPlaceHolder(!timeInputPlaceHolder)}>
                            <select
                                className="p-2 w-full text-sm rounded-md bg-[#151515] h-10 border border-solid border-[#6667b9] custom-select"
                                name="start_time"
                                value={formData?.start_time}
                                onChange={handleChange}
                            >
                                {Array.from({ length: 14 }, (_, i) => {
                                    const currentTime = dayjs();
                                    const time = dayjs().hour(9 + i).minute(0);
                                    const formattedTime = time.format("hh:mm A");
                                    return (
                                        <Fragment key={formattedTime}>
                                            {((i === 0) && <option className="hidden" value=""></option>)}
                                            <option value={formattedTime} disabled={time.isBefore(currentTime, 'minute')}                 >
                                                {formattedTime}
                                            </option>
                                        </Fragment>
                                    );
                                })}
                            </select>
                        </span>
                        <small className={`text-red-600 text-xs ${(formInputError?.start_time && formInputError?.flag) ? 'opacity-1' : 'opacity-0'}`}>Time is required.</small>
                    </span>
                </span>
                <button disabled={JSON.stringify(editAppointment||{}) === JSON.stringify(formData||{})} type="submit" className="bg-[#6667b9] px-5 text-sm py-2 rounded-md lg:mt-6 w-full">
                    Book Now
                </button>
            </form>
        </div>
    );
});

BookAppointmentForm.displayName = 'BookAppointmentForm';
export default memo(BookAppointmentForm);
