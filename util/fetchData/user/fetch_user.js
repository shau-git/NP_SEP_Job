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
const getUser = async (user_id) => {
    const response = await fetch(`/api/user/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response;
};


const updateUser = async (field, field_id,  reqBody) => {
    const response = await fetch(`/api/${field}/${field_id}`, {
        method: 'PUT', //
        headers: {
            'Content-Type': 'application/json', 
        },
        // The body must be stringified
        body: JSON.stringify(reqBody)
    });
    return response;
};

const addUserData = async (user_id, reqBody, field) => {

    const response = await fetch(`/api/user/${user_id}/${field}`, {
        method: 'POST', //
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(reqBody)
    });
    return response;
}


const deleteUserData = async (field, field_id) => {
    
    const response = await fetch(`/api/${field}/${field_id}`, {
        method: 'DELETE', //
        headers: {
            'Content-Type': 'application/json', 
        }
    });
    return response;
}

export {
    getUser,
    updateUser,
    addUserData,
    deleteUserData
}