import React from 'react'
import {Edit2} from 'lucide-react'

const EditButton = ({handleEdit}) => {
    return (
        <button 
            onClick={handleEdit}
            className="cursor-pointer text-purple-400 hover:text-purple-300 transition-colors"
        >
            <Edit2 className="w-5 h-5" />
        </button>
    )
}

export default EditButton