"use client";

import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const PageContainer = styled.div`
  max-width: 900px;
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

const CalculatorCard = styled(motion.div)`
  background: ${(p) => p.theme.surface};
  border-radius: 16px;
  padding: 32px;
  box-shadow: ${(p) => p.theme.cardShadow};
  border: 1px solid ${(p) => p.theme.borderColor};
  margin-bottom: 24px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
`;

const CategoryButton = styled.button`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid
    ${(p) => (p.$active ? p.theme.primary : p.theme.borderColor)};
  background: ${(p) =>
    p.$active ? "linear-gradient(135deg, #D4A017, #E8B04B)" : p.theme.glass};
  color: ${(p) => (p.$active ? "white" : p.theme.text)};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(p) => p.theme.cardShadow};
  }
`;

const CategoryIcon = styled.div`
  font-size: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  font-size: 14px;
  color: ${(p) => p.theme.text};
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid ${(p) => p.theme.borderColor};
  background: ${(p) => p.theme.glass};
  color: ${(p) => p.theme.text};
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.primary};
    box-shadow: 0 0 0 3px rgba(27, 94, 63, 0.1);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid ${(p) => p.theme.borderColor};
  background: ${(p) => p.theme.glass};
  color: ${(p) => p.theme.text};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.primary};
    box-shadow: 0 0 0 3px rgba(27, 94, 63, 0.1);
  }
`;

const CalculateButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #d4a017, #e8b04b);
  color: white;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(27, 94, 63, 0.1),
    rgba(45, 157, 123, 0.05)
  );
  border-radius: 16px;
  padding: 32px;
  border: 2px solid ${(p) => p.theme.primary};
  text-align: center;
`;

const ResultValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: ${(p) => p.theme.primary};
  margin-bottom: 8px;
`;

const ResultLabel = styled.div`
  font-size: 18px;
  color: ${(p) => p.theme.muted};
  margin-bottom: 16px;
`;

const ResultComparison = styled.div`
  font-size: 14px;
  color: ${(p) => p.theme.text};
  padding: 12px;
  background: ${(p) => p.theme.glass};
  border-radius: 8px;
  margin-top: 16px;
`;

const InfoCard = styled.div`
  background: ${(p) => p.theme.glass};
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  border-left: 4px solid ${(p) => p.theme.primary};
`;

const InfoTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${(p) => p.theme.text};
  margin-bottom: 8px;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.muted};
  line-height: 1.5;
`;

// CO2 emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  transportation: {
    car: { gasoline: 0.19, diesel: 0.17, electric: 0.05 }, // per km
    bus: 0.089, // per km
    train: 0.041, // per km
    flight: { domestic: 0.255, international: 0.195 }, // per km
    motorcycle: 0.103, // per km
  },
  energy: {
    electricity: 0.5, // per kWh
    naturalGas: 0.202, // per kWh
    heating: 0.185, // per kWh
  },
  food: {
    beef: 27, // per kg
    pork: 12.1, // per kg
    chicken: 6.9, // per kg
    fish: 6, // per kg
    vegetables: 2, // per kg
    dairy: 1.4, // per liter
  },
};

const CATEGORIES = [
  { id: "transportation", label: "Transportation", icon: "🚗" },
  { id: "energy", label: "Energy", icon: "⚡" },
  { id: "food", label: "Food", icon: "🍽️" },
];

export default function CO2Calculator() {
  const [selectedCategory, setSelectedCategory] = useState("transportation");
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    // Transportation
    transportType: "car",
    fuelType: "gasoline",
    distance: "",
    flightType: "domestic",
    // Energy
    energyType: "electricity",
    consumption: "",
    // Food
    foodType: "beef",
    quantity: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateEmission = () => {
    let emission = 0;
    let activityDescription = "";

    if (selectedCategory === "transportation") {
      const distance = Number.parseFloat(formData.distance);
      if (!distance) return;

      if (formData.transportType === "car") {
        emission =
          distance * EMISSION_FACTORS.transportation.car[formData.fuelType];
        activityDescription = `Driving ${distance} km in a ${formData.fuelType} car`;
      } else if (formData.transportType === "flight") {
        emission =
          distance *
          EMISSION_FACTORS.transportation.flight[formData.flightType];
        activityDescription = `${formData.flightType} flight for ${distance} km`;
      } else {
        emission =
          distance * EMISSION_FACTORS.transportation[formData.transportType];
        activityDescription = `Traveling ${distance} km by ${formData.transportType}`;
      }
    } else if (selectedCategory === "energy") {
      const consumption = Number.parseFloat(formData.consumption);
      if (!consumption) return;

      emission = consumption * EMISSION_FACTORS.energy[formData.energyType];
      activityDescription = `Using ${consumption} kWh of ${formData.energyType}`;
    } else if (selectedCategory === "food") {
      const quantity = Number.parseFloat(formData.quantity);
      if (!quantity) return;

      emission = quantity * EMISSION_FACTORS.food[formData.foodType];
      activityDescription = `Consuming ${quantity} ${
        formData.foodType === "dairy" ? "liters" : "kg"
      } of ${formData.foodType}`;
    }

    setResult({
      value: emission.toFixed(2),
      activity: activityDescription,
      comparison: getComparison(emission),
    });
  };

  const getComparison = (emission) => {
    const trees = (emission / 21.77).toFixed(1); // trees needed to offset per year
    const phones = (emission / 0.008).toFixed(0); // smartphone charges
    return { trees, phones };
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>CO₂ Calculator</Title>
        <Subtitle>
          Calculate carbon emissions for your daily activities
        </Subtitle>
      </PageHeader>

      <CalculatorCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CategoryGrid>
          {CATEGORIES.map((cat) => (
            <CategoryButton
              key={cat.id}
              $active={selectedCategory === cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setResult(null);
              }}
            >
              <CategoryIcon>{cat.icon}</CategoryIcon>
              <span>{cat.label}</span>
            </CategoryButton>
          ))}
        </CategoryGrid>

        <AnimatePresence mode="wait">
          {selectedCategory === "transportation" && (
            <motion.div
              key="transportation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FormSection>
                <FormLabel>Transport Type</FormLabel>
                <FormSelect
                  value={formData.transportType}
                  onChange={(e) =>
                    handleInputChange("transportType", e.target.value)
                  }
                >
                  <option value="car">Car</option>
                  <option value="bus">Bus</option>
                  <option value="train">Train</option>
                  <option value="flight">Flight</option>
                  <option value="motorcycle">Motorcycle</option>
                </FormSelect>
              </FormSection>

              {formData.transportType === "car" && (
                <FormSection>
                  <FormLabel>Fuel Type</FormLabel>
                  <FormSelect
                    value={formData.fuelType}
                    onChange={(e) =>
                      handleInputChange("fuelType", e.target.value)
                    }
                  >
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                  </FormSelect>
                </FormSection>
              )}

              {formData.transportType === "flight" && (
                <FormSection>
                  <FormLabel>Flight Type</FormLabel>
                  <FormSelect
                    value={formData.flightType}
                    onChange={(e) =>
                      handleInputChange("flightType", e.target.value)
                    }
                  >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </FormSelect>
                </FormSection>
              )}

              <FormSection>
                <FormLabel>Distance (km)</FormLabel>
                <FormInput
                  type="number"
                  placeholder="Enter distance"
                  value={formData.distance}
                  onChange={(e) =>
                    handleInputChange("distance", e.target.value)
                  }
                />
              </FormSection>
            </motion.div>
          )}

          {selectedCategory === "energy" && (
            <motion.div
              key="energy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FormSection>
                <FormLabel>Energy Type</FormLabel>
                <FormSelect
                  value={formData.energyType}
                  onChange={(e) =>
                    handleInputChange("energyType", e.target.value)
                  }
                >
                  <option value="electricity">Electricity</option>
                  <option value="naturalGas">Natural Gas</option>
                  <option value="heating">Heating Oil</option>
                </FormSelect>
              </FormSection>

              <FormSection>
                <FormLabel>Consumption (kWh)</FormLabel>
                <FormInput
                  type="number"
                  placeholder="Enter consumption"
                  value={formData.consumption}
                  onChange={(e) =>
                    handleInputChange("consumption", e.target.value)
                  }
                />
              </FormSection>
            </motion.div>
          )}

          {selectedCategory === "food" && (
            <motion.div
              key="food"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FormSection>
                <FormLabel>Food Type</FormLabel>
                <FormSelect
                  value={formData.foodType}
                  onChange={(e) =>
                    handleInputChange("foodType", e.target.value)
                  }
                >
                  <option value="beef">Beef</option>
                  <option value="pork">Pork</option>
                  <option value="chicken">Chicken</option>
                  <option value="fish">Fish</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="dairy">Dairy</option>
                </FormSelect>
              </FormSection>

              <FormSection>
                <FormLabel>
                  Quantity ({formData.foodType === "dairy" ? "liters" : "kg"})
                </FormLabel>
                <FormInput
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                />
              </FormSection>
            </motion.div>
          )}
        </AnimatePresence>

        <CalculateButton onClick={calculateEmission}>
          Calculate Emissions
        </CalculateButton>
      </CalculatorCard>

      <AnimatePresence>
        {result && (
          <ResultCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <ResultValue>{result.value} kg</ResultValue>
            <ResultLabel>CO₂ Emissions</ResultLabel>
            <InfoText>{result.activity}</InfoText>

            <ResultComparison>
              This is equivalent to charging {result.comparison.phones}{" "}
              smartphones or would require {result.comparison.trees} tree(s) to
              offset over a year
            </ResultComparison>

            <InfoCard>
              <InfoTitle>How to Reduce This</InfoTitle>
              <InfoText>
                {selectedCategory === "transportation" &&
                  "Consider carpooling, using public transport, or switching to electric vehicles to reduce your carbon footprint."}
                {selectedCategory === "energy" &&
                  "Switch to renewable energy sources, improve insulation, and use energy-efficient appliances."}
                {selectedCategory === "food" &&
                  "Choose plant-based alternatives, buy local and seasonal produce, and reduce food waste."}
              </InfoText>
            </InfoCard>
          </ResultCard>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
