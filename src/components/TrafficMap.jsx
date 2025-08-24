import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Sample traffic data for Al-Baha region
const trafficData = [
  { id: 1, lat: 20.0129, lng: 41.4677, severity: 'high', type: 'حادث مروري', description: 'تصادم على طريق الملك فهد', time: '08:30 ص' },
  { id: 2, lat: 20.0200, lng: 41.4600, severity: 'medium', type: 'ازدحام مروري', description: 'ازدحام في وسط المدينة', time: '09:15 ص' },
  { id: 3, lat: 19.9950, lng: 41.4750, severity: 'high', type: 'حادث مروري', description: 'انقلاب مركبة على الطريق الدائري', time: '10:45 ص' },
  { id: 4, lat: 20.0300, lng: 41.4500, severity: 'low', type: 'أعمال صيانة', description: 'أعمال صيانة على الطريق', time: '11:00 ص' },
  { id: 5, lat: 20.0100, lng: 41.4800, severity: 'medium', type: 'ازدحام مروري', description: 'ازدحام بسبب الأمطار', time: '12:30 م' },
]

// Heat map data points
const heatMapData = [
  [20.0129, 41.4677, 0.8], // High intensity
  [20.0200, 41.4600, 0.6], // Medium intensity
  [19.9950, 41.4750, 0.9], // Very high intensity
  [20.0300, 41.4500, 0.3], // Low intensity
  [20.0100, 41.4800, 0.5], // Medium intensity
  [20.0050, 41.4650, 0.7], // High intensity
  [20.0250, 41.4550, 0.4], // Medium-low intensity
  [19.9900, 41.4700, 0.6], // Medium intensity
]

// Heat layer component
function HeatLayer({ data, show }) {
  const map = useMap()
  const heatLayerRef = useRef(null)

  useEffect(() => {
    if (!show) {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      }
      return
    }

    if (L.heatLayer && data.length > 0) {
      // Remove existing heat layer
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
      }

      // Create new heat layer
      heatLayerRef.current = L.heatLayer(data, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: 'blue',
          0.2: 'cyan',
          0.4: 'lime',
          0.6: 'yellow',
          0.8: 'orange',
          1.0: 'red'
        }
      })

      heatLayerRef.current.addTo(map)
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      }
    }
  }, [map, data, show])

  return null
}

// Custom marker icons based on severity
const getMarkerIcon = (severity) => {
  const colors = {
    high: '#ef4444', // red
    medium: '#f59e0b', // amber
    low: '#10b981' // green
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${colors[severity]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

const TrafficMap = ({ filters = {} }) => {
  const [loading, setLoading] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [filteredData, setFilteredData] = useState(trafficData)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply filters to data
    let filtered = trafficData
    
    if (filters.severity) {
      filtered = filtered.filter(item => item.severity === filters.severity)
    }
    
    setFilteredData(filtered)
  }, [filters])

  if (loading) {
    return (
      <div className="h-full w-full space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  return (
    <div className="h-full w-full space-y-4">
      {/* Map Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={showHeatmap ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            الخريطة الحرارية
          </Button>
          <Badge variant="secondary">
            {filteredData.length} نقطة بيانات
          </Badge>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs">عالي</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs">متوسط</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">منخفض</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[500px] w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={[20.0129, 41.4677]} // Al-Baha coordinates
          zoom={12}
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Heat Layer */}
          <HeatLayer data={heatMapData} show={showHeatmap} />
          
          {/* Traffic Incident Markers */}
          {filteredData.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              icon={getMarkerIcon(incident.severity)}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]" dir="rtl">
                  <h3 className="font-bold text-right mb-2">{incident.type}</h3>
                  <p className="text-sm text-right mb-2">{incident.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge 
                      variant={
                        incident.severity === 'high' ? 'destructive' : 
                        incident.severity === 'medium' ? 'default' : 'secondary'
                      }
                    >
                      {incident.severity === 'high' ? 'عالي' : 
                       incident.severity === 'medium' ? 'متوسط' : 'منخفض'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{incident.time}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {filteredData.filter(d => d.severity === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground">حوادث عالية الخطورة</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">
              {filteredData.filter(d => d.severity === 'medium').length}
            </div>
            <div className="text-sm text-muted-foreground">حوادث متوسطة</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {filteredData.filter(d => d.severity === 'low').length}
            </div>
            <div className="text-sm text-muted-foreground">حوادث منخفضة</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TrafficMap
