import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const Layout = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 24px;
  min-height: calc(100vh - 56px);
  padding-top: 12px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export default function App() {
  const user = JSON.parse(localStorage.getItem("sc_user") || "null");
  const location = useLocation();

  return (
    <>
      <Header user={user} />
      <div className="container">
        <Layout>
          <Sidebar />
          <main style={{ width: "100%" }}>
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={user ? <Navigate to="/dashboard" /> : <Onboarding />}
                />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route
                  path="/dashboard"
                  element={
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  }
                />
                <Route
                  path="/groups"
                  element={
                    user ? (
                      <PageTransition>
                        <Groups />
                      </PageTransition>
                    ) : (
                      <Navigate to="/onboarding" />
                    )
                  }
                />
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </AnimatePresence>
          </main>
        </Layout>
      </div>
    </>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
    >
      {children}
    </motion.div>
  );
}
