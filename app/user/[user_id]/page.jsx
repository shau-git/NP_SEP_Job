'use client'
import {useSession} from "next-auth/react"
import {redirect} from "next/navigation"
import {use, useState, useEffect} from 'react'
import {getUser, updateUser, addUserData, deleteUserData} from "@/util/fetchData/fetch_config"
import { toast } from "react-toastify"
import { Camera, Mail, Globe, Linkedin, Github, MapPin, Briefcase, Edit2, X} from 'lucide-react';
import {Profile, Summary,  Education, Experience, Skill, Language, Links} from "@/components/user/user_config"

const User = ({params}) => {
    const {user_id} = use(params)

    const [user, setUser] = useState(null)
    const [summaryDraft, setSummaryDraft] = useState('');
    const [newSkill, setNewSkill] = useState('');

    const fetchUser = async () => {
        const response = await getUser(user_id)
        const data = await response.json();

        if(response.status === 200) {
            console.log(data.data)
            setUser(data)
        } else {
            toast.error(data.message)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const [editMode, setEditMode] = useState({
        summary: false,
        skills: false,
        links: false
    });

    const [newLink, setNewLink] = useState({ type: "website", url: "", label: "" });

    const linkIcons = {
        website: <Globe className="w-5 h-5" />,
        linkedin: <Linkedin className="w-5 h-5" />,
        github: <Github className="w-5 h-5" />,
        twitter: <Globe className="w-5 h-5" />,
        portfolio: <Briefcase className="w-5 h-5" />,
        other: <Globe className="w-5 h-5" />
    };

    
    
    const handleAddLink = () => {
        if (newLink.url.trim()) {
        const newLinkObj = {
            link_id: Date.now(),
            type: newLink.type,
            url: newLink.url.trim(),
            label: newLink.label.trim() || newLink.type,
            is_primary: false
        };
        setUser({ ...user, links: [...user.links, newLinkObj] });
        setNewLink({ type: "website", url: "", label: "" });
        }
    };

    const handleRemoveLink = (linkId) => {
        setUser({ ...user, links: user.links.filter(l => l.link_id !== linkId) });
    };


    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-blue-500">
                <div className="animate-pulse">Loading Profile...</div>
            </div>
        )
    }

    const { name, image, role, email, summary, languages, links, experiences, educations, skills} = user.data
    
    // ===== SUMMARY FUNCTIONS =====  
    const handleEditSummary = () => {
        // save user's summary to a draft
        setSummaryDraft(summary);
        // set the summary (about me) to edit mode
        setEditMode({ ...editMode, summary: true });
    };

    const handleSaveSummary = async () => {
        try {
            const response = await updateUser("user", user_id, {summary: summaryDraft});
            const data = await response.json()
            if(response.status === 200){
                // update user state
                setUser({ ...user, summary: data.data.summary});//summaryDraft
                // clear edit mode
                setEditMode({ ...editMode, summary: false });
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.error('Error updating summary:', error);
            toast.error(error);
        }
    };

    const handleCancelSummary = () => {
        // clear summary draft
        setSummaryDraft('');
        // change back to normal mode
        setEditMode({ ...editMode, summary: false });
    };


    // ===== SKILL FUNCTIONS ===== 
    const handleAddSkill = async () => {
        // if user add an empty thing dont execute 
        if (!newSkill.trim()) return;

        try {
            const response = await addUserData(user_id, {skill: newSkill.trim()}, "skill");
            const data = await response.json()

            if(response.status === 201){
                const {skill_id, skill} = data.data
                // update user state
                setUser({
                    ...user,
                    skills: [...user.skills, {skill_id, skill}]
                });
                // clear new skill draft
                setNewSkill('');
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }            
        } catch (error) {
            console.error('Error adding skill:', error);
            toast.error(error);
        }
    };

    const handleRemoveSkill = async (skill_id) => {
        if (!confirm('Are you sure you want to remove this skill?')) return;

        try {
            const response =  await deleteUserData(skill_id, "skills");
            const data = await response.json()

            if(response.status === 200){
                // update user state
                setUser({
                    ...user,
                    skills: skills.filter(s => s.skill_id !== skill_id)
                });
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }         

            
        } catch (error) {
            console.error('Error removing skill:', error);
            toast.error('Failed to remove skill');
        }
    };


    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900">
            
            {/* Profile Header */}
            <Profile {...{user, Camera, MapPin, Briefcase, name, image, role}}/>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1  gap-6">
                    {/* Main Column */}
                    {/* About Me */}
                    <Summary {...{ summary, handleEditSummary, handleSaveSummary,handleCancelSummary,  editMode, summaryDraft, Edit2}}/>
                    
                    {/* Experience */}
                    <Experience {...{ experiences, setUser, user_id }}/>
                    
                    {/* Education */}
                    <Education {...{educations, setUser, user_id }}/>

                    {/* Skills */}
                    <Skill {...{X, setEditMode, editMode, skills,  handleRemoveSkill, newSkill,  setNewSkill, handleAddSkill}}/>

                    {/* Contact & Links */}
                    <Links {...{linkIcons,  Mail, setEditMode, editMode, email, links,  handleRemoveLink, newLink, setNewLink, handleAddLink}}/>

                    {/* Languages */}
                    <Language {...{ languages}}/>
                </div>
            </div>
        </div>
    )
}

export default User