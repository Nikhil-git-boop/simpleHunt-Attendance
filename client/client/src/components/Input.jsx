import React from 'react'
export default function Input({ error, ...props }) {
  return (
    <>
      <input className={`input ${error ? 'error' : ''}`} {...props} />
      {error && <div className="error-text">{error}</div>}
    </>
  )
}
