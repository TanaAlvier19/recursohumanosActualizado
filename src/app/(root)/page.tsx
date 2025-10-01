'use client'
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FooterWithLogo from "./components/Footer"
import Section1 from "./components/Section1"
import Section2 from "./components/Section2"
import Navbar from "./components/Navbar"

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 200)

    const minLoadingTime = setTimeout(() => {
      setIsLoading(false)
      clearInterval(progressInterval)
    }, 1800)

    return () => {
      clearTimeout(minLoadingTime)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl shadow-2xl">
                  <div className="bg-slate-900 p-2 rounded-md">
                    <div className="bg-slate-800 w-8 h-8 rounded" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    AVD<span className="font-light">Soluções</span>
                  </h3>
                  <p className="text-slate-400 text-sm">Carregando recursos...</p>
                </div>
              </div>
            </motion.div>

            <div className="w-80 max-w-full px-4">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Inicializando</span>
                <span>{Math.min(100, Math.round(progress))}%</span>
              </div>
              
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                />
              </div>
              
            
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-slate-500 text-sm max-w-md">
                Preparando sua experiência  em gestão de RH...
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col flex-grow"
          >
            <main className="flex-grow ">
              <Section1 />
              <Section2 />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Homepage