import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <header style={{ marginBottom: "20px" }}>
          <h1>Campaign Manager</h1>
          <nav>
            <Link to="/" style={{ marginRight: "15px" }}>Campaign List</Link>
            <Link to="/new">New Campaign</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<CampaignList />} />
            <Route path="/new" element={<CampaignForm />} />
            <Route path="/edit/:id" element={<CampaignForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
