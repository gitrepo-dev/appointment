import Image from 'next/image'
import React, { memo } from 'react'

function Drawer({
    drawarOpen,
    setDrawerClose
}: {
    drawarOpen: boolean,
    setDrawerClose: (arg: boolean) => void
}) {
    return (
        <div className={`${drawarOpen ? 'w-[5%]' : 'w-[95%] md:w-[95%] lg:w-[70%]  xl:w-[20%]'} border-[#6667b9] border-r relative transition-all duration-75 ease-in-out`}>
            {/* button to toggle menu */}
            <span role="button" tabIndex={0} onClick={() => setDrawerClose(!drawarOpen)} className="absolute right-[-15px] top-[34px] rounded-full h-7 w-7 p-2 cursor-pointer bg-white z-[12]">
                <Image width={30} height={30} src="/icons/left-arrow.png" alt="" className={`mb-50 w-full transition-all duration-75 ease-in-out ${drawarOpen ? 'rotate-180' : ''}`} />
            </span>
            <div className={`${drawarOpen ? 'hidden' : 'block'} relative bg-[#1e1e1e] text-blue box-border p-7 relative z-10 `}>
                <div className="h-full flex flex-col overflow-y-scroll hide-scrollbar">
                    <span>
                        {/* logged in image holder starts */}
                        <span className="flex items-center">
                            <Image
                                width={30}
                                height={30}
                                src="/images/login-profile.jpg"
                                alt="login profile icon"
                                className="w-24 rounded-md mr-3"
                            />
                            <span className="leading-[12px]">
                                <h5 className="flex items-center">Royal Salons <Image width={30} height={30} src="/icons/bag.png" alt="bag icon" /></h5>
                                <small className="font-medium mb-1.5 inline-block text-[#9a9999]">HAIR & MAKEUP</small>
                            </span>
                        </span>
                        {/* logged in image holder end */}

                        {/* nav start */}
                        <div className="px-5">
                            <div className="border-solid border border-l border-[#262526] mt-7 mb-5" />
                            <small className="font-medium mb-1.5 inline-block text-[#9a9999]">MAIN</small>
                        </div>

                        <ul>
                            <li className="py-4 px-5 mb-2 cursor-pointer bg-[#2b2a2a] rounded-[13px] flex items-center">
                                <Image width={30} height={30} src="/icons/calendar.png" alt="" className="mr-3 w-5" />
                                <span className="text-base">Scheduler</span>
                            </li>
                            <li className="py-4 px-5 mb-2 cursor-pointer  hover:bg-[#2b2a2a] ease-in duration-200 text-[#9a9999] rounded-lg flex items-center">
                                <Image width={30} height={30} src="/icons/page.png" alt="" className="mr-3 w-5" />
                                <span className="text-base">Previous Bookings</span>
                            </li>
                            <li className="py-4 px-5  mb-2 cursor-pointer hover:bg-[#2b2a2a] ease-in duration-200 text-[#9a9999] rounded-lg flex items-center">
                                <Image width={30} height={30} src="/icons/user.png" alt="" className="mr-3 w-5" />
                                <span className="text-base">Profile</span>
                            </li>
                            <li className="py-4 px-5 cursor-pointer hover:bg-[#2b2a2a] ease-in duration-200 text-[#9a9999] rounded-lg flex items-center">
                                <Image width={30} height={30} src="/icons/bell.png" alt="" className="mr-3 w-5" />
                                <span className="text-base">Notification</span>
                            </li>
                        </ul>
                        {/* nav end */}
                    </span>

                    <div className="overflow-y-scroll hide-scrollbar overflow-x-hidden h-[100vh]">
                        {/* team start */}
                        <div className="px-5 mb-4 sticky top-0 z-10 bg-[#1e1e1e]">
                            <div className="border-solid border border-l border-[#262526] mt-10 mb-4" />
                            <small className="text-white-600 font-medium mb-1.5 inline-block text-[#9a9999]">TEAM MEMBERS</small>
                        </div>

                        <ul className='h-[700px]'>
                            <li className="p-4 mb-2 cursor-pointer bg-[#2b2a2a] rounded-[13px] flex items-center">
                                <Image width={30} height={30} src="/images/t2.jpg" alt="" className="w-20 mr-3 rounded-md" />
                                <span>
                                    <span className="text-base block">Esther Howard</span>
                                    <small className="font-medium mb-1.5 text-[#9a9999]">COORDINATOR</small>
                                </span>
                            </li>

                            <li className="p-4 cursor-pointer flex items-center  rounded-[13px] hover:bg-[#2b2a2a] ease-in duration-200">
                                <Image width={30} height={30} src="/images/t1.jpg" alt="" className="w-20 mr-3 rounded-md" />
                                <span>
                                    <span className="text-base block">Jacob Jones</span>
                                    <small className="font-medium mb-1.5 text-[#9a9999]">MANAGER</small>
                                </span>
                            </li>

                            <li className="p-4 cursor-pointer flex items-center  rounded-[13px] hover:bg-[#2b2a2a] ease-in duration-200">
                                <Image width={30} height={30} src="/images/t3.jpg" alt="" className="w-20 mr-3 rounded-md" />
                                <span>
                                    <span className="text-base block">Cody Fisher</span>
                                    <small className="font-medium mb-1.5 text-[#9a9999]">TEAM LEAD</small>
                                </span>
                            </li>
                        </ul>

                        {/* team end */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default memo(Drawer)
