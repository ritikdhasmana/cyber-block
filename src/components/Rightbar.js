import React, { useEffect, useState, useRef } from "react";
import "./Rightbar.css";
import { useMoralis } from "react-moralis";
import { Input } from "web3uikit";
import { Link } from "react-router-dom";
function Rightbar() {
  const { Moralis } = useMoralis();
  const [users, setUsers] = useState();
  const cbUser = Moralis.Object.extend("cbUser");
  const query = new Moralis.Query(cbUser);
  const curAddress = Moralis.User.current().get("ethAddress");

  //for auto complete search bar
  const [display, setDisplay] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      let res = await query.find();
      const allUsers = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].get("address").toLowerCase() !== curAddress.toLowerCase()) {
          allUsers.push(res[i]);
        }
        if (allUsers.length > 10) break;
      }
      setUsers(() => allUsers);
    };
    fetchData();
  }, [users]);

  //hide option when clicked outside option field
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideAS);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAS);
    };
  });

  const handleClickOutsideAS = (event) => {
    const { current: wrap } = wrapperRef;
    console.log("clicked", event);
    console.log(wrap);
    if (!wrap || !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  return (
    <div className="rightbarContent">
      <Input
        ref={wrapperRef}
        label="Search User"
        prefixIcon="search"
        labelBgColor="#141d26"
        onClick={() => setDisplay(!display)}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      ></Input>
      {display && (
        <div className="autoContainer" ref={wrapperRef}>
          {users
            .filter((user) => {
              return (
                user.get("username").indexOf(search.toLowerCase()) > -1 ||
                user.get("address").indexOf(search.toLowerCase()) > -1
              );
            })
            .map((e, index) => {
              return (
                <Link
                  to={`/visit-profile/${e.get("address").toLowerCase()}`}
                  key={index}
                >
                  <div className="option">
                    <img
                      src={e.get("pfp") ? e.get("pfp") : "../logo512.png"}
                      alt=""
                      className="profilePic"
                    />
                    <div className="profile">
                      <div className="who rightbarwho">
                        {e.get("username").length > 8
                          ? `${e.get("username").slice(0, 8)}...`
                          : e.get("username")}
                      </div>
                      <div className="accWhen">{`${e
                        .get("address")
                        .slice(0, 4)}...${e.get("address").slice(38)}`}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}

      <div className="trends">
        People you may know
        {users ? (
          users.map((e, index) => {
            return (
              <Link
                to={`/visit-profile/${e.get("address").toLowerCase()}`}
                key={index}
              >
                <div className="details rightbar-profile">
                  <img
                    src={e.get("pfp") ? e.get("pfp") : "../logo512.png"}
                    alt=""
                    className="profilePic"
                  />
                  <div className="profile">
                    <div className="who">
                      {e.get("username").length > 8
                        ? `${e.get("username").slice(0, 8)}...`
                        : e.get("username")}
                    </div>
                    <div className="accWhen">{`${e
                      .get("address")
                      .slice(0, 4)}...${e.get("address").slice(38)}`}</div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Rightbar;
