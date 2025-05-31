import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/campaigns")
      .then((response) => {
        setCampaigns(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to download campaign.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) {
      return;
    }
    axios
      .delete(`/api/campaigns/${id}`)
      .then(() => {
        setCampaigns(campaigns.filter((c) => c.id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting campaign.");
      });
  };

  if (loading) return <p>Ładowanie kampanii...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Lista Kampanii</h2>
      {campaigns.length === 0 ? (
        <p>Brak kampanii do wyświetlenia.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nazwa</th>
              <th style={thStyle}>Bid Amount</th>
              <th style={thStyle}>Fund</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Town</th>
              <th style={thStyle}>Radius (km)</th>
              <th style={thStyle}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.bidAmount}</td>
                <td style={tdStyle}>{c.campaignFund}</td>
                <td style={tdStyle}>{c.status ? "ON" : "OFF"}</td>
                <td style={tdStyle}>{c.town}</td>
                <td style={tdStyle}>{c.radiusKm}</td>
                <td style={tdStyle}>
                  <button onClick={() => navigate(`/edit/${c.id}`)}>
                    Edytuj
                  </button>{" "}
                  <button onClick={() => handleDelete(c.id)}>
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#f2f2f2",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default CampaignList;
