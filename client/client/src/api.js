
export async function request(path, options = {}) {
  const headers = options.headers || {}
  const token = localStorage.getItem('token')
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  const text = await res.text().catch(() => '')
  const data = text ? JSON.parse(text) : {}
  if (!res.ok) throw data
  return data
}
