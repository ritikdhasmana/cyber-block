import React, { useState, useRef } from "react";
import Feeds from "../components/Feeds";
import "./Home.css";
import { TextArea, Icon } from "web3uikit";

import { useMoralis } from "react-moralis";

const Home = (props) => {
  const { Moralis } = useMoralis();
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [rawFile, setRawFile] = useState();
  const handleChange = (event) => {
    const img = event.target.files[0];
    setRawFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };
  const onImageClick = () => {
    inputFile.current.click();
  };

  const [post, setPost] = useState();
  const savePost = async () => {
    console.log("saving on chain....");
    if (!post) return;
    let img;
    if (rawFile) {
      const data = rawFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      img = file.ipfs();
    } else {
      img = "No Img";
    }
    await props.createPost(post, img);
  };
  return (
    <>
      <div className="pageIdentify">Home</div>
      <div className="mainContent">
        <div className="profilePost">
          <img
            src={
              props.currentUser
                ? props.currentUser.get("pfp")
                : "../logo512.png"
            }
            alt="test"
            className="profilePic"
          />
          <div className="postBox">
            <TextArea
              label=""
              name="postTxtArea"
              value="Hello chat!"
              type="text"
              width="95%"
              onChange={(e) => setPost(e.target.value)}
            ></TextArea>
            {selectedFile && (
              <img src={selectedFile} alt="test" className="postImg"></img>
            )}
            <div className="imgOrPost">
              <div className="imgDiv" onClick={onImageClick}>
                <input
                  type="file"
                  name="file"
                  ref={inputFile}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <Icon fill="#1DA1F2" size={27} svg="image"></Icon>
              </div>
              <div className="postOptions">
                <div className="post" onClick={() => savePost()}>
                  Post
                </div>
              </div>
            </div>
          </div>
        </div>
        <Feeds
          profile={false}
          allPosts={props.allPosts}
          currentUser={props.currentUser}
          tipPost={props.tipPost}
        ></Feeds>
      </div>
    </>
  );
};

export default Home;
