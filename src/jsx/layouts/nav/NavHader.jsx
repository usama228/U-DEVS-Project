import React, { useContext } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { useDispatch , useSelector} from "react-redux";
import { navtoggle } from "../../../store/actions/AuthActions";
import { ThemeContext } from "../../../context/ThemeContext";
import logo from "../../../assets/images/menu-logo.png";
import logoText from "../../../assets/images/menu-logo.png";

const NavHader = () => {
 
  const {  openMenuToggle,  } = useContext(
    ThemeContext
  );
  const dispatch = useDispatch();
  const sideMenu = useSelector(state => state.sideMenu);
  const handleToogle = () => {
   	dispatch(navtoggle());
  };
  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo"> 
          <img src={logo} className="logo-abbr" alt="" />
          <img src={logoText} className="brand-title" alt="" />
      </Link>

      <div
          className="nav-control"
          onClick={() => {
              handleToogle()
              // openMenuToggle();                    
          }}
      >
        <div className={`hamburger ${sideMenu ? "is-active" : ""}`}>
            <span className="line"></span><span className="line"></span><span className="line"></span>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="22" y="11" width="4" height="4" rx="2" fill="#2A353A"/>
              <rect x="11" width="4" height="4" rx="2" fill="#2A353A"/>
              <rect x="22" width="4" height="4" rx="2" fill="#2A353A"/>
              <rect x="11" y="11" width="4" height="4" rx="2" fill="#2A353A"/>
              <rect x="11" y="22" width="4" height="4" rx="2" fill="#2A353A"/>
              <rect width="4" height="4" rx="2" fill="#2A353A"/>
              <rect y="11" width="4" height="4" rx="2" fill="#2A353A"/>
              <rect x="22" y="22" width="4" height="4" rx="2" fill="#2A353A"/>
              <rect y="22" width="4" height="4" rx="2" fill="#2A353A"/>
            </svg>	
        </div>
      </div>
    </div>
  );
};

export default NavHader;
