export default async function fetchData(path: string) {
  const response = await fetch(path)

  if (!response.ok) {
    throw new Error(`Error fetching data! Path: ${path}`)
  }

  const json = await response.json()

  if (!Object.keys(json).length) {
    throw new Error(`Got an empty json! Path: ${path}`)
  }

  return json
}
