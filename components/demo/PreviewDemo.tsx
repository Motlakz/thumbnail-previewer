"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import DarkApp from "/demo/dark/DarkDemoPic.png"
import LightApp from "/demo/light/LightDemoPic.png"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"

export function Demo() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const appImageRef = useRef(null)
    
    const { scrollYProgress } = useScroll({
        target: appImageRef,
        offset: ["start end", "end start"]
    })

    const rotateX = useTransform(scrollYProgress, [0,1], [14,-10])
    const opacity = useTransform(scrollYProgress, [0,1], [0, 4])

    // Handle mounting for theme
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // Prevent flash of wrong theme
    }

    const currentImage = theme === 'dark' ? DarkApp : LightApp

    return (
        <div className="w-screen flex items-center justify-center text-foreground">
            <motion.div
                ref={appImageRef}
                style={{
                    opacity: opacity,
                    rotateX: rotateX,
                    transformPerspective: "700px"
                }}
                className="rounded-xl overflow-hidden shadow-2xl border border-foreground/10 w-full h-full max-w-[90vw] max-h-[90vh]"
            >
                <Image
                    src={currentImage}
                    alt="App demo interface"
                    className="w-full h-full object-cover"
                    priority
                />
            </motion.div>
        </div>
    )
}