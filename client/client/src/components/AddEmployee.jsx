import React, { useState } from 'react';
import { request } from '../api'; // Make sure this points to your API helper
const API_URL = import.meta.env.VITE_API_URL;

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: '',
    employeeId: '',
    phone: '',
    department: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('adminToken'); // Make sure this is saved at admin login
    if (!token) throw new Error('Admin not logged in');

    const res = await fetch(`${API_URL}/api/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token here
      },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Could not add employee');
    }

    setMessage('✅ Employee added successfully!');
    setForm({ name: '', employeeId: '', phone: '', department: '', password: '' });
  } catch (err) {
    setMessage(`❌ Error: ${err.message}`);
  }
};


  return (
    <div className="add-employee-container">
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Add Employee</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
