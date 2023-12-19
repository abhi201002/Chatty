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
            const data = JSON.parse(localStorage.getItem('User'))
            return{
                ...state,
                _id: data?._id,
                username: data?.username,
                email: data?.email,
                isAvatarImageSet: data?.isAvatarImageSet,
                avatarImage: data?.avatarImage
            }
        case "REMOVE_USER":
            Object.keys(initialState).forEach(key =>{
                initialState[key] = null;
            })
            return{initialState}
        default:
            return {state}
    }
}