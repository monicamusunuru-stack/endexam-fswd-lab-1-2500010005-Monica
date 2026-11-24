
import React, { useState, useEffect } from "react";
import "./App.css";

const initialDonors = [
  { id: 1, name: "Rahul Sharma", age: 24, gender: "Male", blood: "O+", phone: "9876543210", city: "Vijayawada" },
  { id: 2, name: "Priya Reddy", age: 28, gender: "Female", blood: "A+", phone: "9876543211", city: "Guntur" },
  { id: 3, name: "Arjun Kumar", age: 32, gender: "Male", blood: "B+", phone: "9876543212", city: "Hyderabad" }
];

const initialStock = [
  { group: "A+", units: 25 },
  { group: "A-", units: 10 },
  { group: "B+", units: 30 },
  { group: "B-", units: 8 },
  { group: "AB+", units: 15 },
  { group: "AB-", units: 5 },
  { group: "O+", units: 40 },
  { group: "O-", units: 12 }
];

const initialRequests = [
  { id: 1, patient: "Suresh", hospital: "City Hospital", blood: "O+", units: 2, status: "Pending" },
  { id: 2, patient: "Anjali", hospital: "Care Hospital", blood: "A+", units: 1, status: "Approved" }
];

function App() {
  const [page, setPage] = useState("Dashboard");

  const [donors, setDonors] = useState(() =>
    JSON.parse(localStorage.getItem("bloodDonors")) || initialDonors
  );

  const [stock, setStock] = useState(() =>
    JSON.parse(localStorage.getItem("bloodStock")) || initialStock
  );

  const [requests, setRequests] = useState(() =>
    JSON.parse(localStorage.getItem("bloodRequests")) || initialRequests
  );

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [donorForm, setDonorForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    blood: "O+",
    phone: "",
    city: ""
  });

  const [requestForm, setRequestForm] = useState({
    patient: "",
    hospital: "",
    blood: "O+",
    units: 1
  });

  // Save data in local storage
  useEffect(() => {
    localStorage.setItem("bloodDonors", JSON.stringify(donors));
    localStorage.setItem("bloodStock", JSON.stringify(stock));
    localStorage.setItem("bloodRequests", JSON.stringify(requests));
  }, [donors, stock, requests]);

  const totalUnits = stock.reduce((sum, item) => sum + item.units, 0);
  const pending = requests.filter(r => r.status === "Pending").length;

  // Add a new donor
  function addDonor(e) {
    e.preventDefault();

    setDonors([...donors, { ...donorForm, id: Date.now() }]);

    setDonorForm({
      name: "",
      age: "",
      gender: "Male",
      blood: "O+",
      phone: "",
      city: ""
    });

    setShowForm(false);
    alert("Donor added successfully!");
  }

  // Delete donor
  function deleteDonor(id) {
    if (window.confirm("Delete this donor?")) {
      setDonors(donors.filter(d => d.id !== id));
    }
  }

  // Add a new blood request
  function addRequest(e) {
    e.preventDefault();

    const units = Number(requestForm.units);

    if (!Number.isInteger(units) || units < 1) {
      alert("Enter a valid number of units.");
      return;
    }

    setRequests([
      ...requests,
      {
        ...requestForm,
        units,
        id: Date.now(),
        status: "Pending"
      }
    ]);

    setRequestForm({
      patient: "",
      hospital: "",
      blood: "O+",
      units: 1
    });

    setShowForm(false);
    alert("Blood request submitted!");
  }

  // Approve or reject a blood request
  function updateStatus(id, status) {
    const request = requests.find(r => r.id === id);

    if (!request || request.status !== "Pending") {
      return;
    }

    // Check stock before approving
    if (status === "Approved") {
      const item = stock.find(s => s.group === request.blood);

      if (!item || item.units < request.units) {
        alert("Insufficient blood stock!");
        return;
      }

      // Deduct stock only when approved
      setStock(prev =>
        prev.map(s =>
          s.group === request.blood
            ? { ...s, units: s.units - request.units }
            : s
        )
      );
    }

    // Update request status
    setRequests(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status } : r
      )
    );

    if (status === "Approved") {
      alert("Request approved successfully!");
    } else if (status === "Rejected") {
      alert("Request rejected!");
    }
  }

  // Search donors
  const filteredDonors = donors.filter(d =>
    `${d.name} ${d.blood} ${d.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Search requests
  const filteredRequests = requests.filter(r =>
    `${r.patient} ${r.hospital} ${r.blood}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const menu = [
    ["Dashboard", "▦"],
    ["Donors", "♙"],
    ["Inventory", "🩸"],
    ["Requests", "▤"]
  ];

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">♥</span>
          <div>
            <h2>Life<span>Line</span></h2>
            <small>Blood Bank System</small>
          </div>
        </div>

        <p className="menu-title">MAIN MENU</p>

        {menu.map(([name, icon]) => (
          <button
            key={name}
            className={`menu-item ${page === name ? "active" : ""}`}
            onClick={() => {
              setPage(name);
              setSearch("");
              setShowForm(false);
            }}
          >
            <span>{icon}</span> {name}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="help-card">
            <span>🩸</span>
            <h4>Donate Blood</h4>
            <p>Be someone's reason to live.</p>
          </div>
          <small>© 2026 LifeLine Blood Bank</small>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">

        <header className="topbar">
          <div>
            <h3>{page}</h3>
            <p>Blood Bank Management System</p>
          </div>

          <div className="admin">
            <span className="admin-icon">👤</span>
            <div>
              <b>Administrator</b>
              <small>Admin Panel</small>
            </div>
          </div>
        </header>

        <div className="content">

          {/* DASHBOARD */}
          {page === "Dashboard" && (
            <>
              <div className="welcome">
                <div>
                  <h1>Welcome to LifeLine 🩸</h1>
                  <p>Manage donors, blood inventory and requests in one place.</p>
                </div>
                <span className="welcome-icon">♥</span>
              </div>

              <div className="stats">

                <div className="stat-card">
                  <span className="stat-icon red">🩸</span>
                  <p>Total Blood Units</p>
                  <h2>{totalUnits}</h2>
                  <small>Units available in stock</small>
                </div>

                <div className="stat-card">
                  <span className="stat-icon blue">♙</span>
                  <p>Total Donors</p>
                  <h2>{donors.length}</h2>
                  <small>Registered donors</small>
                </div>

                <div className="stat-card">
                  <span className="stat-icon orange">▤</span>
                  <p>Blood Requests</p>
                  <h2>{requests.length}</h2>
                  <small>Total requests received</small>
                </div>

                <div className="stat-card">
                  <span className="stat-icon green">◷</span>
                  <p>Pending Requests</p>
                  <h2>{pending}</h2>
                  <small>Waiting for approval</small>
                </div>

              </div>

              {/* Blood Stock Overview */}
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Blood Stock Overview</h2>
                    <p>Available units by blood group</p>
                  </div>

                  <button
                    className="outline-btn"
                    onClick={() => setPage("Inventory")}
                  >
                    View Inventory →
                  </button>
                </div>

                <div className="blood-grid">
                  {stock.map(item => (
                    <div className="blood-card" key={item.group}>
                      <div className="blood-drop">🩸</div>
                      <h2>{item.group}</h2>
                      <b>{item.units}</b>
                      <small>Units</small>

                      <div className="progress">
                        <div
                          style={{
                            width: `${Math.min(item.units / 50 * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Requests */}
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent Blood Requests</h2>
                    <p>Latest patient requests</p>
                  </div>

                  <button
                    className="outline-btn"
                    onClick={() => setPage("Requests")}
                  >
                    View All →
                  </button>
                </div>

                <RequestTable
                  requests={requests.slice(-4).reverse()}
                  updateStatus={updateStatus}
                />
              </section>
            </>
          )}

          {/* DONORS */}
          {page === "Donors" && (
            <section className="panel">

              <div className="panel-heading">
                <div>
                  <h2>Donor Management</h2>
                  <p>Register and manage blood donors</p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => setShowForm(!showForm)}
                >
                  + Add Donor
                </button>
              </div>

              {showForm && (
                <form className="data-form" onSubmit={addDonor}>
                  <h3>Register New Donor</h3>

                  <div className="form-grid">
                    <input
                      required
                      placeholder="Full Name"
                      value={donorForm.name}
                      onChange={e =>
                        setDonorForm({
                          ...donorForm,
                          name: e.target.value
                        })
                      }
                    />

                    <input
                      required
                      type="number"
                      min="18"
                      max="65"
                      placeholder="Age"
                      value={donorForm.age}
                      onChange={e =>
                        setDonorForm({
                          ...donorForm,
                          age: e.target.value
                        })
                      }
                    />

                    <select
                      value={donorForm.gender}
                      onChange={e =>
                        setDonorForm({
                          ...donorForm,
                          gender: e.target.value
                        })
                      }
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>

                    <select
                      value={donorForm.blood}
                      onChange={e =>
                        setDonorForm({
                          ...donorForm,
                          blood: e.target.value
                        })
                      }
                    >
                      {stock.map(s => (
                        <option key={s.group}>{s.group}</option>
                      ))}
                    </select>

                    <input
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      placeholder="10-digit Phone Number"
                      value={donorForm.phone}
                      onChange={e =>
                        setDonorForm({
                          ...donorForm,
                          phone: e.target.value
                        })
                      }
                    />

                    <input
                      required
                      placeholder="City"
                      value={donorForm.city}
                      onChange={e =>
                        setDonorForm({
                          ...donorForm,
                          city: e.target.value
                        })
                      }
                    />
                  </div>

                  <button className="primary-btn">Save Donor</button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}

              <input
                className="search"
                placeholder="Search donors by name, blood group or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Donor Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Blood Group</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDonors.map(d => (
                      <tr key={d.id}>
                        <td><b>{d.name}</b></td>
                        <td>{d.age}</td>
                        <td>{d.gender}</td>
                        <td>
                          <span className="blood-badge">{d.blood}</span>
                        </td>
                        <td>{d.phone}</td>
                        <td>{d.city}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => deleteDonor(d.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredDonors.length === 0 && (
                  <p className="empty">No donors found.</p>
                )}
              </div>
            </section>
          )}

          {/* INVENTORY */}
          {page === "Inventory" && (
            <section className="panel">

              <div className="panel-heading">
                <div>
                  <h2>Blood Inventory</h2>
                  <p>Current blood stock availability</p>
                </div>
              </div>

              <div className="inventory-grid">
                {stock.map(item => (
                  <div className="inventory-card" key={item.group}>
                    <div className="blood-drop">🩸</div>

                    <div>
                      <h2>{item.group}</h2>
                      <p>Blood Group</p>
                    </div>

                    <strong>
                      {item.units} <small>Units</small>
                    </strong>

                    <div
                      className={`stock-status ${
                        item.units < 10 ? "low" : "available"
                      }`}
                    >
                      {item.units < 10 ? "Low Stock" : "Available"}
                    </div>

                    <div className="stock-actions">
                      <button
                        onClick={() =>
                          setStock(stock.map(s =>
                            s.group === item.group
                              ? { ...s, units: Math.max(0, s.units - 1) }
                              : s
                          ))
                        }
                      >
                        −
                      </button>

                      <span>Adjust Stock</span>

                      <button
                        onClick={() =>
                          setStock(stock.map(s =>
                            s.group === item.group
                              ? { ...s, units: s.units + 1 }
                              : s
                          ))
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="note">
                Note: Stock adjustments are for demonstration purposes.
                Real blood donations require proper screening and verification.
              </p>
            </section>
          )}

          {/* REQUESTS */}
          {page === "Requests" && (
            <section className="panel">

              <div className="panel-heading">
                <div>
                  <h2>Blood Requests</h2>
                  <p>Manage patient blood requests</p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => setShowForm(!showForm)}
                >
                  + New Request
                </button>
              </div>

              {showForm && (
                <form className="data-form" onSubmit={addRequest}>
                  <h3>New Blood Request</h3>

                  <div className="form-grid">
                    <input
                      required
                      placeholder="Patient Name"
                      value={requestForm.patient}
                      onChange={e =>
                        setRequestForm({
                          ...requestForm,
                          patient: e.target.value
                        })
                      }
                    />

                    <input
                      required
                      placeholder="Hospital Name"
                      value={requestForm.hospital}
                      onChange={e =>
                        setRequestForm({
                          ...requestForm,
                          hospital: e.target.value
                        })
                      }
                    />

                    <select
                      value={requestForm.blood}
                      onChange={e =>
                        setRequestForm({
                          ...requestForm,
                          blood: e.target.value
                        })
                      }
                    >
                      {stock.map(s => (
                        <option key={s.group}>{s.group}</option>
                      ))}
                    </select>

                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="Units Required"
                      value={requestForm.units}
                      onChange={e =>
                        setRequestForm({
                          ...requestForm,
                          units: e.target.value
                        })
                      }
                    />
                  </div>

                  <button className="primary-btn">Submit Request</button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}

              <input
                className="search"
                placeholder="Search requests..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <RequestTable
                requests={filteredRequests.slice().reverse()}
                updateStatus={updateStatus}
              />
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

// Request Table Component
function RequestTable({ requests, updateStatus }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Hospital</th>
            <th>Blood Group</th>
            <th>Units</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td><b>{r.patient}</b></td>
              <td>{r.hospital}</td>

              <td>
                <span className="blood-badge">{r.blood}</span>
              </td>

              <td>{r.units}</td>

              <td>
                <span className={`status ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </td>

              <td>
                {r.status === "Pending" ? (
                  <div className="request-actions">
                    <button
                      className="approve-btn"
                      onClick={() => updateStatus(r.id, "Approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => updateStatus(r.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                ) : r.status === "Approved" ? (
                  <span className="done">✓ Approved</span>
                ) : (
                  <span className="rejected-text">✕ Rejected</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {requests.length === 0 && (
        <p className="empty">No requests found.</p>
      )}
    </div>
  );
}

export default App;
