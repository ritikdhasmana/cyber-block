import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";
import { useMoralis } from "react-moralis";
function Visitprofile(props) {
  const { Moralis } = useMoralis();
  const { address } = useParams();
  const [cbUser, setCbUser] = useState();
  const [userPosts, setUserPosts] = useState([]);

  const curUser = Moralis.Object.extend("cbUser");
  const query = new Moralis.Query(curUser);
  useEffect(() => {
    const fetchData = async () => {
      query.equalTo("address", address.toLowerCase());
      const res = await query.find();
      setCbUser(() => res[0]);
      return res[0];
    };
    const fetchUserPosts = () => {
      const posts = [];
      props.allPosts.map((post) => {
        if (post.creator.toLowerCase() === address.toLowerCase()) {
          posts.push(post);
        }
        return 1;
      });
      return posts;
    };

    if (address) {
      // setCbUser(() => fetchData());
      fetchData();
    }
    if (props.allPosts) setUserPosts(() => fetchUserPosts());
  }, [address, props.allPosts]);

  return (
    <>
      <div className="pageIdentify">Profile</div>

      <img
        src={
          cbUser
            ? cbUser.get("banner")
            : "https://ipfs.moralis.io:2053/ipfs/QmNgA9MNWFfRaoKzBt21VghQopnKXBgVxzyGvv5qjsV4Vw/media/2"
        }
        alt=""
        className="profileBanner"
      />
      <div className="pfpContainer">
        <img
          src={cbUser ? cbUser.get("pfp") : "../logo512.png"}
          alt=""
          className="profilePFP"
        />
        <div className="profileName">
          {cbUser ? cbUser.get("username") : ""}
        </div>
        <div className="profileWallet">
          {cbUser
            ? `${cbUser.get("address").slice(0, 4)}...${cbUser
                .get("address")
                .slice(38)}`
            : ""}
        </div>
        <div className="profileBio">{cbUser ? cbUser.get("bio") : ""}</div>
        <div className="profileTabs">
          <div className="profileTab">Posts</div>
        </div>
      </div>
      <>
        {userPosts.length ? (
          userPosts
            .map((post, index) => {
              return (
                <div className="feedPost" key={index}>
                  <img
                    src={cbUser ? cbUser.get("pfp") : "../logo512.png"}
                    alt="pfp"
                    className="profilePic"
                  />
                  <div className="completePost">
                    <div className="who">
                      {cbUser ? cbUser.get("username") : ""}
                    </div>
                    <div className="accWhen">
                      {cbUser
                        ? `${cbUser.get("address").slice(0, 4)}...${cbUser
                            .get("address")
                            .slice(38)}`
                        : ""}
                    </div>
                    <div className="PostContent">
                      {post.text}
                      <img src={post.img} alt="" className="postImg" />
                    </div>
                  </div>
                </div>
              );
            })
            .reverse()
        ) : (
          <div></div>
        )}
      </>
    </>
  );
}

export default Visitprofile;
