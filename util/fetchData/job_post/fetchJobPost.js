import {toast} from "react-toastify"

// const getJobPost = async () => {
//     try {
//         //const token = localStorage.getItem('token'); // Retrieve the 1000d token
        
//         const response = await fetch("/api/jobpost", {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         const data = await response.json();
        
//         if (!response.ok) {
//             throw new Error(data.msg || 'Failed to fetch');
//         }
//         return data;
//     } catch (error) {
//         toast.error(error)
//         console.error(error);
//     }
// };
const getJobPost = async () => {
    const response = await fetch("/api/jobpost", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();
    return data;
};

const getOneJobPost = async (job_post_id) => {
    const response = await fetch(`/api/jobpost/${job_post_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response;
};


export {
    getJobPost,
    getOneJobPost
}