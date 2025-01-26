
'use client'

import React, { useEffect, useState } from 'react'
import Drawer from './Drawer'
import Scheduler from './Scheduler'

function MainContainer() {
    const [drawarOpen, setDrawerClose] = useState(false)



    const [screenSize, setScreenSize] = useState(1025);
    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        };

        window?.addEventListener("resize", handleResize);

        // clean up fn
        return () => window?.removeEventListener("resize", handleResize);
    }, []);

    // set default value of drawer
    useEffect(() => {        
        if (screenSize <= 1024) {
            setDrawerClose(true)
        } else setDrawerClose(false)
    }, [screenSize])

    return (
        <main className="h-screen w-full flex overflow-hidden">
            <Drawer drawarOpen={drawarOpen} setDrawerClose={setDrawerClose} />
            <Scheduler drawarOpen={drawarOpen} />
        </main>
    )
}

export default MainContainer
