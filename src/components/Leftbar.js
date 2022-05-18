import React from "react";
import "./Leftbar.css";
import { Icon } from "web3uikit";
import { Link } from "react-router-dom";
function Leftbar(props) {
  return (
    <div className="siderContent">
      <div className="menu">
        <div className="details">
          <Icon fill="white" size={35} svg="cube" />
          Cyber Block
        </div>
        <Link to="/" className="link">
          <div className="menuItems">
            <Icon fill="white" size={35} svg="list" />
            Home
          </div>
        </Link>
        <Link to="/profile" className="link">
          <div className="menuItems">
            <Icon fill="white" size={35} svg="user" />
            Profile
          </div>
        </Link>
        <Link to="/settings" className="link">
          <div className="menuItems">
            <Icon fill="white" size={35} svg="cog" />
            Settings
          </div>
        </Link>
      </div>
      {props.currentUser ? (
        <div className="details">
          <img
            src={
              props.currentUser.get("pfp")
                ? props.currentUser.get("pfp")
                : "../logo512.png"
            }
            alt=""
            className="profilePic"
          />
          <div className="profile">
            <div className="who">
              {props.currentUser.get("username").length > 8
                ? `${props.currentUser.get("username").slice(0, 8)}...`
                : props.currentUser.get("username")}
            </div>
            <div className="accWhen">{`${props.currentUser
              .get("address")
              .slice(0, 4)}...${props.currentUser
              .get("address")
              .slice(38)}`}</div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Leftbar;
