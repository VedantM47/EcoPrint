import React, { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
`;
const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const Label = styled.label`
  font-size: 13px;
  color: ${(p) => p.theme.muted};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  outline: none;
  transition: all 0.16s;
  &:focus {
    box-shadow: 0 10px 30px rgba(74, 144, 226, 0.06);
    border-color: rgba(74, 144, 226, 0.18);
  }
`;
const Select = styled.select`
  ${Input}
`;
const Text = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.muted};
`;

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

export default function ActivityForm({ onAdd, initial = {} }) {
  const [state, setState] = useState({
    title: initial.title || "",
    notes: initial.notes || "",
    amount: initial.amount || "",
    unit: initial.unit || "km",
    co2: initial.co2 || "",
    cost: initial.cost || "",
    date: initial.date || todayISODate(),
  });

  function update(e) {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  }

  function estimateCO2(s) {
    const a = Number(s.amount || 0);
    if (s.unit === "km") return (a * 0.12).toFixed(2);
    if (s.unit === "kWh") return (a * 0.82).toFixed(2);
    if (s.unit === "meal") return (a * 1.5).toFixed(2);
    return (a * 0.1).toFixed(2);
  }
  function estimateCost(s) {
    const a = Number(s.amount || 0);
    if (s.unit === "km") return (a * 10).toFixed(2);
    if (s.unit === "kWh") return (a * 7).toFixed(2);
    if (s.unit === "meal") return (a * 120).toFixed(2);
    return (a * 5).toFixed(2);
  }

  function submit(e) {
    e.preventDefault();
    const payload = {
      title: state.title,
      notes: state.notes,
      amount: state.amount,
      unit: state.unit,
      co2: parseFloat(state.co2 || estimateCO2(state)),
      cost: parseFloat(state.cost || estimateCost(state)),
      created_at: new Date(`${state.date}T00:00:00`).toISOString(),
    };
    onAdd && onAdd(payload);
    setState({
      title: "",
      notes: "",
      amount: "",
      unit: "km",
      co2: "",
      cost: "",
      date: todayISODate(),
    });
  }

  return (
    <Form onSubmit={submit}>
      <Label>
        Activity
        <Input
          name="title"
          value={state.title}
          onChange={update}
          placeholder="Car trip to office"
          required
        />
      </Label>

      <Row>
        <Label style={{ flex: 1 }}>
          Amount
          <Row>
            <Input
              name="amount"
              value={state.amount}
              onChange={update}
              placeholder="12"
            />
            <Select name="unit" value={state.unit} onChange={update}>
              <option value="km">km</option>
              <option value="kWh">kWh</option>
              <option value="meal">meal</option>
            </Select>
          </Row>
        </Label>

        <Label style={{ width: 180 }}>
          Date
          <Input name="date" type="date" value={state.date} onChange={update} />
        </Label>
      </Row>

      <Row>
        <Label style={{ flex: 1 }}>
          CO₂ (kg) — leave blank to auto estimate
          <Input name="co2" value={state.co2} onChange={update} />
        </Label>

        <Label style={{ width: 220 }}>
          Cost (₹) — leave blank to auto estimate
          <Input name="cost" value={state.cost} onChange={update} />
        </Label>
      </Row>

      <Label>
        Notes
        <Input name="notes" value={state.notes} onChange={update} />
      </Label>

      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" className="primary">
          Add activity
        </button>
        <button
          type="button"
          onClick={() => {
            setState({
              title: "",
              notes: "",
              amount: "",
              unit: "km",
              co2: "",
              cost: "",
              date: todayISODate(),
            });
          }}
          className="small"
        >
          Clear
        </button>
      </div>
      <Text>
        Estimates are placeholders — replace with official emission factors
        later.
      </Text>
    </Form>
  );
}
