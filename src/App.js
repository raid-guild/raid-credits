import React, { useContext, useEffect, useState } from "react";

import { get } from "./utils/Requests";

import { Web3SignIn } from "./components/account/Web3SignIn";
import { CurrentUserContext } from "./contexts/Store";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import ResponsiveEmbed from "react-bootstrap/ResponsiveEmbed";
import YouTube from 'react-youtube';

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("currentUser", currentUser);

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const memberRes = await get(`raidbot/members`);
        console.log(memberRes);
        setMembers(memberRes.data.content);
        setLoading(false);
      } catch (err) {
        console.log("get err", err);
      }
    };

    fetchData();
  }, []);

  const renderMember = () => {
    return members.map((member, idx) => {
      return <span key={idx}>{member.name} &nbsp;&nbsp;&nbsp;</span>;
    });
  };

  return (
    <div>
      <style type="text/css">
        {`
    .btn-flat {
      background-color: purple;
      color: white;
    }

    .btn-xxl {
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
    }
    .big-text {
      font-size: 200px;
      color: magenta;
      
      position: absolute;
      bottom: 0px;
    }
    body {
      background-color: black;
    }
    `}
      </style>
      <div className="App">
        <Navbar bg="dark" variant="dark" fixed="bottom">
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
          {currentUser && currentUser.username ? (
            <Button>{currentUser.username}</Button>
          ) : (
            <Web3SignIn setCurrentUser={setCurrentUser} />
          )}
        </Navbar>

        <Container fluid style={{ height: "auto" }}>
          <ResponsiveEmbed aspectRatio="16by9">
            {/* <video autoplay="true" loop={true}>
              <source src="/animation/RaidGuild1.mp4" type="video/mp4" />
            </video> */}
            <YouTube videoId="h9T0ICrAzqU" opts={opts}  />
          </ResponsiveEmbed>
        </Container>
        <Container fluid className="big-text">
          {loading && <p>loading...</p>}
          {members.length > 0 && <marquee>{renderMember()}</marquee>}
        </Container>
      </div>
    </div>
  );
}

export default App;
