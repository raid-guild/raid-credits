import React, { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { get } from "./utils/Requests";

import { Web3SignIn } from "./components/account/Web3SignIn";
import { CurrentUserContext } from "./contexts/Store";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import ResponsiveEmbed from "react-bootstrap/ResponsiveEmbed";
import YouTube from "react-youtube";
import Slide from "react-reveal/Slide";
import makeCarousel from "react-reveal/makeCarousel";

import "bootstrap/dist/css/bootstrap.min.css";

const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 500px;
  height: 500px;
`;
const CarouselUI = ({ children }) => (
  <CarouselContainer>{children}</CarouselContainer>
);
const Carousel = makeCarousel(CarouselUI);

function App() {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
      mute: 1,
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
    const groups = [
      ...new Set(
        members.map((item) => (item.class))
      ),
    ];
    return (
      <Carousel defaultWait={3000}>
        {groups.map((group, idx) => {
          return (
            <Slide right key={idx}>
              <div>
                <h4>{group}</h4>
                <ul>
                  {members
                    .filter((member) => member.class === group)
                    .map((member, idx) => {
                      return (
                        <li key={idx}>{member.name} &nbsp;&nbsp;&nbsp;</li>
                      );
                    })}
                </ul>
              </div>
            </Slide>
          );
        })}
      </Carousel>
    );
  };

  return (
    <div>
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
            <video autoPlay={true} loop={true}>
              <source src="/animation/RaidGuild1.mp4" type="video/mp4" />
            </video>
            {/* <YouTube videoId="h9T0ICrAzqU" opts={opts} /> */}
          </ResponsiveEmbed>
        </Container>
        <Container fluid className="big-text">
          {loading && <p>loading...</p>}
          {members.length > 0 && renderMember()}
        </Container>
      </div>
    </div>
  );
}

export default App;
