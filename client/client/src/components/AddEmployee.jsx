import React, { useState } from 'react'
import { request } from '../api'
import Button from './Button'
import Input from './Input'
import Toast from './Toast'
import Card from './Card'

import './AddEmployee.css'
const API_URL = import.meta.env.VITE_API_URL;

export default function AddEmployee({ onAdded }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const validate = () => {
    if (!name.trim()) return 'Employee name is required'
    if (name.length < 2) return 'Name must be at least 2 characters'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return setError(err)
    setError('')
    try {
      const emp = await request(`${API_URL}/api/auth/employees`, { method: 'POST', body: { name } })
      setToast({ type: 'success', message: 'Employee added!' })
      setName('')
      onAdded(emp)
    } catch {
      setToast({ type: 'error', message: 'Error adding employee' })
    }
  }

  return (
    <Card>
      <h3>Add Employee</h3>
      <form onSubmit={handleSubmit}>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Employee name" error={error} />
        <Button className="submitBtn">Add</Button>
      </form>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </Card>
  )
}

