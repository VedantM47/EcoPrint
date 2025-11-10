"use client";

import { useMemo } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 254, 250, 0.92)
  );
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  h4 {
    margin: 0 0 12px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${(p) => p.theme.muted};
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 8px;
`;

const Bar = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #2d9d7b, #1b5e3f);
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    box-shadow: 0 0 12px rgba(45, 157, 123, 0.3);
  }

  .label {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    font-weight: 600;
    color: ${(p) => p.theme.muted};
    white-space: nowrap;
  }

  .value {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: 700;
    color: white;
    text-align: center;
  }
`;

const PieChart = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
  background: conic-gradient(${(p) => p.gradient});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PieCenter = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .center-value {
    font-size: 18px;
    font-weight: 800;
    color: ${(p) => p.theme.text};
  }

  .center-label {
    font-size: 11px;
    color: ${(p) => p.theme.muted};
    margin-top: 2px;
  }
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;

  .color-box {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: ${(p) => p.color};
  }

  .label {
    flex: 1;
    color: ${(p) => p.theme.muted};
  }

  .value {
    font-weight: 700;
    color: ${(p) => p.theme.text};
  }
`;

const InsightBox = styled.div`
  padding: 12px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.08),
    rgba(37, 99, 235, 0.04)
  );
  border: 1px solid rgba(59, 130, 246, 0.15);
  font-size: 13px;
  color: ${(p) => p.theme.text};
  line-height: 1.5;

  .insight-title {
    font-weight: 700;
    margin-bottom: 4px;
    color: #1e40af;
  }
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 254, 250, 0.92)
  );
  border: 1px solid rgba(0, 0, 0, 0.04);

  .rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    background: linear-gradient(
      135deg,
      rgba(45, 157, 123, 0.2),
      rgba(27, 94, 63, 0.1)
    );
    color: #1b5e3f;
  }

  .name {
    flex: 1;
    font-weight: 600;
    color: ${(p) => p.theme.text};
    font-size: 13px;
  }

  .metric {
    font-weight: 700;
    color: ${(p) => p.color || p.theme.text};
    font-size: 12px;
  }
`;

export default function GroupAnalytics({ group }) {
  const analytics = useMemo(() => {
    if (!group?.expenses) return null;

    // Category breakdown (simulate based on activity titles)
    const categories = {};
    let total = 0;

    group.expenses.forEach((exp) => {
      const title = exp.title.toLowerCase();
      let category = "Other";

      if (
        title.includes("car") ||
        title.includes("fuel") ||
        title.includes("trip") ||
        title.includes("ride")
      ) {
        category = "Transport";
      } else if (
        title.includes("food") ||
        title.includes("meal") ||
        title.includes("restaurant")
      ) {
        category = "Food";
      } else if (
        title.includes("electric") ||
        title.includes("energy") ||
        title.includes("power")
      ) {
        category = "Energy";
      } else if (title.includes("shopping") || title.includes("buy")) {
        category = "Shopping";
      }

      categories[category] = (categories[category] || 0) + (exp.co2 || 0);
      total += exp.co2 || 0;
    });

    // Member rankings
    const memberRankings = group.members
      .map((member, i) => ({
        name: member,
        emissions: group.perMember?.[i]?.shareCO2 || 0,
        cost: group.perMember?.[i]?.shareCost || 0,
      }))
      .sort((a, b) => b.emissions - a.emissions);

    // Top 3 high emitters
    const top3 = memberRankings.slice(0, 3);

    // Insights
    const insights = [];
    const avgEmissions = total / group.members.length;
    const highestEmitter = memberRankings[0];

    if (highestEmitter) {
      const ratio = (
        ((highestEmitter.emissions - avgEmissions) / avgEmissions) *
        100
      ).toFixed(0);
      if (ratio > 20) {
        insights.push(
          `${highestEmitter.name} has ${ratio}% higher emissions than the group average.`
        );
      }
    }

    // Cost efficiency
    const avgCostPerKg = group.totals.totalCost / Math.max(total, 1);
    insights.push(
      `The group spends ₹${avgCostPerKg.toFixed(2)} per kg of CO₂ on average.`
    );

    return {
      categories,
      total,
      memberRankings,
      top3,
      insights,
      avgEmissions,
    };
  }, [group]);

  if (!analytics || !group) return null;

  const categoryColors = {
    Transport: "#2D9D7B",
    Food: "#E8B04B",
    Energy: "#3B82F6",
    Shopping: "#EC4899",
    Other: "#8B5CF6",
  };

  const categoryEntries = Object.entries(analytics.categories);
  const pieGradient = categoryEntries
    .map(([cat, val]) => {
      const pct = (val / analytics.total) * 100;
      return `${categoryColors[cat]} 0% ${pct}%`;
    })
    .join(", ");

  return (
    <Container>
      {/* Member Emissions Bar Chart */}
      <Card>
        <h4>Member Emissions Comparison</h4>
        <ChartContainer style={{ paddingBottom: 24 }}>
          {group.members.map((member, i) => {
            const emissions = group.perMember?.[i]?.shareCO2 || 0;
            const maxEmissions = Math.max(
              ...group.members.map(
                (_, j) => group.perMember?.[j]?.shareCO2 || 0
              ),
              0.01
            );
            const height = (emissions / maxEmissions) * 150;

            return (
              <div
                key={member}
                style={{
                  flex: 1,
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Bar style={{ height: `${height}px` }}>
                  <div className="value">{emissions.toFixed(1)}</div>
                  <div className="label">{member.split(" ")[0]}</div>
                </Bar>
              </div>
            );
          })}
        </ChartContainer>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <h4>Emissions by Category</h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PieChart gradient={pieGradient}>
            <PieCenter>
              <div className="center-value">{analytics.total.toFixed(1)}</div>
              <div className="center-label">kg CO₂</div>
            </PieCenter>
          </PieChart>

          <Legend>
            {categoryEntries.map(([category, value]) => (
              <LegendItem key={category} color={categoryColors[category]}>
                <div className="color-box" />
                <div className="label">{category}</div>
                <div className="value">
                  {((value / analytics.total) * 100).toFixed(0)}%
                </div>
              </LegendItem>
            ))}
          </Legend>
        </div>
      </Card>

      {/* Top 3 Emitters */}
      <Card style={{ gridColumn: "1 / -1" }}>
        <h4>Top Emitters</h4>
        <RankingList>
          {analytics.top3.map((member, idx) => (
            <RankingItem key={member.name}>
              <div className="rank">#{idx + 1}</div>
              <div className="name">{member.name}</div>
              <div className="metric" style={{ color: "#ef4444" }}>
                {member.emissions.toFixed(1)} kg
              </div>
            </RankingItem>
          ))}
        </RankingList>
      </Card>

      {/* Insights */}
      {analytics.insights.length > 0 && (
        <Card style={{ gridColumn: "1 / -1" }}>
          <h4>Key Insights</h4>
          {analytics.insights.map((insight, idx) => (
            <InsightBox key={idx}>
              <div className="insight-title">Insight {idx + 1}</div>
              {insight}
            </InsightBox>
          ))}
        </Card>
      )}
    </Container>
  );
}
