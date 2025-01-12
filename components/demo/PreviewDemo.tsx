"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import DarkApp from "../../public/demo/dark/DarkDemoPic.png"
import LightApp from "../../public/demo/light/LightDemoPic.png"
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
    const opacity = useTransform(scrollYProgress, [0,1], [0, 2])

    // Handle mounting for theme
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // Prevent flash of wrong theme
    }

    const currentImage = theme === 'dark' ? DarkApp : LightApp

    return (
        <div className="text-foreground py-20 sm:py-24">
            <motion.div
                ref={appImageRef}
                style={{
                    opacity: opacity,
                    rotateX: rotateX,
                    transformPerspective: "700px"
                }}
                className="mt-14 rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-foreground/10"
            >
                <Image
                    src={currentImage}
                    alt="App demo interface"
                    className="w-full h-auto"
                    priority
                />
            </motion.div>
        </div>
    )
}
