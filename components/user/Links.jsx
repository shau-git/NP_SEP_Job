import React from 'react'
import {EditButton, Option, Title} from "@/components/user/utils/utils_config"

const Links = ({linkIcons, Mail, setEditMode, editMode, email, links, handleRemoveLink, newLink, setNewLink, handleAddLink}) => {
    const handleEdit = () => {
        setEditMode({ ...editMode, links: !editMode.links })
    }
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
            <Title title="Contact & Links"/>
            {/* <button 
                onClick={handleEdit}
                className="text-purple-400 hover:text-purple-300 transition-colors"
            >
                <Edit2 className="w-5 h-5" />
            </button> */}
            <EditButton {...{handleEdit}}/>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white/50 text-xs">Email</div>
                        <div className="text-purple-300 text-sm truncate">{email}</div>
                    </div>
                </div>

                {links.map((link) => (
                    <div key={link.link_id} className="group relative flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            {linkIcons[link.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-white/50 text-xs flex items-center gap-2">
                                {link.label}
                                {link.is_primary && <span className="text-yellow-400">⭐</span>}
                            </div>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-purple-300 text-sm truncate block hover:text-purple-200">
                                {link.url.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                        {editMode.links && (
                            <button
                                onClick={() => handleRemoveLink(link.link_id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}

                {editMode.links && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                    <select
                        value={newLink.type}
                        onChange={(e) => setNewLink({ ...newLink, type: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                        <Option value={"website"}/>
                        <Option value={"linkedin"}/>
                        <Option value={"github"}/>
                        <Option value={"twitter"}/>
                        <Option value={"portfolio"}/>
                        <Option value={"other"}/>
                        {/* <option value="website" className="">Website</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="github">GitHub</option>
                        <option value="twitter">Twitter</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="other">Other</option> */}
                    </select>
                    <input
                        type="url"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                    <input
                        type="text"
                        value={newLink.label}
                        onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                        placeholder="Label (optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        maxLength={50}
                    />
                    <button
                        onClick={handleAddLink}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all text-sm"
                    >
                        Add Link
                    </button>
                </div>
            )}
            </div>
        </div>
    )
}

export default Links