import {EditButton, Title} from "@/components/user/utils/utils_config"

const Language = ({languages}) => {
	const handleEdit = () => {
		console.log("")
	}
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
				<Title title="Languages"/>
                {/* <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button> */}
				        <EditButton {...{handleEdit}}/>
              </div>
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.language_id} className="flex justify-between items-center">
                    <span className="text-white font-medium">{lang.language}</span>
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
        </div>
    )
}

export default Language