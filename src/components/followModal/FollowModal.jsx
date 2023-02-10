import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import './followModal.css'
import { Link,useParams } from "react-router-dom";
import axios from '../../axios'
function FollowModal({setIsOpen2, allUsers,ofUser,followings}){
  const { currentUser, config, setCurrentUser } = useContext(AuthContext);

    //  console.log(allUsers.allUsers,"-----");
    const users =allUsers.allUsers;
    const queryClient =useQueryClient();
    const altImg = "https://avatars.githubusercontent.com/u/69767?v=4";
    const modalHandler = () =>{
        setIsOpen2(false)
        queryClient.invalidateQueries(["user"])
    }

    const { id } = useParams();
    const userId = id;


  const unfollowuser=async (e,unuser)=>{
    e.preventDefault();
    console.log('cljzhchvnkd');
    console.log(unuser);

    // const userId=user
    console.log(currentUser._id);
    return await axios
    .put(`users/${unuser}/unfollow`, {}, config)
    .then(() => {
      setCurrentUser((prev) => {
        // prev.followings.push(userId);
        
        const index = prev.followings.indexOf(userId);
        if (index > -1&&prev.followings.includes(userId)) {
          // only splice array when item is found
          prev.followings.splice(index, 1);
        console.log(prev.followings, userId);
        // 2nd parameter means remove one item only
        }
        let followings = prev.followings;
        return { ...currentUser, followings };
      });
    });

    

  }
    return (
        <div className="modalBackground" onClick={() => {
            setIsOpen2();
          }}>
          <div className="modalContainer animate-slideleft">
            <div className="titleCloseBtn">
              <button
                onClick={()=>setIsOpen2()}
              >
                X
              </button>
            </div>
            <div className="title">
                {followings?
              <h1>People {ofUser.username} follows</h1>
                : <h1>People following {ofUser.username} </h1> }
            </div>
            <div className="body overflow-x-auto">
              
    
            {followings?users.map(user=>(
                user.followers.includes(ofUser._id) && <div className="user">
                <div className="userInfoc flex items-center justify-between mt-5 hover:bg-gray-300 rounded-full" key = {user._id}  onClick={()=>modalHandler()} >
                 <div className="flex items-center justify-start">
                 <Link
                  to={`/profile/${user._id}`}>
                  <img className="rounded-full w-20 h-20 object-cover" src={user.profilePicture || altImg } />
                  </Link>
                  <Link to={`/profile/${user._id}`}>
                  <span className="font-bold ml-10 text-xl hover:from-stone-300">{user.username}</span>
                  </Link>
                 </div>
                 {currentUser._id === userId ? <button onClick={(e)=>unfollowuser(e,user._id)}>Unfollow</button> : ''}
                </div>
                
              </div>
              )):
              users.map(user=>(
                user.followings.includes(ofUser._id) && <div className="user">
                <div className="userInfo flex items-center mt-5 hover:bg-gray-300 rounded-full" key = {user._id}  onClick={()=>modalHandler()} >
                  <Link
                  to={`/profile/${user._id}`}>
                  <img className="rounded-full w-20 h-20 object-cover" src={user.profilePicture || altImg } />
                  </Link>
                  <Link to={`/profile/${user._id}`}>
                  <span className="font-bold ml-10 text-xl hover:from-stone-300">{user.username}</span>
                  </Link>
                </div>
                
              </div>
              ))
              
              
              
              }
    
    
    
            </div>
            <div className="footer">
              {/* <button
                onClick={() => {
                  setIsOpen2(false);
                }}
                id="cancelBtn"
              >
                Cancel
              </button> */}
            </div>
          </div>
        </div>
      );
    }
    
    export default FollowModal;
    