'use client'
import {use, useState} from 'react'
import {redirect} from "next/navigation"

const Company = ({params}) => {
    const {user_id} = use(params)
    if(!parseInt(user_id)) {
        toast.error("user id must be a number ")
        redirect('/')
    }
    const [company, setCompany] = useState(null)

    // To fetch the user's company as they are the current member
    const fetchUserCompany = async () => {
        const response = await getUser(user_id)
        const data = await response.json();

        if(response.status === 200) {
            console.log(data.data)
            setUser(data.data)
        } else {
            toast.error(data.message)
        }
    }


    return (
        <div>Company</div>
    )
}

export default Company