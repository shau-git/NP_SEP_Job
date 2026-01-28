import React from 'react'
import {EditButton, Title} from "@/components/user/utils/utils_config"

const Skill = ({X, setEditMode, editMode, skills, handleRemoveSkill, newSkill, setNewSkill, handleAddSkill}) => {
    const handleEdit = () => {
        setEditMode({ ...editMode, skills: !editMode.skills })
    }
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl py-6 px-7 border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <Title title="Skills & Technologies"/>
                {/* <button 
                    onClick={() => setEditMode({ ...editMode, skills: !editMode.skills })}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                    <Edit2 className="w-5 h-5" />
                </button> */}
                <EditButton {...{handleEdit}}/>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
                {skills.map((skill) => (
                <div key={skill.skill_id} className="group relative">
                    <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 hover:bg-purple-500/30 hover:border-purple-500/50 transition-all inline-block">
                        {skill.skill}
                    </span>
                        {editMode.skills && (
                    <button
                        onClick={() => handleRemoveSkill(skill.skill_id)}
                        className="cursor-pointer absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                    )}
                </div>
                ))}
            </div>
            {editMode.skills && (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add new skill..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        maxLength={30}
                    />
                    <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                        Add
                    </button>
                </div>
            )}
        </div>
    )
}

export default Skill