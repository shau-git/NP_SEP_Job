import { useState } from 'react';
import {MoreMenu, Title, PlusButton, CancelButton, InputTag, SelectTag, AddFieldButton} from "@/components/user/utils/utils_config"
import { toast } from "react-toastify"
import {addUserData, deleteUserData} from "@/util/fetchData/fetch_config"
import {Save, Trash2} from "lucide-react"

const Language = ({session, languages, setUser, user_id}) => {
	const [isAdding, setIsAdding] = useState(false);
	const [formData, setFormData] = useState({
		language: '',
		proficiency: 'Native'
	});

	const [errors, setErrors] = useState({});

	// Proficiency options from your schema
	const proficiencyLevels = ['Native', 'Fluent', 'Basic'];

	// Reset form
	const resetForm = () => {
		setFormData({
			language: '',
			proficiency: 'Native'
		});
		setErrors({});
		setIsAdding(false);
	};

	// Handle input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		if (errors[name]) {
			setErrors({ ...errors, [name]: '' });
		}
	};

	 // Validate form
	const validateForm = () => {
		const newErrors = {};

		if (!formData.language.trim()) {
			newErrors.language = 'Language is required';
		} else if (formData.language.length > 20) {
			newErrors.language = 'Max 20 characters';
		}

		// Check for duplicate
		const isDuplicate = languages.some(
			lang => lang.language.toLowerCase() === formData.language.trim().toLowerCase()
		);
		if (isDuplicate) {
			newErrors.language = 'This language already exists';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Add language
	const handleAdd = async () => {
		if (!validateForm()) return;

		try {
			const response = await addUserData(
				user_id, 
				{
					language: formData.language.trim(),
					proficiency: formData.proficiency
				}, 
				"language"
			);
            const data = await response.json()
            
            if(response.status === 201){
                const {language_id, language, proficiency} = data.data
                // Update user state
                setUser(prevUser => ({
				...prevUser,
				languages: [...prevUser.languages, {language_id, language, proficiency}]
			}));
                // clear draft
                resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }    
		} catch (error) {
			console.error('Error adding language:', error);
			toast.error('Failed to add language');
		}
	};

	// Delete language
	const handleDelete = async (languageId) => {
		if (!confirm('Are you sure you want to delete this language?')) return;

		try {
			const response =  await deleteUserData("language", languageId);
            const data = await response.json()

            if(response.status === 200){
                // update user state
                setUser(prevUser => ({
					...prevUser,
					languages: prevUser.languages.filter(lang => lang.language_id !== languageId)
				}));

                toast.success(data.message)
            } else {
                toast.error(data.message)
            }      
		} catch (error) {
			console.error('Error deleting language:', error);
			toast.error('Failed to delete language');
		}
	};

	// Get proficiency color
	const getProficiencyColor = (level) => {
		switch (level) {
		case 'Native':
			return 'bg-green-500/20 border-green-500/30 text-green-200';
		case 'Fluent':
			return 'bg-blue-500/20 border-blue-500/30 text-blue-200';
		case 'Basic':
			return 'bg-orange-500/20 border-orange-500/30 text-orange-200';
		default:
			return 'bg-purple-500/20 border-purple-500/30 text-purple-200';
		}
	};

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
				<Title title="Languages"/>
                {/* <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button> */}
				    {/* <EditButton {...{handleEdit}}/> */}
					{/* <button
						onClick={() => setIsAdding(true)}
						className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all"
					>
						<span className="hidden sm:inline">Add Language</span>
						<span className="sm:hidden">Add</span>
					</button> */}
					{session.user_id == user_id && <PlusButton handleClick={() => setIsAdding(true)}/>}
			</div>


			{/* Add Form */}
			{isAdding && (
				<div className="mb-6 p-6 bg-white/5 rounded-xl border border-purple-500/30">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Language */}
						{/* <div>
							<label className="block text-white/80 font-medium mb-2 text-sm">
								Language *
							</label>
							<input
								type="text"
								name="language"
								value={formData.language}
								onChange={handleChange}
								placeholder="e.g., English, Spanish, Mandarin"
								maxLength={20}
								className={`w-full bg-white/5 border ${
								errors.language ? 'border-red-500/50' : 'border-white/20'
								} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500`}
							/>
							{errors.language && <p className="text-red-400 text-xs mt-1">{errors.language}</p>}
						</div> */}
						<InputTag 
                            label="Language *"
                            type="text"
                            name="language"
                            value={formData.language}
                            handleChangeFunc={handleChange}
							placeholder="e.g., English, Spanish, Mandarin"
							maxLength={20}
                            error={errors.language}
                        />

						{/* Proficiency */}
						{/* <div>
							<label className="block text-white/80 font-medium mb-2 text-sm">
								Proficiency Level *
							</label>
							<select
								name="proficiency"
								value={formData.proficiency}
								onChange={handleChange}
								className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
							>
								{proficiencyLevels.map(level => (
								<option key={level} value={level}>{level}</option>
								))}
							</select>
						</div> */}
						<SelectTag 
                            field="Proficiency Level *"
                            name="proficiency"
                            value={formData.proficiency}
                            handleChangeFunc={handleChange}
                            options={proficiencyLevels}
                        />
					</div>

					{/* Form Actions */}
					<div className="flex justify-end gap-3 mt-4">
						{/* <button
							onClick={resetForm}
							className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 transition-all flex items-center gap-2"
						>
							<X className="w-4 h-4" />
							Cancel
						</button> */}
						<CancelButton {...{resetForm}}/>

						{/* <button
							onClick={handleAdd}
							className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
						>
							<Save className="w-4 h-4" />
							Add Language
						</button> */}
						<AddFieldButton handleAdd={() => handleAdd} field="Language"/>
					</div>
				</div>
			)}


			{/* Languages List */}
			<div className="space-y-4">
				{languages.length === 0 ? (
					<p className="text-center text-white/50 py-8">No languages added yet</p>
				) : (languages.map((lang) => (
						// <div key={lang.language_id} className="flex justify-between items-center">
						// 	<div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-800 to-pink-800 flex items-center justify-center flex-shrink-0">
						// 		🌐
						// 	</div>
						// 	<span className="text-white font-medium">{lang.language}</span>
						// 	<span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm">
						// 		{lang.proficiency}
						// 	</span>
						// </div>
						//Language Data 
						<div
							key={lang.language_id}
							className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
						>
							<div className="flex items-center justify-start gap-3 flex-1">
								<div className="w-10 h-10 rounded-full bg-linear-to-br  from-[rgb(102,126,234)] to-[rgb(118,75,162)] flex items-center justify-center flex-shrink-0">
									🌐
								</div>
								<div className="font-semibold text-white text-lg">{lang.language}</div>
								<span className={`mr-3 px-3 py-1 rounded-full text-xs border mt-1 ${getProficiencyColor(lang.proficiency)}`}>
									{lang.proficiency}
								</span>
							</div>

							{/* Delete Button */}
							{/* <button
								onClick={() => handleDelete(lang.language_id)}
								className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
								title="Delete"
							>
								<Trash2 className="w-4 h-4" />
							</button> */}
							{
								session.user_id == user_id && 
								<MoreMenu
									onDelete={() => handleDelete(lang.language_id)}
									haveEdit={false}
								/>
							}
						</div>
					))
				)}
			</div>
        </div>
    )
}

export default Language