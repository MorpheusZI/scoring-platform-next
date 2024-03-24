'use server'
export async function testingdata() {
  const res = await fetch("http://localhost:3001").then((res) => res.text())
  return res
}
