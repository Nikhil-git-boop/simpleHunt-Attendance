import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import EmployeeCard from '../components/EmployeeCard'
import AddEmployee from '../components/AddEmployee'
import Modal from '../components/Modal'
import { request } from '../api'

import './Home.css'
const API_URL = import.meta.env.VITE_API_URL;


export default function Home() {
  const navigate = useNavigate()
  const [view, setView] = useState('home') // home | add | about | view
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7))
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(()=>{ loadEmployees() }, [])

  async function loadEmployees() {
    setLoading(true)
    try {
      const emps = await request(`${API_URL}/auth/employees`, { method: 'GET' })
      setEmployees(emps)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not load employees')
      if (err.message && (err.message.includes('token') || err.message.includes('Token'))) {
        localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login')
      }
    } finally { setLoading(false) }
  }

  function handleNav(action) {
    if (action === 'logout') {
      localStorage.removeItem('token'); localStorage.removeItem('user')
      navigate('/login'); return
    }
    setView(action)
  }

  function handleAdded(emp) {
    setEmployees(prev => [emp, ...prev]); setView('home')
  }

  function handleMarked() {
    // optional: reload or leave
  }

  function openView(emp) {
    setSelected(emp); setStats(null); setView('view')
  }

  async function fetchStats() {
    if (!selected) return
    setError(null)
    const [y, m] = month.split('-')
    try {
      const data = await request(`${API_URL}/api/attendance/stats?employeeId=${selected._id}&month=${m}&year=${y}`, { method: 'GET' })
      setStats(data.totals)
    } catch (err) {
      setError(err.message || 'Error fetching stats')
    }
  }

  return (
    <div>
      <div >
        <Navbar onLogout={()=>handleNav('logout')} onNavigate={handleNav} />

        {view === 'home' && (
          <div >
            <Card  className="bg-home" style={{marginTop:10,}}>
              <h3 style={{fontSize:'2rem', color:'black', fontWeight:500}}>Employees</h3>
              {loading ? <div className="small">Loading...</div> : (
                <>
                  {employees.length === 0 && <div className="small">No employees yet. Use Menu → Add Employee</div>}
                  <div style={{marginTop:12}} className="emp-grid">
                    {employees.map(e => (
                      <EmployeeCard key={e._id} emp={e} onMarked={handleMarked} onView={openView} />
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {view === 'add' && <div style={{marginTop:12}}><AddEmployee onAdded={handleAdded} /></div>}

        {view === 'about' && (
          <div style={{marginTop:12}} className="card">
            <h3>About</h3>
            <p className="small">Simple attendance app — mark present / absent and view monthly totals.</p>
          </div>
        )}
      </div>

      <Modal open={view === 'view'} onClose={() => setView('home')}>
        <div>
          <h3>Details for {selected?.name}</h3>
          <div className="form-row" style={{display:'flex',gap:8,alignItems:'center'}}>
            <input type="month" className="input" value={month} onChange={e=>setMonth(e.target.value)} />
            <button className="btn btn-primary" onClick={fetchStats}>View</button>
            <button className="btn" onClick={()=>{ setView('home'); setSelected(null); setStats(null) }}>Close</button>
          </div>
          {error && <div style={{color:'crimson'}}>{error}</div>}
          {stats && (
            <div style={{marginTop:12}}>
              <div><strong>Present:</strong> {stats.present}</div>
              <div><strong>Absent:</strong> {stats.absent}</div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

