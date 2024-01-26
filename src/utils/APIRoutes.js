export const host = process.env.NODE_ENV !== 'production' ? "http://localhost:5000" : "https://chatty-api-qof8.onrender.com"
// export const host = "http://localhost:5000"
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const usersRoute = `${host}/api/auth/getuser`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const searchRoute = `${host}/api/auth/search`;
export const friendRequest = `${host}/api/friends`
export const getFriendRoutes = `${host}/api/friends/getAllfriends`
export const updateRoutes = `${host}/api/auth/update`