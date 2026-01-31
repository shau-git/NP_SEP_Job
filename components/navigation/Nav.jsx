'use client'
import {useState, useEffect} from 'react'
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import { Search, MapPin, Briefcase, Bell, Building2, TrendingUp, Users, Zap , UserRound} from 'lucide-react';
import Tooltip from '@/components/navigation/Tooltip';
import Login from "@/components/login/Login"

const Nav = () => {
    const {data: session, status: sessionStatus} = useSession()
    const [openLoginModal, setOpenLoginModal] = useState(false)
    const [active, setActive] = useState('')
    const router = useRouter()

    useEffect(() => {
        console.log(sessionStatus)  // authenticated or unauthenticated
        if(sessionStatus === 'authenticated') {
            if(active === "Home") {
                router.push('/')
            } else {
                router.push(`/${active}/${session.user_id}`)
            }
        }
    }, [active])

    const handleClick = (stateToActive) => { 
        console.log("session here", session)
        setActive(stateToActive)
        if(!session) {
            setOpenLoginModal(true)
        } /*else {
            router.push(`/${active}/${session.user_id}`)
        }*/
    }

    useEffect(() => {
        if (openLoginModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openLoginModal]);


    return (
        <>
            {openLoginModal && <Login {...{setOpenLoginModal, active}}/>}
            <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-white/10 z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
                    <div 
                        onClick={() => {
                            router.push('/')
                            setActive('Home')
                        }}
                        className="cursor-pointer text-2xl font-bold bg-linear-to-r from-[rgb(102,126,234)] to-[rgb(118,75,162)] bg-clip-text text-transparent">
                        CareerHub
                    </div>

                    <div className="flex items-center gap-3 text-white">
                        
                        <Tooltip name="Company">
                            <button 
                                onClick={() => handleClick("company")} // Button logic works perfectly here
                                className={`cursor-pointer group w-10 h-10 rounded-full ${active === "company"? "border-purple-500 border-3":"bg-white/10 border-white/20"} border  flex items-center justify-center hover:bg-purple-500/20 hover:scale-105 hover:border-2 transition-all `}
                            >
                                <Building2 className="w-4.5 h-4.5" />
                            </button>
                        </Tooltip>
                    
                        <div className="relative">
                            <Tooltip name="Notification">
                                <button 
                                    onClick={() => handleClick("notification")}
                                    className={`cursor-pointer group w-10 h-10 rounded-full ${active === "notification"? "border-purple-500 border-3" :"bg-white/10 border-white/20"} border  flex items-center justify-center hover:bg-purple-500/20 hover:scale-105 hover:border-2 transition-all `}
                                >
                                    <Bell className="w-4.5 h-4.5" />
                                </button>
                                {/* {currentUser.unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-950">
                                    {currentUser.unreadNotifications}
                                </span>
                                )} */}
                            </Tooltip>
                        </div>
                        
                        
                        <Tooltip name="Profile">
                            <button 
                                onClick={() => handleClick("user")}
                                className={`overflow-hidden cursor-pointer group w-10 h-10 rounded-full ${active === "user"? "border-purple-500 border-3 ":"bg-white/10 border-white/20"} border  flex items-center justify-center hover:bg-purple-500/20 hover:scale-105 hover:border-2 transition-all ${!session && "flex items-center justify-center bg-white/10"}`}
                            >
                                <UserRound className="w-5 h-5" />
                            </button>
                        </Tooltip>
                
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Nav