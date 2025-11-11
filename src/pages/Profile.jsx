"use client";

import { useEffect, useState } from "react";
import Achievements from "../components/Achievements";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${(p) => p.theme.surface};
  box-shadow: ${(p) => p.theme.cardShadow};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const UserCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2, #50e3c2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const StatRow = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
`;

const Stat = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.muted};

  strong {
    font-size: 20px;
    font-weight: 700;
    color: ${(p) => p.theme.text};
    display: block;
  }
`;

export default function Profile({ onCelebrate }) {
  const [activities, setActivities] = useState(() =>
    JSON.parse(localStorage.getItem("sc_activities") || "[]")
  );
  const [groups, setGroups] = useState(() =>
    JSON.parse(localStorage.getItem("sc_groups") || "[]")
  );
  const user = JSON.parse(localStorage.getItem("sc_user") || "null");

  useEffect(() => {
    const onStorage = () => {
      setActivities(JSON.parse(localStorage.getItem("sc_activities") || "[]"));
      setGroups(JSON.parse(localStorage.getItem("sc_groups") || "[]"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const totalCO2 = activities.reduce((s, a) => s + Number(a.co2 || 0), 0);
  const totalCost = activities.reduce((s, a) => s + Number(a.cost || 0), 0);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div style={{ paddingTop: 18 }}>
      <Grid>
        <UserCard style={{ gridColumn: "1 / -1" }}>
          <Avatar>{initials}</Avatar>
          <UserInfo>
            <h2 style={{ margin: 0 }}>{user?.name || "User"}</h2>
            <p style={{ color: "#6B7280", margin: "4px 0 0 0" }}>
              Member since {new Date().getFullYear()}
            </p>
            <StatRow>
              <Stat>
                <strong>{activities.length}</strong>
                Activities Tracked
              </Stat>
              <Stat>
                <strong>{groups.length}</strong>
                Groups Joined
              </Stat>
              <Stat>
                <strong>{totalCO2.toFixed(1)} kg</strong>
                Total CO₂
              </Stat>
              <Stat>
                <strong>₹{totalCost.toFixed(0)}</strong>
                Total Spent
              </Stat>
            </StatRow>
          </UserInfo>
        </UserCard>

        <Card style={{ gridColumn: "1 / -1" }}>
          <Achievements
            activities={activities}
            groups={groups}
            onCelebrate={onCelebrate}
          />
        </Card>
      </Grid>
    </div>
  );
}
