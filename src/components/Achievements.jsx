"use client";

import React, { useMemo, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Container = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${(p) => p.theme.surface};
  box-shadow: ${(p) => p.theme.cardShadow};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const Header = styled.div`
  margin-bottom: 16px;

  h3 {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 800;
  }

  .subtitle {
    font-size: 13px;
    color: ${(p) => p.theme.muted};
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 20px;

  .fill {
    height: 100%;
    background: linear-gradient(90deg, #2d9d7b, #50e3c2);
    border-radius: 999px;
    transition: width 0.5s ease;
  }
`;

const LevelBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2d9d7b, #1b5e3f);
  color: white;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(45, 157, 123, 0.3);

  .icon {
    font-size: 18px;
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
`;

const AchievementCard = styled(motion.div)`
  padding: 12px;
  border-radius: 10px;
  background: ${(p) =>
    p.unlocked
      ? "linear-gradient(135deg, rgba(45, 157, 123, 0.1), rgba(27, 94, 63, 0.05))"
      : "rgba(0, 0, 0, 0.02)"};
  border: 1px solid
    ${(p) => (p.unlocked ? "rgba(45, 157, 123, 0.2)" : "rgba(0, 0, 0, 0.05)")};
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${(p) => (p.unlocked ? 1 : 0.5)};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .icon {
    font-size: 32px;
    margin-bottom: 8px;
    filter: ${(p) => (p.unlocked ? "none" : "grayscale(100%)")};
  }

  .name {
    font-weight: 700;
    font-size: 12px;
    color: ${(p) => p.theme.text};
    margin-bottom: 4px;
  }

  .description {
    font-size: 11px;
    color: ${(p) => p.theme.muted};
    line-height: 1.3;
  }

  .new-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #ef4444;
    color: white;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 999px;
    text-transform: uppercase;
  }

  .progress {
    margin-top: 8px;
    font-size: 10px;
    color: ${(p) => p.theme.muted};
    font-weight: 600;
  }
`;

const MilestonesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const MilestoneItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: ${(p) =>
    p.completed
      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))"
      : "rgba(0, 0, 0, 0.02)"};
  border: 1px solid
    ${(p) => (p.completed ? "rgba(59, 130, 246, 0.2)" : "rgba(0, 0, 0, 0.05)")};
  opacity: ${(p) => (p.completed ? 1 : 0.6)};

  .milestone-icon {
    font-size: 24px;
    filter: ${(p) => (p.completed ? "none" : "grayscale(100%)")};
  }

  .content {
    flex: 1;
  }

  .milestone-title {
    font-weight: 700;
    font-size: 13px;
    color: ${(p) => p.theme.text};
    margin-bottom: 2px;
  }

  .milestone-description {
    font-size: 11px;
    color: ${(p) => p.theme.muted};
  }

  .milestone-reward {
    font-size: 12px;
    font-weight: 700;
    color: #3b82f6;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const Tab = styled.button`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.active ? "#2d9d7b" : "transparent")};
  font-weight: ${(p) => (p.active ? 700 : 600)};
  color: ${(p) => (p.active ? p.theme.text : p.theme.muted)};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;

  &:hover {
    color: ${(p) => p.theme.text};
  }
`;

const ACHIEVEMENTS = [
  {
    id: "first_activity",
    name: "Getting Started",
    description: "Log your first activity",
    icon: "🌱",
    check: (stats) => stats.totalActivities >= 1,
  },
  {
    id: "eco_warrior",
    name: "Eco Warrior",
    description: "Track 10 activities",
    icon: "🌍",
    check: (stats) => stats.totalActivities >= 10,
  },
  {
    id: "team_player",
    name: "Team Player",
    description: "Join your first group",
    icon: "👥",
    check: (stats) => stats.totalGroups >= 1,
  },
  {
    id: "group_leader",
    name: "Group Leader",
    description: "Create 3 groups",
    icon: "👑",
    check: (stats) => stats.totalGroups >= 3,
  },
  {
    id: "carbon_conscious",
    name: "Carbon Conscious",
    description: "Track 50kg of CO₂",
    icon: "💨",
    check: (stats) => stats.totalCO2 >= 50,
  },
  {
    id: "budget_master",
    name: "Budget Master",
    description: "Track ₹1000 in expenses",
    icon: "💰",
    check: (stats) => stats.totalCost >= 1000,
  },
  {
    id: "consistency_king",
    name: "Consistency King",
    description: "Log activities 7 days in a row",
    icon: "🔥",
    check: (stats) => stats.streakDays >= 7,
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Have 5+ members across all groups",
    icon: "🦋",
    check: (stats) => stats.totalMembers >= 5,
  },
  {
    id: "efficiency_expert",
    name: "Efficiency Expert",
    description: "Achieve 80+ efficiency score in a group",
    icon: "⚡",
    check: (stats) => stats.maxEfficiency >= 80,
  },
  {
    id: "scanner_pro",
    name: "Scanner Pro",
    description: "Use bill scanner 5 times",
    icon: "📸",
    check: (stats) => stats.scannedBills >= 5,
  },
  {
    id: "category_master",
    name: "Category Master",
    description: "Track activities in 4+ categories",
    icon: "📊",
    check: (stats) => stats.categoriesUsed >= 4,
  },
  {
    id: "green_champion",
    name: "Green Champion",
    description: "Complete all achievements",
    icon: "🏆",
    check: (stats, unlocked) => unlocked.length >= 11,
  },
];

const MILESTONES = [
  {
    id: "beginner",
    title: "Beginner Explorer",
    description: "Track your first 5 activities",
    icon: "🎯",
    target: 5,
    getValue: (stats) => stats.totalActivities,
    reward: "+10 XP",
  },
  {
    id: "intermediate",
    title: "Intermediate Tracker",
    description: "Track 25 activities",
    icon: "🎖️",
    target: 25,
    getValue: (stats) => stats.totalActivities,
    reward: "+25 XP",
  },
  {
    id: "advanced",
    title: "Advanced Analyst",
    description: "Track 50 activities",
    icon: "🏅",
    target: 50,
    getValue: (stats) => stats.totalActivities,
    reward: "+50 XP",
  },
  {
    id: "carbon_novice",
    title: "Carbon Novice",
    description: "Track 100kg of CO₂",
    icon: "🌿",
    target: 100,
    getValue: (stats) => stats.totalCO2,
    reward: "+20 XP",
  },
  {
    id: "carbon_expert",
    title: "Carbon Expert",
    description: "Track 500kg of CO₂",
    icon: "🌳",
    target: 500,
    getValue: (stats) => stats.totalCO2,
    reward: "+100 XP",
  },
  {
    id: "group_master",
    title: "Group Master",
    description: "Create 5 groups",
    icon: "👨‍👩‍👧‍👦",
    target: 5,
    getValue: (stats) => stats.totalGroups,
    reward: "+50 XP",
  },
];

export default function Achievements({
  activities = [],
  groups = [],
  onCelebrate,
}) {
  const [activeTab, setActiveTab] = React.useState("achievements");
  const previousAchievementsRef = useRef([]);
  const previousMilestonesRef = useRef([]);

  const stats = useMemo(() => {
    const totalActivities = activities.length;
    const totalCO2 = activities.reduce((sum, a) => sum + (a.co2 || 0), 0);
    const totalCost = activities.reduce((sum, a) => sum + (a.cost || 0), 0);
    const totalGroups = groups.length;

    const uniqueMembers = new Set();
    groups.forEach((g) => g.members?.forEach((m) => uniqueMembers.add(m)));
    const totalMembers = uniqueMembers.size;

    const categoriesSet = new Set();
    activities.forEach((a) => {
      const title = a.title?.toLowerCase() || "";
      if (title.includes("car") || title.includes("fuel")) {
        categoriesSet.add("transport");
      } else if (title.includes("food") || title.includes("meal")) {
        categoriesSet.add("food");
      } else if (title.includes("electric") || title.includes("energy")) {
        categoriesSet.add("energy");
      } else if (title.includes("shopping")) {
        categoriesSet.add("shopping");
      } else {
        categoriesSet.add("other");
      }
    });
    const categoriesUsed = categoriesSet.size;

    const dates = activities
      .map((a) => a.created_at && new Date(a.created_at).toDateString())
      .filter(Boolean);
    const uniqueDates = [...new Set(dates)].sort();
    let streakDays = uniqueDates.length > 0 ? 1 : 0;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diffDays <= 1) streakDays++;
      else break;
    }

    const scannedBills = activities.filter(
      (a) => a.scanned || a.source === "scanner"
    ).length;

    const maxEfficiency = Math.max(
      0,
      ...groups.map((g) => {
        const total = g.totals?.totalCO2 || 0;
        return Math.max(0, 100 - total * 2);
      })
    );

    return {
      totalActivities,
      totalCO2,
      totalCost,
      totalGroups,
      totalMembers,
      categoriesUsed,
      streakDays,
      scannedBills,
      maxEfficiency,
    };
  }, [activities, groups]);

  const { unlockedAchievements, lockedAchievements } = useMemo(() => {
    const unlocked = [];
    const locked = [];

    ACHIEVEMENTS.forEach((achievement) => {
      if (
        achievement.check(
          stats,
          unlocked.map((a) => a.id)
        )
      ) {
        unlocked.push(achievement);
      } else {
        locked.push(achievement);
      }
    });

    return { unlockedAchievements: unlocked, lockedAchievements: locked };
  }, [stats]);

  const milestones = useMemo(() => {
    return MILESTONES.map((milestone) => {
      const currentValue = milestone.getValue(stats);
      const completed = currentValue >= milestone.target;
      const progress = Math.min(100, (currentValue / milestone.target) * 100);

      return {
        ...milestone,
        completed,
        progress,
        currentValue,
      };
    });
  }, [stats]);

  useEffect(() => {
    if (!onCelebrate) return;

    const previousIds = previousAchievementsRef.current.map((a) => a.id);
    const currentIds = unlockedAchievements.map((a) => a.id);

    const newUnlocked = unlockedAchievements.filter(
      (a) => !previousIds.includes(a.id)
    );

    newUnlocked.forEach((achievement) => {
      onCelebrate.celebrateAchievement(achievement);
    });

    previousAchievementsRef.current = unlockedAchievements;
  }, [unlockedAchievements, onCelebrate]);

  useEffect(() => {
    if (!onCelebrate) return;

    const previousCompleted = previousMilestonesRef.current
      .filter((m) => m.completed)
      .map((m) => m.id);
    const currentCompleted = milestones
      .filter((m) => m.completed)
      .map((m) => m.id);

    const newCompleted = milestones.filter(
      (m) => m.completed && !previousCompleted.includes(m.id)
    );

    newCompleted.forEach((milestone) => {
      onCelebrate.celebrateMilestone(milestone);
    });

    previousMilestonesRef.current = milestones;
  }, [milestones, onCelebrate]);

  const totalXP =
    unlockedAchievements.length * 10 +
    milestones.filter((m) => m.completed).length * 20;
  const level = Math.floor(totalXP / 50) + 1;
  const xpToNextLevel = level * 50 - totalXP;
  const levelProgress = ((totalXP % 50) / 50) * 100;

  return (
    <Container>
      <Header>
        <LevelBadge>
          <span className="icon">🏆</span>
          Level {level}
        </LevelBadge>
        <h3>Achievements & Milestones</h3>
        <div className="subtitle">
          {unlockedAchievements.length} of {ACHIEVEMENTS.length} achievements
          unlocked · {totalXP} XP · {xpToNextLevel} XP to Level {level + 1}
        </div>
      </Header>

      <ProgressBar>
        <div className="fill" style={{ width: `${levelProgress}%` }} />
      </ProgressBar>

      <Tabs>
        <Tab
          active={activeTab === "achievements"}
          onClick={() => setActiveTab("achievements")}
        >
          Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </Tab>
        <Tab
          active={activeTab === "milestones"}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones ({milestones.filter((m) => m.completed).length}/
          {MILESTONES.length})
        </Tab>
      </Tabs>

      {activeTab === "achievements" && (
        <AchievementsGrid>
          <AnimatePresence>
            {unlockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                unlocked={true}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="icon">{achievement.icon}</div>
                <div className="name">{achievement.name}</div>
                <div className="description">{achievement.description}</div>
              </AchievementCard>
            ))}
            {lockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                unlocked={false}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="icon">{achievement.icon}</div>
                <div className="name">{achievement.name}</div>
                <div className="description">{achievement.description}</div>
              </AchievementCard>
            ))}
          </AnimatePresence>
        </AchievementsGrid>
      )}

      {activeTab === "milestones" && (
        <MilestonesList>
          {milestones.map((milestone) => (
            <MilestoneItem key={milestone.id} completed={milestone.completed}>
              <div className="milestone-icon">{milestone.icon}</div>
              <div className="content">
                <div className="milestone-title">{milestone.title}</div>
                <div className="milestone-description">
                  {milestone.description}
                </div>
                {!milestone.completed && (
                  <div
                    style={{
                      marginTop: 8,
                      height: 6,
                      background: "rgba(0,0,0,0.05)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${milestone.progress}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #2d9d7b, #50e3c2)",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                )}
                {!milestone.completed && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "#6B7280",
                      marginTop: 4,
                      fontWeight: 600,
                    }}
                  >
                    {milestone.currentValue} / {milestone.target}
                  </div>
                )}
              </div>
              <div className="milestone-reward">{milestone.reward}</div>
            </MilestoneItem>
          ))}
        </MilestonesList>
      )}
    </Container>
  );
}
