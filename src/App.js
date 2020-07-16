import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { get } from "./utils/Requests";

import { Web3SignIn } from "./components/account/Web3SignIn";
import { CurrentUserContext, Web3ConnectContext } from "./contexts/Store";
import abi from "./contracts/NftSale.json";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import ResponsiveEmbed from "react-bootstrap/ResponsiveEmbed";
//import YouTube from "react-youtube";
import PlayAudio from "react-simple-audio-player";
import Slide from "react-reveal/Slide";
import makeCarousel from "react-reveal/makeCarousel";
import chroma from "chroma-js";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const contractAddr = "0x3480a5E2E8A381F200F2e547f5aE6c3042e67449";

const colorScale = chroma.scale(["#ff3864", "#ffffff"]).mode("lch").colors(5);

const search = window.location.search;
const params = new URLSearchParams(search);
const raidIds = params.get("raid");

const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 500px;
`;
// width: 500px;
const CarouselUI = ({ children }) => (
  <CarouselContainer>{children}</CarouselContainer>
);
const Carousel = makeCarousel(CarouselUI);

function App() {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [web3Connect] = useContext(Web3ConnectContext);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setTxloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const memberRes = await get(`raidbot/members`);
        const raidParty = [];
        memberRes.data.content.forEach((member) => {
          if (raidIds && raidIds.indexOf(member.memId) > -1) {     
            raidParty.push({
              name: member.name + " - " + member.class,
              class: "Raid Party"
            });
          }
        });
        
        setMembers([ ...memberRes.data.content, ...raidParty ]);
        setLoading(false);
      } catch (err) {
        console.log("get err", err);
      }
    };

    fetchData();
  }, []);

  const mintNFT = async (badgeHash) => {
    setTxloading(true);
    
    const contract = new web3Connect.web3.eth.Contract(abi, contractAddr);
    try {
      const txReceipt = await contract.methods
        .mintNFT(
          "https://gateway.pinata.cloud/ipfs/" + badgeHash
        )
        .send({ from: currentUser.username, value: "100000000000000000" });
      console.log("txReceipt", txReceipt);
      const tokenId = txReceipt.events.Transfer.returnValues.tokenId;

      console.log(tokenId);
    } catch {
      console.log("rejected");
    } finally {
      setTxloading(false);
      return true;
    }
  };

  const renderMember = () => {
    const groups = [...new Set(members.map((item) => item.class))];
    
    return (
      <Carousel defaultWait={6000} maxTurns={100}>
        {groups
        .sort(function(x,y){ return x === "Raid Party" ? -1 : y === "Raid Party" ? 1 : 0; })
        .map((group, idx) => {
          return (
            <Slide right key={idx}>
              <div style={{ fontSize: 32 }}>
                <h4>{group}</h4>
                <ul>
                  {members
                    .filter((member) => member.class === group)
                    .map((member, idx) => {
                      return (
                        <li style={{ float: "left" }} key={idx}>
                          {member.name} &nbsp;&nbsp;&nbsp;
                        </li>
                      );
                    })}
                  <p style={{ clear: "both" }}>&nbsp;</p>
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
          <Navbar.Brand href="https://raidguild.org/">RaidGuild</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="https://discord.gg/aSBzBha">Discord</Nav.Link>
            <Nav.Link href="https://github.com/orgs/raid-guild/">
              Github
            </Nav.Link>
            <Nav.Link href="https://medium.com/raid-guild">Medium</Nav.Link>
            <Nav.Link href="https://handbook.raidguild.org">Handbook</Nav.Link>
          </Nav>
          {currentUser && currentUser.username ? (

            <Button onClick={() => mintNFT("Qmcu21fue2g7NKTosa7jnpAYbJGGx3iupwJNApKhoLLCbr")}>Mint nft and show support ( .1 eth)</Button>

          ) : (
            <Web3SignIn setCurrentUser={setCurrentUser} />
          )}
        </Navbar>

        <Container
          fluid
          style={{
            height: "auto",
            marginTop: "-5.3vw",
            marginBottom: "-6vw",
            padding: "0",
          }}
        >
          <ResponsiveEmbed aspectRatio="16by9">
            <video autoPlay={true} muted loop={true}>
              <source src="/animation/RaidGuild1.mp4" type="video/mp4" />
            </video>
            {/* <YouTube videoId="h9T0ICrAzqU" opts={opts} /> */}
          </ResponsiveEmbed>
        </Container>

        <Container fluid>
          {loading && <p>loading...</p>}
          {members.length > 0 && renderMember()}
        </Container>
        <Container fluid className="fixed-top">
          <PlayAudio url={"/animation/Voyager.ogg"} colorScale={colorScale} />
        </Container>
      </div>
    </div>
  );
}

export default App;
