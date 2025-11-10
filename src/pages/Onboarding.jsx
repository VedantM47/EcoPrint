import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    emailOrPhone: '',
    age: '',
    location: '',
    lifestyle: 'mixed'
  })

  function update(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function submit(e) {
    e.preventDefault()
    // UI-only: save to localStorage
    localStorage.setItem('sc_user', JSON.stringify(form))
    navigate('/dashboard')
  }

  return (
    <div className="card onboarding">
      <h2>Welcome — Setup your profile</h2>
      <form onSubmit={submit} className="form">
        <label>
          Name
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          Email or Phone (OTP-enabled later)
          <input name="emailOrPhone" value={form.emailOrPhone} onChange={update} required />
        </label>
        <label>
          Age
          <input name="age" type="number" value={form.age} onChange={update} />
        </label>
        <label>
          Location (City / State)
          <input name="location" value={form.location} onChange={update} />
        </label>
        <label>
          Lifestyle
          <select name="lifestyle" value={form.lifestyle} onChange={update}>
            <option value="low">Low-impact</option>
            <option value="mixed">Mixed</option>
            <option value="high">High consumption</option>
          </select>
        </label>

        <div className="actions">
          <button type="submit" className="primary">Start using SplitCOI</button>
        </div>
      </form>
    </div>
  )
}