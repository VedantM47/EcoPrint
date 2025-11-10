import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Preview = styled.div`
  border-radius: 10px;
  overflow: hidden;
  padding: 12px;
  background: ${(p) => p.theme.surface};
  box-shadow: ${(p) => p.theme.cardShadow};
  display: flex;
  gap: 12px;
  align-items: center;
`;
const Img = styled.img`
  width: 84px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

export default function BillScanner({ onExtract }) {
  const [fileName, setFileName] = useState(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(f);

    // Mock progress animation
    setProgress(8);
    const t1 = setTimeout(() => setProgress(52), 400);
    const t2 = setTimeout(() => {
      setProgress(100);
      const fakeExtracted = {
        title: `Bill: ${f.name}`,
        notes: "Parsed from image (mock)",
        amount: 100,
        unit: "kWh",
        co2: 100 * 0.82,
        cost: 1000,
        created_at: new Date().toISOString(),
      };
      onExtract && onExtract(fakeExtracted);
    }, 1000);
    // cleanup
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }

  return (
    <Wrap>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFile}
      />
      {fileName && (
        <Preview
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {previewUrl ? (
            <Img src={previewUrl} alt="preview" />
          ) : (
            <div
              style={{
                width: 84,
                height: 64,
                borderRadius: 8,
                background: "#f3f4f6",
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{fileName}</div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  Mock parsed bill
                </div>
              </div>
              <div style={{ width: 140 }}>
                <div
                  style={{
                    height: 8,
                    background: "#eef2ff",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6 }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg,#50E3C2,#4A90E2)",
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>
                  {progress < 100 ? `Scanning... ${progress}%` : "Done"}
                </div>
              </div>
            </div>
          </div>
        </Preview>
      )}
      {!fileName && (
        <div style={{ color: "#6B7280", fontSize: 13 }}>
          Upload electricity/fuel bill or receipt — OCR will extract values
          (mock UI)
        </div>
      )}
    </Wrap>
  );
}
