import {useState, useEffect} from 'react'
import {PlusButton, Title, Duration, DeleteButton, InputTag, SelectTag, CancelButton, SaveButton, Description} from "@/components/user/utils/utils_config"
import { formatDate} from '@/util/formating'
import {updateUser, addUserData, deleteUserData} from "@/util/fetchData/fetch_config"
import {Briefcase, Trash2, Edit2, X, Save} from "lucide-react"
import { useSession } from 'next-auth/react'

const Education = ({educations, setUser, user_id}) => {

    const {data: session, status: sessionStatus} = useSession()
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        institution: '',
        field_of_study: '',
        qualification: '',
        start_date: '',
        end_date: '',
        study_type: '',
        description: ''
    });

    const qualificationOptions = [
        'Primary School',
        'Secondary School',
        'ITE / Nitec',
        'A Level',
        'Diploma',
        'Degree',
        'Master',
        'PhD'
    ];

    // Reset form
    const resetForm = () => {
        setFormData({
            institution: '',
            field_of_study: '',
            qualification: '',
            start_date: '',
            end_date: '',
            study_type: '',
            description: ''
        });
        setErrors({});
        setIsAdding(false);
        setEditingId(null);
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

        if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
        else if (formData.institution.length > 50) newErrors.institution = 'Max 50 characters';

        if (!formData.field_of_study.trim()) newErrors.field_of_study = 'Field of study is required';
        else if (formData.field_of_study.length > 30) newErrors.field_of_study = 'Max 30 characters';

        if (!formData.start_date) newErrors.start_date = 'Start date is required';

        if (!formData.end_date) newErrors.end_date = 'End date is required';
        else if (formData.end_date !== 'present' && new Date(formData.end_date) < new Date(formData.start_date)) {
            newErrors.end_date = 'End date must be after start date';
        }

        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length > 300) newErrors.description = 'Max 300 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Add education
    const handleAdd = async () => {
        if (!validateForm()) return;

        try {
            const response = await addUserData(user_id, formData, "education");
            const data = await response.json()


            if(response.status === 201){
                const {education_id, institution, field_of_study, qualification, start_date, end_date, study_type, description} = data.data
                // Update user state
                setUser(prevUser => ({
                    ...prevUser,
                        educations: [...prevUser.educations, {education_id, institution, field_of_study, qualification, start_date, end_date, study_type, description}]
                }));

                resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }    
        } catch (error) {
            console.error('Error adding education:', error);
            toast.error('Failed to add education');
        }
    };

    // Update education
    const handleUpdate = async (educationId) => {
        if (!validateForm()) return;

        try {
            const response = await updateUser("education", educationId, formData);
            const data = await response.json()

            if(response.status === 200){
                const {education_id, institution, field_of_study, qualification, start_date, end_date, study_type, description} = data.data
                // Update user state
                setUser(prevUser => ({
                    ...prevUser,
                    educations: prevUser.educations.map(edu =>
                    edu.education_id === educationId ? 
                        {education_id, institution, field_of_study, qualification, start_date, end_date, study_type, description}
                    :   edu
                    )
                }));

                // clear draft
                resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }  
        } catch (error) {
            console.error('Error updating education:', error);
            alert(error.message || 'Failed to update education');
        }
    };

    // Delete education
    const handleDelete = async (educationId) => {
        if (!confirm('Are you sure you want to delete this education record?')) return;

        try {
            const response =  await deleteUserData(educationId, "education");
            const data = await response.json()

            if(response.status === 200){
                // update user state
               setUser(prevUser => ({
                    ...prevUser,
                    educations: prevUser.educations.filter(edu => edu.education_id !== educationId)
                }));

                if (editingId === educationId) resetForm();
                toast.success(data.message);
            } else {
                toast.error(data.message)
            }      
        } catch (error) {
            console.error('Error deleting education:', error);
            toast.error(error.message || 'Failed to delete education');
        }
    };

    // Start editing
    const handleEdit = (edu) => {
        setEditingId(edu.education_id);
        setFormData({
            institution: edu.institution,
            field_of_study: edu.field_of_study,
            qualification: edu.qualification,
            start_date: edu.start_date.split('T')[0],
            end_date: edu.end_date.split('T')[0],
            study_type: edu.study_type,
            description: edu.description
        });
        setIsAdding(false);
    };

    const handleSaveButton = () => {
        editingId ? handleUpdate(editingId) : handleAdd()
    }

    const handleClickPlus = () => {
        resetForm();
        setIsAdding(true);
        setEditingId(null);
    }
 
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl py-6 px-7 border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <Title title="Education"/>
                {/* <button className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                    <Plus className="w-5 h-5" />
                </button> */}
                <PlusButton handleClick={handleClickPlus}/>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="mb-6 p-6 bg-white/5 rounded-xl border border-pink-500/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Institution */}
                        {/* <div>
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                Institution *
                            </label>
                            <input
                                type="text"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                placeholder="e.g., Stanford University"
                                maxLength={50}
                                className={`w-full bg-white/5 border ${
                                errors.institution ? 'border-red-500/50' : 'border-white/20'
                                } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500`}
                            />
                            {errors.institution && <p className="text-red-400 text-xs mt-1">{errors.institution}</p>}
                        </div> */}
                        <InputTag 
                            label="Institution *"
                            type="text"
                            name="institution"
                            value={formData.institution}
                            handleChangeFunc={handleChange}
                            placeholder="e.g., Stanford University"
                            maxLength={50}
                            error={errors.institution}
                        />


                        {/* Field of Study */}
                        {/* <div>
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                Field of Study *
                            </label>
                            <input
                                type="text"
                                name="field_of_study"
                                value={formData.field_of_study}
                                onChange={handleChange}
                                placeholder="e.g., Computer Science"
                                maxLength={30}
                                className={`w-full bg-white/5 border ${
                                errors.field_of_study ? 'border-red-500/50' : 'border-white/20'
                                } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500`}
                            />
                            {errors.field_of_study && <p className="text-red-400 text-xs mt-1">{errors.field_of_study}</p>}
                        </div> */}
                        <InputTag 
                            label="Field of Study *"
                            type="text"
                            name="field_of_study"
                            value={formData.field_of_study}
                            handleChangeFunc={handleChange}
                            placeholder="e.g., Computer Science"
                            maxLength={30}
                            error={errors.field_of_study}
                        />


                        {/* Qualification */}
                        {/* <div>
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                Qualification *
                            </label>
                            <select
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                            >
                                {qualificationOptions.map(qual => (
                                    <option key={qual} value={qual}>{qual}</option>
                                ))}
                            </select>
                        </div> */}
                        <SelectTag 
                            field="Qualification *"
                            name="qualification"
                            value={formData.qualification}
                            handleChangeFunc={handleChange}
                            options={qualificationOptions}
                        />

                        {/* Study Type */}
                        {/* <div>
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                Study Type *
                            </label>
                            <select
                                name="study_type"
                                value={formData.study_type}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                            >
                                <option value="full time">Full Time</option>
                                <option value="part time">Part Time</option>
                            </select>
                        </div> */}
                        <SelectTag 
                            field="Study Type *"
                            name="study_type"
                            value={formData.study_type}
                            handleChangeFunc={handleChange}
                            options={["full time", "part time"]}
                        />


                        {/* Start Date */}
                        {/* <div>
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className={`w-full bg-white/5 border ${
                                errors.start_date ? 'border-red-500/50' : 'border-white/20'
                                } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500`}
                            />
                            {errors.start_date && <p className="text-red-400 text-xs mt-1">{errors.start_date}</p>}
                        </div> */}
                        <InputTag 
                            label="Start Date *"
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            handleChangeFunc={handleChange}
                            error={errors.start_date}
                        />

                        {/* End Date */}
                        <div>
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                End Date *
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date === 'present' ? '' : formData.end_date}
                                    onChange={handleChange}
                                    disabled={formData.end_date === 'present'}
                                    className={`w-full bg-white/5 border ${
                                    errors.end_date ? 'border-red-500/50' : 'border-white/20'
                                    } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ 
                                        ...formData, 
                                        end_date: formData.end_date === 'present' ? '' : 'present' 
                                    })}
                                    className={`px-4 py-2 rounded-lg border transition-all ${
                                        formData.end_date === 'present'
                                        ? 'bg-purple-500/30 border-purple-500/50 text-purple-300'
                                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    Present
                                </button>
                            </div>
                            
                            {errors.end_date && <p className="text-red-400 text-xs mt-1">{errors.end_date}</p>}
                        </div>

                        {/* Description */}
                        {/* <div className="md:col-span-2">
                            <label className="block text-white/80 font-medium mb-2 text-sm">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your studies, achievements, courses..."
                                maxLength={300}
                                rows={3}
                                className={`w-full bg-white/5 border ${
                                errors.description ? 'border-red-500/50' : 'border-white/20'
                                } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 resize-none`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
                                <p className="text-white/40 text-xs ml-auto">{formData.description.length}/300</p>
                            </div>
                        </div> */}
                        <Description
                            value={formData.description}
                            handleChange={handleChange}
                            placeholder="Describe your studies, achievements, courses..."
                            maxLength={300}
                            rows={3}
                            errors={errors}
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
                            onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {editingId ? 'Update' : 'Add'} Education
                        </button> */}
                        <SaveButton 
                            field="Education" 
                            handleSave={handleSaveButton}
                            editingId={editingId}
                        />
                    </div>
                </div>
            )}
            
            {/* Education List */}
             <div className="space-y-6">
                {educations.length === 0 ? (
                    <p className="text-center text-white/50 py-8">No education records added yet</p>
                    ) : (
                    educations.map((edu) => (
                        <div
                            key={edu.education_id}
                            className="border-b border-white/10 pb-6 last:border-0 group"
                        >
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
                                🎓
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-1">{edu.qualification}</h3>
                                            <div className="text-pink-400 font-semibold mb-1">{edu.institution}</div>
                                            <div className="text-white/70 text-sm mb-2">{edu.field_of_study}</div>
                                            <div className="text-white/50 text-sm mb-3">
                                                {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                            </div>
                                            {/* <div className="flex gap-2 mb-3">
                                                <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-xs text-pink-200 capitalize">
                                                {edu.study_type}
                                                </span>
                                            </div> */}
                                            <Duration design="bg-pink-500/20 border-pink-500/30" duration={edu.study_type}/>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(edu)}
                                                className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {/* <button
                                                onClick={() => handleDelete(edu.education_id)}
                                                className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button> */}
                                            <DeleteButton onDelete={handleDelete} field_id={edu.education_id}/>
                                        </div>
                                    </div>
                                    <p className="text-white/70 leading-relaxed">{edu.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Education