import React, { useContext, useEffect, useState } from "react";
import { Web3SignIn } from "./components/account/Web3SignIn";
import { CurrentUserContext } from "./contexts/Store";
import Container from "react-bootstrap/Container";
import ResponsiveEmbed from "react-bootstrap/ResponsiveEmbed";
import { get } from "./utils/Requests";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("currentUser", currentUser);

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
      console.log(member);

      return <span key={idx}>{member.name} &nbsp;&nbsp;&nbsp;</span>;
    });
  };

  return (
    <div>
      <div className="App">
        {currentUser && currentUser.username ? (
          <p>{currentUser.username}</p>
        ) : (
          <Web3SignIn setCurrentUser={setCurrentUser} />
        )}
      </div>
      <Container style={{ width: '100%', height: 'auto' }}>
        <ResponsiveEmbed aspectRatio="16by9">
          <video autoplay="true" loop="true">
            <source src="/animation/RaidGuild1.mp4" type="video/mp4" />
          </video>
        </ResponsiveEmbed>
      </Container>
      <Container>
        <marquee>
          {members.length && renderMember()}
        </marquee>
      </Container>
    </div>
  );
}

export default App;
