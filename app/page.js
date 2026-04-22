"use client";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [hobby, setHobby] = useState([]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleChange = (e) => {
    let { name, value, checked } = e.target;

    if (name === "hobby") {
      let updated = checked
        ? [...hobby, value]
        : hobby.filter((val) => val !== value);

      setHobby(updated);
      value = updated;
    }

    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let err = {};
    if (!user.name) err.name = "Required";
    if (!user.email) err.email = "Required";
    if (!user.phone) err.phone = "Required";
    if (!user.address) err.address = "Required";
    if (!user.city) err.city = "Required";
    if (!user.gender) err.gender = "Required";
    if (hobby.length === 0) err.hobby = "Required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let updatedList;

    if (editId === null) {
      updatedList = [...list, { ...user, hobby, id: Date.now() }];
      setMsg("User Added ✅");
    } else {
      updatedList = list.map((item) =>
        item.id === editId ? { ...user, hobby, id: editId } : item
      );
      setEditId(null);
      setMsg("User Updated ✅");
    }

    localStorage.setItem("users", JSON.stringify(updatedList));
    setList(updatedList);

    setUser({});
    setHobby([]);
    setErrors({});
    setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = (id) => {
    const updated = list.filter((item) => item.id !== id);
    setList(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const handleEdit = (id) => {
    const selected = list.find((item) => item.id === id);
    setUser(selected);
    setEditId(id);
    setHobby(selected.hobby || []);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("users")) || [];
    setList(data);
  }, []);

  const filtered = list.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.city || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.gender || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(start, start + itemsPerPage);

  const maleCount = list.filter((u) => u.gender === "male").length;
  const femaleCount = list.filter((u) => u.gender === "female").length;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">

        {msg && <div className="alert alert-success text-center">{msg}</div>}

        <div className="row g-4">

          {/* FORM */}
          <div className="col-md-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <h4 className="text-center text-primary mb-3">
                  {editId ? "Edit User" : "Add User"}
                </h4>

                <form onSubmit={handleSubmit}>

                  {/* NAME */}
                  <input
                    className={`form-control mb-2 ${errors.name && "is-invalid"}`}
                    placeholder="Name"
                    name="name"
                    value={user.name || ""}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.name}</div>

                  {/* EMAIL */}
                  <input
                    className={`form-control mb-2 ${errors.email && "is-invalid"}`}
                    placeholder="Email"
                    name="email"
                    value={user.email || ""}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.email}</div>

                  {/* PHONE */}
                  <input
                    className={`form-control mb-2 ${errors.phone && "is-invalid"}`}
                    placeholder="Phone"
                    name="phone"
                    value={user.phone || ""}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.phone}</div>

                  {/* ADDRESS */}
                  <textarea
                    className={`form-control mb-2 ${errors.address && "is-invalid"}`}
                    placeholder="Address"
                    name="address"
                    value={user.address || ""}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.address}</div>

                  {/* CITY */}
                  <select
                    className={`form-select mb-2 ${errors.city && "is-invalid"}`}
                    name="city"
                    value={user.city || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select City</option>
                    <option>Ahmedabad</option>
                    <option>Surat</option>
                    <option>Rajkot</option>
                  </select>

                  {/* GENDER */}
                  <div className="mb-2">
                    <strong>Gender:</strong><br />
                    <input type="radio" name="gender" value="male" checked={user.gender === "male"} onChange={handleChange}/> Male
                    <input type="radio" name="gender" value="female" className="ms-3" checked={user.gender === "female"} onChange={handleChange}/> Female
                    <div className="text-danger">{errors.gender}</div>
                  </div>

                  {/* HOBBY */}
                  <div className="mb-2">
                    <strong>Hobby:</strong><br />
                    <input type="checkbox" value="reading" name="hobby" checked={hobby.includes("reading")} onChange={handleChange}/> Reading
                    <input type="checkbox" value="coding" className="ms-3" name="hobby" checked={hobby.includes("coding")} onChange={handleChange}/> Coding
                    <input type="checkbox" value="dancing" className="ms-3" name="hobby" checked={hobby.includes("dancing")} onChange={handleChange}/> Dancing
                    <div className="text-danger">{errors.hobby}</div>
                  </div>

                  <button className="btn btn-primary w-100 mt-2">
                    {editId ? "Update User" : "Add User"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="col-md-8">

            {/* CARDS */}
            <div className="row text-center mb-3">
              <div className="col">
                <div className="card bg-primary text-white shadow">
                  <div className="card-body">Male: {maleCount}</div>
                </div>
              </div>
              <div className="col">
                <div className="card bg-success text-white shadow">
                  <div className="card-body">Female: {femaleCount}</div>
                </div>
              </div>
              <div className="col">
                <div className="card bg-dark text-white shadow">
                  <div className="card-body">Total: {list.length}</div>
                </div>
              </div>
            </div>

            {/* SEARCH */}
            <div className="input-group mb-3">
              <input
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary" onClick={() => setSearch("")}>
                  Clear
                </button>
              )}
            </div>

            <div className="card shadow">
              <table className="table table-hover text-center">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Gender</th>
                    <th>Hobby</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? currentData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{start + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.city}</td>
                      <td>{item.gender}</td>
                      <td>{item.hobby?.join(", ")}</td>
                      <td>
                        <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(item.id)}>Delete</button>
                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(item.id)}>Edit</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7">😕 No Data Found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;