import React from "react";
import { Link } from "react-router-dom";
import Feeds from "../components/Feeds";
import "./Profile.css";
function Profile(props) {
  return (
    <>
      <div className="pageIdentify">Profile</div>

      <img
        src={
          props.currentUser
            ? props.currentUser.get("banner")
            : "https://ipfs.moralis.io:2053/ipfs/QmNgA9MNWFfRaoKzBt21VghQopnKXBgVxzyGvv5qjsV4Vw/media/2"
        }
        alt=""
        className="profileBanner"
      />
      <div className="pfpContainer">
        <img
          src={
            props.currentUser ? props.currentUser.get("pfp") : "../logo512.png"
          }
          alt=""
          className="profilePFP"
        />
        <div className="profileName">
          {props.currentUser ? props.currentUser.get("username") : ""}
        </div>
        <div className="profileWallet">
          {props.currentUser
            ? `${props.currentUser
                .get("address")
                .slice(0, 4)}...${props.currentUser.get("address").slice(38)}`
            : ""}
        </div>
        <Link to="/settings">
          <div className="profileEdit">Edit profile</div>
        </Link>
        <div className="profileBio">
          {props.currentUser ? props.currentUser.get("bio") : ""}
        </div>
        <div className="profileTabs">
          <div className="profileTab">Posts</div>
        </div>
      </div>
      <Feeds
        profile={true}
        allPosts={props.allPosts}
        tipPost={props.tipPost}
        currentUser={props.currentUser}
      />
    </>
  );
}

export default Profile;
