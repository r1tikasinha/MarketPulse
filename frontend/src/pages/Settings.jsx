import { useState } from "react";
import {
  Bell,
  Check,
  Clock,
  Moon,
  RefreshCw,
  Settings as SettingsIcon,
  Zap,
} from "lucide-react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("10");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(
      "marketpulse-settings",
      JSON.stringify({
        notifications,
        autoRefresh,
        refreshInterval,
      })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="page settings-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="eyebrow">
            PREFERENCES
          </div>

          <h1>Settings</h1>

          <p className="page-subtitle">
            Customize how MarketPulse monitors and displays
            your market activity.
          </p>
        </div>
      </div>

      <div className="settings-layout">

        {/* GENERAL */}
        <section className="settings-section">

          <div className="settings-section-header">
            <div className="settings-section-icon">
              <SettingsIcon size={17} />
            </div>

            <div>
              <h2>General</h2>
              <p>
                Control your MarketPulse experience.
              </p>
            </div>
          </div>

          <div className="settings-card">

            {/* AUTO REFRESH */}
            <div className="setting-row">

              <div className="setting-info">

                <div className="setting-icon">
                  <RefreshCw size={16} />
                </div>

                <div>
                  <strong>
                    Automatic market refresh
                  </strong>

                  <span>
                    Automatically check for new market
                    changes.
                  </span>
                </div>

              </div>

              <button
                className={`toggle ${
                  autoRefresh ? "on" : ""
                }`}
                onClick={() =>
                  setAutoRefresh(!autoRefresh)
                }
              >
                <span></span>
              </button>

            </div>

            {/* REFRESH INTERVAL */}
            <div className="setting-row">

              <div className="setting-info">

                <div className="setting-icon">
                  <Clock size={16} />
                </div>

                <div>
                  <strong>
                    Refresh interval
                  </strong>

                  <span>
                    How frequently MarketPulse checks
                    market data.
                  </span>
                </div>

              </div>

              <select
                value={refreshInterval}
                onChange={(e) =>
                  setRefreshInterval(e.target.value)
                }
                disabled={!autoRefresh}
                className="settings-select"
              >
                <option value="5">
                  5 seconds
                </option>

                <option value="10">
                  10 seconds
                </option>

                <option value="30">
                  30 seconds
                </option>

                <option value="60">
                  1 minute
                </option>
              </select>

            </div>

          </div>
        </section>


        {/* NOTIFICATIONS */}
        <section className="settings-section">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <Bell size={17} />
            </div>

            <div>
              <h2>Notifications</h2>

              <p>
                Manage market alert notifications.
              </p>
            </div>

          </div>

          <div className="settings-card">

            <div className="setting-row">

              <div className="setting-info">

                <div className="setting-icon">
                  <Bell size={16} />
                </div>

                <div>
                  <strong>
                    Market alerts
                  </strong>

                  <span>
                    Show notifications when your alert
                    conditions are triggered.
                  </span>
                </div>

              </div>

              <button
                className={`toggle ${
                  notifications ? "on" : ""
                }`}
                onClick={() =>
                  setNotifications(!notifications)
                }
              >
                <span></span>
              </button>

            </div>

          </div>
        </section>


        {/* INTELLIGENCE */}
        <section className="settings-section">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <Zap size={17} />
            </div>

            <div>
              <h2>Market Intelligence</h2>

              <p>
                How MarketPulse identifies important
                movements.
              </p>
            </div>

          </div>

          <div className="settings-card">

            <div className="intelligence-info">

              <div className="intelligence-item">
                <strong>
                  Attention Score
                </strong>

                <span>
                  Combines price movement, trading volume
                  and volatility to identify meaningful
                  market activity.
                </span>
              </div>

              <div className="intelligence-item">
                <strong>
                  Meaningful Changes
                </strong>

                <span>
                  Only significant movements are highlighted
                  instead of showing every small price tick.
                </span>
              </div>

            </div>

          </div>
        </section>


        {/* APPEARANCE */}
        <section className="settings-section">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <Moon size={17} />
            </div>

            <div>
              <h2>Appearance</h2>

              <p>
                Current interface appearance.
              </p>
            </div>

          </div>

          <div className="settings-card">

            <div className="appearance-option active">

              <div>
                <strong>
                  Light
                </strong>

                <span>
                  Clean light interface for everyday
                  market monitoring.
                </span>
              </div>

              <div className="appearance-check">
                <Check size={14} />
              </div>

            </div>

          </div>
        </section>


        {/* SAVE */}
        <div className="settings-actions">

          <button
            className="primary-button"
            onClick={handleSave}
          >
            {saved ? (
              <>
                <Check size={15} />
                Saved
              </>
            ) : (
              "Save Preferences"
            )}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;