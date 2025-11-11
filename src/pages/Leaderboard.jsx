"use client";

import { useState, useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${(p) => p.theme.text};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${(p) => p.theme.muted};
  font-size: 16px;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  border: 2px solid
    ${(p) => (p.$active ? p.theme.primary : p.theme.borderColor)};
  background: ${(p) => (p.$active ? p.theme.primary : "transparent")};
  color: ${(p) => (p.$active ? "white" : p.theme.text)};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(p) => p.theme.cardShadow};
  }
`;

const LeaderboardCard = styled(motion.div)`
  background: ${(p) => p.theme.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${(p) => p.theme.cardShadow};
  border: 1px solid ${(p) => p.theme.borderColor};
`;

const PodiumSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 32px;
  padding: 32px 0;
`;

const PodiumCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${(p) => {
    if (p.$rank === 1) return "linear-gradient(135deg, #FFD700, #FFA500)";
    if (p.$rank === 2) return "linear-gradient(135deg, #C0C0C0, #A8A8A8)";
    return "linear-gradient(135deg, #CD7F32, #B8860B)";
  }};
  padding: 24px 20px;
  border-radius: 16px;
  min-width: 140px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  ${(p) => p.$rank === 1 && "transform: scale(1.1); z-index: 2;"}
  ${(p) => p.$rank === 2 && "transform: translateY(10px);"}
  ${(p) => p.$rank === 3 && "transform: translateY(20px);"}
`;

const Crown = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #1b5e3f;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PodiumName = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: white;
  margin-bottom: 4px;
`;

const PodiumScore = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RankingItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${(p) => p.theme.glass};
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.borderColor};
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: ${(p) => p.theme.cardShadow};
  }
`;

const Rank = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${(p) => p.theme.primary};
  min-width: 40px;
  text-align: center;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.primary},
    ${(p) => p.theme.secondary}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${(p) => p.theme.text};
`;

const UserStats = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.muted};
  margin-top: 2px;
`;

const Score = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => p.theme.primary};
  text-align: right;
`;

const ScoreLabel = styled.div`
  font-size: 12px;
  color: ${(p) => p.theme.muted};
`;

// Generate mock leaderboard data
const generateMockUsers = () => {
  const names = [
    "Alex Chen",
    "Maria Garcia",
    "John Smith",
    "Priya Patel",
    "David Lee",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "James Wilson",
    "Lisa Anderson",
    "Robert Taylor",
    "Jessica Martinez",
    "Daniel Thomas",
    "Amanda White",
    "Chris Moore",
    "Jennifer Jackson",
    "Matthew Harris",
    "Ashley Clark",
    "Andrew Lewis",
    "Sophia Walker",
  ];

  const currentUser = JSON.parse(localStorage.getItem("sc_user") || "{}");
  const activities = JSON.parse(localStorage.getItem("sc_activities") || "[]");
  const userEmissions = activities.reduce(
    (sum, act) => sum + (act.co2 || 0),
    0
  );

  const users = names.map((name, i) => ({
    id: i + 1,
    name,
    avatar: name
      .split(" ")
      .map((n) => n[0])
      .join(""),
    totalEmissions: Math.floor(Math.random() * 500) + 50,
    activitiesCount: Math.floor(Math.random() * 100) + 10,
    streak: Math.floor(Math.random() * 30) + 1,
  }));

  // Add current user if they have activities
  if (currentUser.name && activities.length > 0) {
    users.push({
      id: 0,
      name: currentUser.name,
      avatar: currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
      totalEmissions: userEmissions,
      activitiesCount: activities.length,
      streak: 5,
      isCurrentUser: true,
    });
  }

  return users.sort((a, b) => a.totalEmissions - b.totalEmissions);
};

export default function Leaderboard() {
  const [filter, setFilter] = useState("all");
  const [users] = useState(generateMockUsers);

  const filteredUsers = useMemo(() => {
    if (filter === "all") return users;
    if (filter === "week") return users.slice(0, Math.floor(users.length / 2));
    if (filter === "friends")
      return users
        .filter((u) => u.isCurrentUser || Math.random() > 0.5)
        .slice(0, 10);
    return users;
  }, [filter, users]);

  const topThree = filteredUsers.slice(0, 3);
  const restOfUsers = filteredUsers.slice(3);

  return (
    <PageContainer>
      <PageHeader>
        <Title>Global Leaderboard</Title>
        <Subtitle>See how you rank against eco-warriors worldwide</Subtitle>
      </PageHeader>

      <FilterSection>
        <FilterButton
          $active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All Time
        </FilterButton>
        <FilterButton
          $active={filter === "week"}
          onClick={() => setFilter("week")}
        >
          This Week
        </FilterButton>
        <FilterButton
          $active={filter === "friends"}
          onClick={() => setFilter("friends")}
        >
          Friends
        </FilterButton>
      </FilterSection>

      <LeaderboardCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {topThree.length >= 3 && (
          <PodiumSection>
            {/* Second Place */}
            <PodiumCard
              $rank={2}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Avatar>{topThree[1].avatar}</Avatar>
              <PodiumName>{topThree[1].name}</PodiumName>
              <PodiumScore>{topThree[1].totalEmissions} kg CO₂</PodiumScore>
            </PodiumCard>

            {/* First Place */}
            <PodiumCard
              $rank={1}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Crown>👑</Crown>
              <Avatar>{topThree[0].avatar}</Avatar>
              <PodiumName>{topThree[0].name}</PodiumName>
              <PodiumScore>{topThree[0].totalEmissions} kg CO₂</PodiumScore>
            </PodiumCard>

            {/* Third Place */}
            <PodiumCard
              $rank={3}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Avatar>{topThree[2].avatar}</Avatar>
              <PodiumName>{topThree[2].name}</PodiumName>
              <PodiumScore>{topThree[2].totalEmissions} kg CO₂</PodiumScore>
            </PodiumCard>
          </PodiumSection>
        )}

        <RankingList>
          {restOfUsers.map((user, index) => (
            <RankingItem
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              style={
                user.isCurrentUser
                  ? {
                      border: "2px solid #D4A017",
                      background:
                        "linear-gradient(135deg, rgba(212, 160, 23, 0.1), rgba(232, 176, 75, 0.05))",
                    }
                  : {}
              }
            >
              <Rank>#{index + 4}</Rank>
              <UserAvatar>{user.avatar}</UserAvatar>
              <UserInfo>
                <UserName>
                  {user.name} {user.isCurrentUser && "(You)"}
                </UserName>
                <UserStats>
                  {user.activitiesCount} activities · {user.streak} day streak
                </UserStats>
              </UserInfo>
              <div>
                <Score>{user.totalEmissions} kg</Score>
                <ScoreLabel>CO₂</ScoreLabel>
              </div>
            </RankingItem>
          ))}
        </RankingList>
      </LeaderboardCard>
    </PageContainer>
  );
}
