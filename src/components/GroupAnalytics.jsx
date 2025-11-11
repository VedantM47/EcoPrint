"use client";

import { useMemo } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

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

const StatCard = styled.div`
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    ${(p) => p.gradient || "rgba(45, 157, 123, 0.1), rgba(27, 94, 63, 0.05)"}
  );
  border: 1px solid ${(p) => p.borderColor || "rgba(45, 157, 123, 0.2)"};
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 12px;
    font-weight: 600;
    color: ${(p) => p.theme.muted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 24px;
    font-weight: 800;
    color: ${(p) => p.valueColor || p.theme.text};
  }

  .subtext {
    font-size: 11px;
    color: ${(p) => p.theme.muted};
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "white",
        padding: "8px 12px",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, fontSize: 12 }}>{label}</p>
      {payload.map((entry, index) => (
        <p
          key={index}
          style={{
            margin: "4px 0 0",
            color: entry.color,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {entry.name}: {entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
};

export default function GroupAnalytics({ group }) {
  const analytics = useMemo(() => {
    if (!group?.expenses) return null;

    // Category breakdown
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

    // Trend analysis for emissions over time
    const expensesByDate = {};
    group.expenses.forEach((exp) => {
      const date = exp.created_at
        ? new Date(exp.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Today";
      expensesByDate[date] = expensesByDate[date] || { date, co2: 0, cost: 0 };
      expensesByDate[date].co2 += exp.co2 || 0;
      expensesByDate[date].cost += exp.cost || 0;
    });
    const trendData = Object.values(expensesByDate);

    // Top 3 high emitters
    const top3 = memberRankings.slice(0, 3);

    // Insights
    const insights = [];
    const avgEmissions = total / group.members.length;
    const highestEmitter = memberRankings[0];

    if (highestEmitter && highestEmitter.emissions > 0) {
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

    // Top category insight
    const topCategory = Object.entries(categories).sort(
      ([, a], [, b]) => b - a
    )[0];
    if (topCategory) {
      const pct = ((topCategory[1] / total) * 100).toFixed(0);
      insights.push(
        `${topCategory[0]} accounts for ${pct}% of total emissions.`
      );
    }

    // Efficiency score
    const efficiencyScore = Math.max(0, 100 - total * 2).toFixed(0);

    return {
      categories,
      total,
      memberRankings,
      top3,
      insights,
      avgEmissions,
      trendData,
      efficiencyScore,
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

  const categoryData = Object.entries(analytics.categories).map(
    ([name, value]) => ({
      name,
      value: Number.parseFloat(value.toFixed(2)),
      percentage: ((value / analytics.total) * 100).toFixed(1),
    })
  );

  const memberData = analytics.memberRankings.map((m) => ({
    name: m.name.split(" ")[0],
    emissions: Number.parseFloat(m.emissions.toFixed(2)),
    cost: Number.parseFloat(m.cost.toFixed(2)),
  }));

  return (
    <Container>
      {/* Summary stats cards */}
      <AnalyticsGrid>
        <StatCard
          gradient="rgba(45, 157, 123, 0.1), rgba(27, 94, 63, 0.05)"
          borderColor="rgba(45, 157, 123, 0.2)"
          valueColor="#1b5e3f"
        >
          <div className="label">Total Emissions</div>
          <div className="value">{analytics.total.toFixed(1)} kg</div>
          <div className="subtext">
            {(analytics.total / group.members.length).toFixed(1)} kg per member
          </div>
        </StatCard>

        <StatCard
          gradient="rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05)"
          borderColor="rgba(59, 130, 246, 0.2)"
          valueColor="#1e40af"
        >
          <div className="label">Total Cost</div>
          <div className="value">₹{group.totals.totalCost.toFixed(0)}</div>
          <div className="subtext">
            ₹{(group.totals.totalCost / group.members.length).toFixed(0)} per
            member
          </div>
        </StatCard>

        <StatCard
          gradient="rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.05)"
          borderColor="rgba(236, 72, 153, 0.2)"
          valueColor="#be185d"
        >
          <div className="label">Efficiency Score</div>
          <div className="value">{analytics.efficiencyScore}%</div>
          <div className="subtext">
            {analytics.efficiencyScore > 70
              ? "Excellent"
              : analytics.efficiencyScore > 50
              ? "Good"
              : "Needs improvement"}
          </div>
        </StatCard>
      </AnalyticsGrid>

      <Card>
        <h4>Member Emissions Comparison</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={memberData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend fontSize={12} />
            <Bar
              dataKey="emissions"
              fill="#2D9D7B"
              name="CO₂ (kg)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h4>Emissions by Category</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={categoryColors[entry.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {analytics.trendData.length > 1 && (
        <Card>
          <h4>Emissions Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.trendData}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D9D7B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2D9D7B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="co2"
                stroke="#2D9D7B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCo2)"
                name="CO₂ (kg)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card>
        <h4>Cost vs Emissions</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={memberData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend fontSize={12} />
            <Line
              type="monotone"
              dataKey="emissions"
              stroke="#2D9D7B"
              strokeWidth={2}
              name="CO₂ (kg)"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Cost (₹)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Member Emissions Bar Chart */}

      {/* Category Breakdown */}

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
            <InsightBox
              key={idx}
              style={{
                marginBottom: idx < analytics.insights.length - 1 ? 8 : 0,
              }}
            >
              <div className="insight-title">Insight {idx + 1}</div>
              {insight}
            </InsightBox>
          ))}
        </Card>
      )}
    </Container>
  );
}
