import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Link } from "react-router-dom";
import Web3 from "web3";
import "./Feeds.css";
const Feeds = (props) => {
  const web3 = new Web3(window.ethereum);
  const { Moralis } = useMoralis();
  const [users, setUsers] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const curAddress = Moralis.User.current().get("ethAddress");
  const fetchUserPosts = async () => {
    const posts = [];
    // const user = await Moralis.User.currentAsync();
    props.allPosts.map((post) => {
      if (post.creator.toLowerCase() === curAddress.toLowerCase()) {
        posts.push(post);
      }
    });
    setMyPosts(() => posts);
    return posts;
  };
  useEffect(() => {
    const fetchData = async () => {
      const cbUser = Moralis.Object.extend("cbUser");
      const query = new Moralis.Query(cbUser);
      let allusers = [];
      for (let i = 0; i < props.allPosts.length; i++) {
        query.equalTo("address", props.allPosts[i].creator.toLowerCase());
        const res = await query.find();

        const user = res[0];
        console.log(user);
        if (user) {
          allusers.push({
            address: user.get("address"),
            pfp: user.get("pfp"),
            username: user.get("username"),
          });
        }
      }
      setUsers(() => allusers);
      return allusers;
    };
    if (props.allPosts) {
      fetchData();
      fetchUserPosts();
    }
  }, [props.allPosts, props.currentUser, Moralis]);

  return (
    <>
      {props.profile ? (
        myPosts.length ? (
          myPosts
            .map((post, index) => {
              return (
                <div className="feedPost" key={index}>
                  <img
                    src={
                      props.currentUser
                        ? props.currentUser.get("pfp")
                        : "../logo512.png"
                    }
                    alt="pfp"
                    className="profilePic"
                  />
                  <div className="completePost">
                    <div className="who">
                      {props.currentUser
                        ? props.currentUser.get("username")
                        : ""}
                    </div>
                    <div className="accWhen">
                      {props.currentUser
                        ? `${props.currentUser
                            .get("address")
                            .slice(0, 4)}...${props.currentUser
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
          <div>No post.</div>
        )
      ) : props.allPosts && users.length ? (
        props.allPosts
          .map((post, index) => {
            let creator = users.find((user) => {
              return user.address.toLowerCase() === post.creator.toLowerCase();
            });
            let { pfp, username } = creator
              ? creator
              : { address: "address", pfp: "pfp", username: "" };
            return (
              <div className="feedContainer" key={index}>
                <div className="feedPost">
                  <Link
                    to={
                      post.creator.toLowerCase() === curAddress.toLowerCase()
                        ? "/profile"
                        : `/visit-profile/${post.creator.toLowerCase()}`
                    }
                  >
                    <img src={pfp} alt="" className="profilePic" />
                  </Link>
                  <div className="completePost">
                    <div className="who">{username}</div>
                    <div className="accWhen">{`${post.creator.slice(
                      0,
                      4
                    )}...${post.creator.slice(38)}`}</div>
                    <div className="PostContent">
                      {post.text}
                      <img src={post.img} alt="" className="postImg" />
                    </div>
                  </div>
                </div>
                <div className="postOptions">
                  <div className="tip">
                    {`Tips earned: ${web3.utils.fromWei(
                      post.tipGenerated.toString(),
                      "Ether"
                    )}`}
                  </div>
                  <div
                    className="post"
                    onClick={() => props.tipPost(index + 1, "0.01")}
                  >
                    Tip
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
  );
};

export default Feeds;
