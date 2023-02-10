import "./leftBar.scss";
// import home from '../../assets/11.png'
// import messages from '../../assets/10.png'
// import notifications from '../../assets/14.jpg'
import { FcHome } from "react-icons/fc";
import { FcGlobe } from "react-icons/fc";
import { FcSms } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie';
import { useQuery } from '@tanstack/react-query';
import axios from "../../axios"
const LeftBar = () => {
 
  const { currentUser,setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate()
  const { toggle, darkMode } = useContext(DarkModeContext);
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const cookies = new Cookies();

  const handleLogout = () => {
    Swal.fire({
      title: 'Do you want to logout?',
     
      showCancelButton: true,
      confirmButtonText: 'Yes',
    
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
       
      }
    }).then((result) => {
      if (result.isConfirmed) {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setCurrentUser(false)
    navigate('/login')
      } else if (result.isDenied) {
        
      }
    })
    
  
  };
  const { isLoading, error, data } = useQuery(["notifications"], () => 
    axios.get(`/notifications/${currentUser._id}`)
      .then(({ data }) => {
        setNotifications(data)
        return data;
      }).catch((error) => console.log(error))
 
  );
  useEffect(() => {
    notifications &&
      setCount(notifications.filter(e => e.isVisited === false).length)
  }, [notifications])
  return (
    <div className="leftBar">
          <Link to="/" style={{ textDecoration: "none",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span className="logo" style={{fontSize:"50px",fontWeight:"bolder"}}>ZOKO</span>
        </Link>

      <div className="container">
        <div className="menu">
        <Link to="/" style={{ textDecoration: "none",padding:"0",margin:"0" }} replace>
          <div className="item">
          
            {/* <HomeOutlinedIcon/> */}
            {/* <img src={home} alt="" /> */}
            <FcHome/>
            {/* <img src="../../assets/3.png" alt="" /> */}
            <span>Home</span>
           
          </div>
          </Link>
          <Link to='/messages' style={{ textDecoration: "none",padding:"0",margin:"0" }}>
          <div className="item">
            {/* <img src={messages} alt="" /> */}
            {/* <EmailOutlinedIcon/> */}
            <FcSms/>
            <span>Messages</span>
          </div>
          </Link>
          <Link to='/notifications' style={{ textDecoration: "none",padding:"0",margin:"0" }}>
          <div className="item">
            {/* <NotificationsOutlinedIcon/>{count > 0 && <span className='absolute px-1 py-0.3 bg-red-600 text-white rounded-full text-xs mt-2.5 ml-3.5'> {count}</span>} */}
            {/* <img src={notifications} alt="" /> */}
            <FcGlobe/>
            <span>Notifications</span>
          </div>
          </Link>
        <Link to={'/profile/'+currentUser._id} style={{ textDecoration: "none",padding:"0",margin:"0" }}>

          <div className="item">
            <FcPortraitMode/>
            {/* <img
              src={currentUser.profilePicture}
              alt=""
            /> */}
            <span>Profile</span>
          </div>
          </Link>
          {/* <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div> */}
        </div>
        <hr />
        <div className="menu">
          <span>more</span>
          <div className="item">
          {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}<span>Dark/light</span>
          </div>
          <div className="item" onClick={()=>{handleLogout()}}>
          <ExitToAppIcon className="icon" style={{"paddingLeft":"0","fontSize":"1.5rem"}}/>
            <span>Logout</span>
          </div>
          {/* <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div> */}
        </div>
        {/* <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LeftBar;
