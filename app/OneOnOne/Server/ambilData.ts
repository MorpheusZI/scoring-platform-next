'use server'
export async function testingdata() {
  const res = await fetch("https://server-spp.onrender.com/scoringapi/hai").then((res) => res.text())
  return res
}
