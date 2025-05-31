import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

function CampaignForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    keywords: [],        
    bidAmount: "",
    campaignFund: "",
    status: false,      
    town: "",            
    radiusKm: "",
  });

  const [errors, setErrors] = useState({});    
  const [loading, setLoading] = useState(true);
  const [keywordsOptions, setKeywordsOptions] = useState([]);
  const [townsOptions, setTownsOptions] = useState([]);

  useEffect(() => {
    axios
      .get("/api/keywords")
      .then((res) => {
        const opts = res.data.map((kw) => ({ value: kw, label: kw }));
        setKeywordsOptions(opts);
      })
      .catch((err) => {
        console.error("Error loading keywords:", err);
      });

    axios
      .get("/api/towns")
      .then((res) => {
        const opts = res.data.map((t) => ({ value: t, label: t }));
        setTownsOptions(opts);
      })
      .catch((err) => {
        console.error("Error downloading towns:", err);
      });

    if (id) {
      axios
        .get(`/api/campaigns/${id}`)
        .then((res) => {
          const c = res.data;
          setFormData({
            name: c.name,
            keywords: c.keywords.map((kw) => ({ value: kw, label: kw })),
            bidAmount: c.bidAmount,
            campaignFund: c.campaignFund,
            status: c.status,
            town: c.town,
            radiusKm: c.radiusKm,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert("This campaign could not be found.");
          navigate("/"); 
        });
    } else {
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) return <p>Loading data...</p>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleKeywordsChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      keywords: selectedOptions || [],
    }));
  };

  const handleTownChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      town: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      keywords: formData.keywords.map((opt) => opt.value),
      bidAmount: parseFloat(formData.bidAmount),
      campaignFund: parseFloat(formData.campaignFund),
      status: formData.status,
      town: formData.town,
      radiusKm: parseInt(formData.radiusKm, 10),
    };

    setErrors({}); 

    if (id) {
      axios
        .put(`/api/campaigns/${id}`, payload)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            setErrors(err.response.data);
          } else {
            console.error(err);
            alert("Error saving campaign.");
          }
        });
    } else {
      axios
        .post("/api/campaigns", payload)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            setErrors(err.response.data);
          } else {
            console.error(err);
            alert("Error creating campaign.");
          }
        });
    }
  };

  return (
    <div>
      <h2>{id ? `Edit campaign ${id}` : "New Campaign"}</h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldStyle}>
          <label htmlFor="name">Campaign name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="keywords">Keywords:</label>
          <Select
            id="keywords"
            name="keywords"
            isMulti
            options={keywordsOptions}
            value={formData.keywords}
            onChange={handleKeywordsChange}
          />
          {errors.keywords && (
            <p style={errorStyle}>{errors.keywords}</p>
          )}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="bidAmount">Bid amount:</label>
          <input
            type="number"
            step="0.01"
            id="bidAmount"
            name="bidAmount"
            value={formData.bidAmount}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.bidAmount && (
            <p style={errorStyle}>{errors.bidAmount}</p>
          )}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="campaignFund">Campaign fund:</label>
          <input
            type="number"
            step="0.01"
            id="campaignFund"
            name="campaignFund"
            value={formData.campaignFund}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.campaignFund && (
            <p style={errorStyle}>{errors.campaignFund}</p>
          )}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="status">Status (ON/OFF):</label>
          <input
            type="checkbox"
            id="status"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            style={{ marginLeft: "10px" }}
          />
          {errors.status && (
            <p style={errorStyle}>{errors.status}</p>
          )}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="town">Town:</label>
          <Select
            id="town"
            name="town"
            options={townsOptions}
            value={
              formData.town
                ? { value: formData.town, label: formData.town }
                : null
            }
            onChange={handleTownChange}
            isClearable
          />
          {errors.town && <p style={errorStyle}>{errors.town}</p>}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="radiusKm">Radius (km):</label>
          <input
            type="number"
            id="radiusKm"
            name="radiusKm"
            value={formData.radiusKm}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.radiusKm && (
            <p style={errorStyle}>{errors.radiusKm}</p>
          )}
        </div>

        <div style={fieldStyle}>
          <button type="submit">
            {id ? "Save changes" : "Create a campaign"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{ marginLeft: "15px" }}
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}

const formStyle = {
  maxWidth: "600px",
};
const fieldStyle = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
};
const inputStyle = {
  padding: "8px",
  fontSize: "14px",
};
const errorStyle = {
  color: "red",
  fontSize: "12px",
  marginTop: "5px",
};

export default CampaignForm;
