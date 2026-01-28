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
    const router = useRouter()

    const handleClick = () => { 
        console.log("HHHH")
        console.log("session here", session)
        
        if(!session) {
            setOpenLoginModal(true)
        } 
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
            {openLoginModal && <Login {...{setOpenLoginModal}}/>}
            <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-white/10 z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
                    <div 
                        onClick={() => router.push('/')}
                        className="cursor-pointer text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        CareerHub
                    </div>

                    <div className="flex items-center gap-3 text-white">
                        
                        <Tooltip name="Company">
                            <button 
                                onClick={handleClick} // Button logic works perfectly here
                                className="cursor-pointer group w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/50 hover:scale-105 transition-all"
                            >
                                <Building2 className="w-4.5 h-4.5" />
                            </button>
                        </Tooltip>
                    
                        <div className="relative">
                            <Tooltip name="Notification">
                                <button 
                                    onClick={handleClick}
                                    className="cursor-pointer group w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/50 hover:scale-105 transition-all"
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
                                onClick={handleClick}
                                className={`cursor-pointer group w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/50 hover:border-purple-500 hover:scale-105 transition-all ${!session && "flex items-center justify-center bg-white/10"}`}
                            >
                                {session ? (
                                    <img src={session.user?.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserRound className="w-5 h-5" />
                                )}
                            </button>
                        </Tooltip>
                
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Nav