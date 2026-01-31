import { useState, useEffect, useRef } from 'react';
import { MoreVertical  } from 'lucide-react';
import {DeleteButton, EditButton2} from "@/components/user/utils/utils_config"

export default function MoreMenu({ onEdit = () => {}, onDelete , haveEdit=true}) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef(null);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const handleEdit = () => {
		onEdit();
		setIsOpen(false);
	};

	const handleDelete = () => {
		onDelete();
		setIsOpen(false);
	};

	return (
		<div className="relative shrink-0" ref={menuRef}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					setIsOpen(!isOpen);
				}}
				className="p-2 hover:bg-white/10 rounded-lg transition-all"
				title="Options"
				aria-label="More options"
			>
				<MoreVertical className="w-5 h-5 text-white/60" />
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div 
					className={`absolute  ${haveEdit? "top-10 right-0": "top-0 right-7"} bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden z-10`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex">
						{/* <button
						onClick={handleEdit}
						className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-blue-500/20 transition-all"
					>
						<Edit2 className="w-4 h-4 text-blue-400" />
					</button> */}
					{haveEdit && <EditButton2 {...{handleEdit}}/>}

					{/* <button
						onClick={handleDelete}
						className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-red-500/20 transition-all border-t border-white/10"
					>
						<Trash2 className="w-4 h-4 text-red-400" />
					</button> */}
					<DeleteButton {...{handleDelete}}/>
					</div>
					

				</div>
			)}
		</div>
    );
}