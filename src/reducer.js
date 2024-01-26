const data = JSON.parse(localStorage.getItem('User'));

export const initialState = {
    _id: data?._id,
    username: data?.username,
    email: data?.email,
    isAvatarImageSet: data?.isAvatarImageSet,
    avatarImage: data?.avatarImage
}

export const reducer = (state, action) => {
    switch(action.type){
        case "ADD_USER":
            const data = JSON?.parse(localStorage.getItem('User'))
            return{
                ...state,
                _id: data?._id,
                username: data?.username,
                email: data?.email,
                isAvatarImageSet: data?.isAvatarImageSet,
                avatarImage: data?.avatarImage
            }
            // return{
            //     ...action.payload
            // }
        case "REMOVE_USER":
            Object.keys(initialState).forEach(key =>{
                initialState[key] = null;
            })
            return{initialState}
        case "UPDATE_USER":
            return{
                ...state,
                username: action.username
            }
        default:
            return {state}
    }
}