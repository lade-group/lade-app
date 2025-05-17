import { useEffect, useState } from 'react'

interface Vehicle {
  id: string
  plate: string
  brand: string
  model: string
  type: string
  imageUrl: string
  status: string
}

export const useInfiniteVehicles = ({
  teamId,
  filters,
}: {
  teamId: string
  filters: { status?: string; type?: string }
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const params = new URLSearchParams({
      teamId,
      skip: String(page * 10),
      take: '10',
    })

    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)

    const res = await fetch(`http://localhost:3000/vehicle?${params}`)
    const json = await res.json()

    setVehicles((prev) => [...prev, ...json.data])
    setHasMore(vehicles.length + json.data.length < json.total)
    setPage((prev) => prev + 1)
    setLoading(false)
  }

  useEffect(() => {
    setVehicles([])
    setPage(0)
    setHasMore(true)
  }, [filters])

  useEffect(() => {
    fetchMore()
  }, [page])

  return { vehicles, fetchMore, hasMore, loading }
}
