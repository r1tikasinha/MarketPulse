import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Trash2,
  TrendingUp,
  Activity,
  AlertTriangle,
  X,
} from "lucide-react";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    symbol: "TATAMOTORS",
    type: "price",
    condition: "above",
    value: "",
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/alerts"
      );

      const result = await response.json();

      if (result.success) {
        setAlerts(result.data || []);
      }
    } catch (error) {
      console.error("Alerts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/alerts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (result.success) {
        setAlerts((prev) => [
          ...prev,
          result.data,
        ]);

        setForm({
          symbol: "TATAMOTORS",
          type: "price",
          condition: "above",
          value: "",
        });

        setShowForm(false);
      }
    } catch (error) {
      console.error("Create alert error:", error);
    }
  };

  const deleteAlert = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/alerts/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result.success) {
        setAlerts((prev) =>
          prev.filter(
            (alert) => alert.id !== id
          )
        );
      }
    } catch (error) {
      console.error("Delete alert error:", error);
    }
  };

  const getAlertIcon = (type) => {
    if (type === "price") {
      return <TrendingUp size={18} />;
    }

    if (type === "volume") {
      return <Activity size={18} />;
    }

    return <AlertTriangle size={18} />;
  };

  const getAlertText = (alert) => {
    if (alert.type === "price") {
      return `Price ${alert.condition} ₹${alert.value}`;
    }

    if (alert.type === "volume") {
      return `Volume reaches ${alert.value}× average`;
    }

    if (alert.type === "attention") {
      return `Attention score reaches ${alert.value}/10`;
    }

    return "Market condition alert";
  };

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <p className="eyebrow">
            ALERT CENTER
          </p>

          <h1>Alerts</h1>

          <p className="page-subtitle">
            Get notified when something important
            happens in your watchlist.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          <Plus size={17} />
          Create Alert
        </button>
      </div>

      {/* STATS */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <Bell size={18} />
            </div>

            <span>ACTIVE ALERTS</span>
          </div>

          <strong>
  {
    alerts.filter(
      (alert) =>
        alert.status === "active"
    ).length
  }
</strong>

          <p>
            Alerts currently monitoring
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <TrendingUp size={18} />
            </div>

            <span>PRICE ALERTS</span>
          </div>

          <strong>
  {
    alerts.filter(
      (a) =>
        a.type === "price" &&
        a.status === "active"
    ).length
  }
</strong>

          <p>
            Price-based conditions
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <Activity size={18} />
            </div>

            <span>VOLUME ALERTS</span>
          </div>

          <strong>
  {
    alerts.filter(
      (a) =>
        a.type === "volume" &&
        a.status === "active"
    ).length
  }
</strong>

          <p>
            Unusual volume monitoring
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon">
              <AlertTriangle size={18} />
            </div>

            <span>STATUS</span>
          </div>

          <strong>
            Active
          </strong>

          <p>
            Monitoring market conditions
          </p>
        </div>

      </div>

      {/* ALERT LIST */}

      <div className="dashboard-panel">

        <div className="panel-header">

          <div>
            <span className="panel-eyebrow">
              MONITORING
            </span>

            <h2>
              Your Alerts
            </h2>
          </div>

          <span>
            {alerts.length} alerts
          </span>

        </div>

        {loading ? (
          <div className="watchlist-empty">
            <Activity size={26} />
            <h3>
              Loading alerts...
            </h3>
          </div>
        ) : alerts.length === 0 ? (
          <div className="watchlist-empty">
            <Bell size={32} />

            <h3>
              No alerts yet
            </h3>

            <p>
              Create your first alert to start
              monitoring the market.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setShowForm(true)
              }
            >
              <Plus size={16} />
              Create Your First Alert
            </button>
          </div>
        ) : (
          <div className="alert-list">

            {alerts.map((alert) => (

              <div
                className="alert-row"
                key={alert.id}
              >

                <div className="alert-icon">
                  {getAlertIcon(
                    alert.type
                  )}
                </div>

                <div className="alert-info">

                  <strong>
                    {alert.symbol}
                  </strong>

                  <span>
                    {getAlertText(alert)}
                  </span>

                </div>

                <div className="alert-status">

                  
                  <span
                  className={
                    alert.status === "triggered"
                      ? "alert-triggered"
                      : "alert-active"
                    }
                    >
                      {alert.status === "triggered"
                        ? "Triggered"
                        : "Active"}
                    </span>


                </div>

                <button
                  className="alert-delete"
                  onClick={() =>
                    deleteAlert(alert.id)
                  }
                >
                  <Trash2 size={17} />
                </button>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* CREATE ALERT MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <div className="alert-modal">

            <div className="modal-header">

              <div>
                <span className="panel-eyebrow">
                  NEW ALERT
                </span>

                <h2>
                  Create Market Alert
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowForm(false)
                }
              >
                <X size={19} />
              </button>

            </div>

            <form
              className="alert-form"
              onSubmit={createAlert}
            >

              <label>
                Stock Symbol

                <select
                  value={form.symbol}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      symbol:
                        e.target.value,
                    })
                  }
                >
                  <option value="RELIANCE">
                    RELIANCE
                  </option>

                  <option value="TCS">
                    TCS
                  </option>

                  <option value="INFY">
                    INFY
                  </option>

                  <option value="TATAMOTORS">
                    TATAMOTORS
                  </option>

                  <option value="HDFCBANK">
                    HDFCBANK
                  </option>
                </select>
              </label>

              <label>
                Alert Type

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type:
                        e.target.value,
                    })
                  }
                >
                  <option value="price">
                    Price
                  </option>

                  <option value="volume">
                    Volume Spike
                  </option>

                  <option value="attention">
                    Attention Score
                  </option>
                </select>
              </label>

              {form.type === "price" && (

                <label>
                  Condition

                  <select
                    value={
                      form.condition
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        condition:
                          e.target.value,
                      })
                    }
                  >
                    <option value="above">
                      Price goes above
                    </option>

                    <option value="below">
                      Price goes below
                    </option>
                  </select>
                </label>

              )}

              <label>
                Threshold

                <input
                  type="number"
                  step="0.1"
                  placeholder={
                    form.type === "price"
                      ? "Enter price"
                      : "Enter threshold"
                  }
                  value={form.value}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      value:
                        e.target.value,
                    })
                  }
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button"
              >
                <Bell size={17} />
                Create Alert
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Alerts;


<span className="alert-active">
  Active
</span>