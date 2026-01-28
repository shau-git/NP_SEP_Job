import {Trash2} from "lucide-react"

const DeleteButton = ({onDelete, field_id}) => {
    return (
        <button
            onClick={() => onDelete(field_id)}
            className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all"
            title="Delete"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    )
}

export default DeleteButton