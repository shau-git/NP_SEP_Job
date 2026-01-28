import React from 'react'

const Profile = ({user, Camera, MapPin, Briefcase, name, image, role}) => {
    return (
        <div className="pt-20">
            <div className="max-w-7xl mx-auto px-5 py-9">
                <div className="bg-linear-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                    <div className="flex flex-col gap-7 items-center ">
                        {/* Profile Image */}
                        <div className="relative">
                            <div className="w-36 h-36 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white border-4 border-purple-400/50">
                                {user.image ? (
                                    <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div>{name.split(' ').map(n => n[0]).join('')}</div>
                                )}
                            </div>
                            <button className="cursor-pointer absolute bottom-2 right-1 w-11 h-11 bg-linear-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center border-3 border-slate-900 hover:scale-110 transition-transform">
                                <Camera className="w-4.5 h-4.5 text-white" />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center">
                            <h1 className="text-3xl font-bold text-white mb-1">{name}</h1>
                            <p className="text-lg text-purple-300 mb-3">{role}</p>
                            <div className="flex flex-wrap gap-4 justify-center text-white/70">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="text-[15px]">San Francisco, CA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    <span className="text-[15px]">Open to opportunities</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile