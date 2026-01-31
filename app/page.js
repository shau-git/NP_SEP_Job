'use client'
import {useState, useEffect} from "react"
import { Hero, Stats, Quote , Category, Features} from "@/components/Home/home_config"

export default function Home() {

    

    const [user, setUser] = useState(null)

    
    return (
    
        <div className="bg-[#0f0f1e] min-h-screen text-white overflow-hidden">
            <Hero/>
            <Quote />
            <Stats/>
            <Category/>
            <Features/>
        </div>
    );
}
