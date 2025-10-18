import React, { useState } from 'react'
import { request } from '../api'
import Button from './Button'

import './EmployeeCard.css'
const API_URL = import.meta.env.VITE_API_URL;

export default function EmployeeCard({ emp, onMarked, onView }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [statusMsg, setStatusMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  async function mark(status) {
    setStatusMsg(null)
    setLoading(true)
    try {
      await request('/api/attendance/mark', { method: 'POST', body: { employeeId: emp._id, date, status } })
      setStatusMsg('Marked')
      onMarked && onMarked()
    } catch (err) {
      setStatusMsg(err.message || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <div className="emp-card card">
      <div className="emp-title">{emp.name}</div>
      <div className="row">
        <input type="date" className="input" value={date} onChange={e=>setDate(e.target.value)} />
      </div>
      <div className="row">
        <Button className="presentBtn" onClick={()=>mark('present')} disabled={loading}>Present</Button>
        <Button className="absentBtn" onClick={()=>mark('absent')} disabled={loading}>Absent</Button>
        <Button onClick={()=>onView(emp)} style={{marginLeft:'auto'}}>View</Button>
      </div>
      {statusMsg && <div className="small">{statusMsg}</div>}
    </div>
  )
}
