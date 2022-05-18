import React, { useRef, useState } from "react";
import { useMoralis } from "react-moralis";
import "./Settings.css";
import { Input } from "web3uikit";
function Settings() {
  const { Moralis } = useMoralis();
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();

  //FOR PROFILE PICTURE
  const inputPFPFile = useRef(null);
  const [rawPFPFile, setRawPFPFile] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const handleChange = (event) => {
    const img = event.target.files[0];
    setRawPFPFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };
  const onImageClick = () => {
    inputPFPFile.current.click();
  };

  //FOR BANNER IMAGE
  const inputBannerFile = useRef(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState();
  const [rawBannerFile, setRawBannerFile] = useState();
  const handleBannerChange = (event) => {
    const img = event.target.files[0];
    setRawBannerFile(img);
    setSelectedBannerFile(URL.createObjectURL(img));
  };
  const onBannerImageClick = () => {
    inputBannerFile.current.click();
  };

  const saveChanges = async () => {
    const user = await Moralis.User.currentAsync();
    const address = user.get("ethAddress");
    const cbUser = Moralis.Object.extend("cbUser");
    const query = new Moralis.Query(cbUser);
    query.equalTo("address", address);
    let res = await query.find();
    let myDetails = res[0];
    if (!myDetails) {
      myDetails = new cbUser();
      const user = await Moralis.User.currentAsync();
      myDetails.set("address", user.get("ethAddress").toLowerCase());
      myDetails.set("bio", "");
      myDetails.set("username", "");
      myDetails.set("pfp", "null");
      myDetails.set("banner", "null");
    }
    if (bio) {
      myDetails.set("bio", bio);
    }
    if (username) {
      myDetails.set("username", username);
    }
    if (rawPFPFile) {
      const data = rawPFPFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      myDetails.set("pfp", file.ipfs());
    }
    if (rawBannerFile) {
      const data = rawBannerFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      myDetails.set("banner", file.ipfs());
    }
    await myDetails.save();
    window.location.reload();
  };
  return (
    <>
      <div className="pageIdentify">Settings</div>
      <div className="settingPage">
        <Input
          label="Name"
          name="nameChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Bio"
          name="bioChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setBio(e.target.value)}
        />
        {selectedFile && (
          <img src={selectedFile} alt="test" className="profilePic"></img>
        )}

        <div className="inputPFP" onClick={onImageClick}>
          <input
            type="file"
            name="file"
            ref={inputPFPFile}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          Select pfp
        </div>
        {selectedBannerFile && (
          <img src={selectedBannerFile} className="banner" alt="test"></img>
        )}

        <div className="inputPFP" onClick={onBannerImageClick}>
          <input
            type="file"
            name="file"
            ref={inputBannerFile}
            onChange={handleBannerChange}
            style={{ display: "none" }}
          />
          Select Banner
        </div>
        <div className="save" onClick={() => saveChanges()}>
          Save
        </div>
      </div>
    </>
  );
}

export default Settings;
