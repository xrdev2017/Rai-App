export const checkIsFollowing = (following = [], user = "") => {
    // console.log(following, user);
    
  if (!user) return false;
  return following.includes(user);
};