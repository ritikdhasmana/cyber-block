import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useMoralis } from "react-moralis";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import Settings from "./pages/Settings.js";
import "./App.css";
import Leftbar from "./components/Leftbar";
import Rightbar from "./components/Rightbar";
import Visitprofile from "./pages/Visitprofile.js";
import { ConnectButton, Icon } from "web3uikit";

import Web3 from "web3";
import contractData from "./contracts/Posts.json";
import contractAddress from "./contracts/contractAddress.json";
const App = () => {
  const web3 = new Web3(window.ethereum);
  const { isAuthenticated, Moralis } = useMoralis();
  const [contract, setContract] = useState();
  const [allPosts, setAllPosts] = useState();
  const [currentUser, setCurrentUser] = useState();

  const fetchMetaData = async () => {
    try {
      console.log("fetching data...");
      const Contract = await new web3.eth.Contract(
        contractData.abi,
        contractAddress.MeterTestnet
      );
      setContract(() => Contract);
      let txn = await Contract.methods.getPostCount().call();
      const postCount = txn;
      console.log(postCount);
      const posts = [];
      for (let i = 1; i <= postCount; i++) {
        let txn = await Contract.methods.getPost(i).call();
        posts.push(txn);
      }
      if (posts.length > 0) {
        setAllPosts(() => posts);
      }
      console.log("posts: ", posts);

      //fetching user profile
      const cbUser = Moralis.Object.extend("cbUser");
      const query = new Moralis.Query(cbUser);
      const user = await Moralis.User.currentAsync();
      query.equalTo("address", user.get("ethAddress").toLowerCase());
      const res = await query.find();
      setCurrentUser(() => res[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchMetaData();
    }
  }, [isAuthenticated]);

  const createPost = async (postText, postImg) => {
    try {
      const user = await Moralis.User.currentAsync();
      console.log(user.get("ethAddress"));
      await contract.methods
        .createPost(postText, postImg)
        .send({ from: user.get("ethAddress") });
      console.log("post created");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const tipPost = async (postId, tipAmount) => {
    try {
      const user = await Moralis.User.currentAsync();
      console.log(user.get("ethAddress"));
      await contract.methods.tip(postId).send({
        from: user.get("ethAddress"),
        value: web3.utils.toWei(tipAmount, "ether"),
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isAuthenticated ? (
        <div className="page">
          <div className="sideBar">
            <Leftbar currentUser={currentUser} />
            <div
              className="logout"
              onClick={() => {
                Moralis.User.logOut().then(() => {
                  window.location.reload();
                });
              }}
            >
              Logout
            </div>
          </div>
          <div className="mainWindow">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    createPost={createPost}
                    allPosts={allPosts}
                    tipPost={tipPost}
                    currentUser={currentUser}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    allPosts={allPosts}
                    tipPost={tipPost}
                    currentUser={currentUser}
                  />
                }
              />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/visit-profile/:address"
                element={<Visitprofile allPosts={allPosts} />}
              />
            </Routes>
          </div>
          <div className="rightBar">
            <Rightbar />
          </div>
        </div>
      ) : (
        <div className="loginPage">
          <Icon fill="white" size={65} svg="cube" />
          Cyber Block
          <ConnectButton />
        </div>
      )}
    </>
  );
};

export default App;
