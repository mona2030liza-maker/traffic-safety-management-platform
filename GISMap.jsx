import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { albahaRegionData, sampleAccidents, blackspots, cameras, facilities } from '../data/albahaData';

// إصلاح أيقونات Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// أيقونات مخصصة للأنواع المختلفة
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
             <i class="fas ${icon}" style="color: white; font-size: 12px;"></i>
           </div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const accidentIcon = createCustomIcon('#ef4444', 'fa-car-crash');
const blackspotIcon = createCustomIcon('#000000', 'fa-exclamation-triangle');
const cameraIcon = createCustomIcon('#3b82f6', 'fa-video');
const hospitalIcon = createCustomIcon('#10b981', 'fa-hospital');
const schoolIcon = createCustomIcon('#8b5cf6', 'fa-school');
const gasStationIcon = createCustomIcon('#f59e0b', 'fa-gas-pump');

const GISMap = ({ filters = {}, onMapReady }) => {
  const mapRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    governorate: '',
    accidentType: '',
    severity: '',
    period: 'all',
    ...filters
  });

  // تصفية البيانات حسب الفلاتر المحددة
  const filterData = (data, type) => {
    return data.filter(item => {
      // فلتر المحافظة
      if (activeFilters.governorate && item.governorate !== activeFilters.governorate) {
        return false;
      }
      
      // فلتر نوع الحادث (للحوادث فقط)
      if (type === 'accidents' && activeFilters.accidentType && item.type !== activeFilters.accidentType) {
        return false;
      }
      
      // فلتر الشدة (للحوادث والنقاط السوداء)
      if ((type === 'accidents' || type === 'blackspots') && activeFilters.severity) {
        if (type === 'accidents' && item.severity !== activeFilters.severity) {
          return false;
        }
        if (type === 'blackspots' && item.severity !== activeFilters.severity) {
          return false;
        }
      }
      
      // فلتر الفترة الزمنية (للحوادث فقط)
      if (type === 'accidents' && activeFilters.period !== 'all') {
        const itemDate = new Date(item.date);
        const now = new Date();
        const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));
        
        switch (activeFilters.period) {
          case 'last_week':
            if (daysDiff > 7) return false;
            break;
          case 'last_month':
            if (daysDiff > 30) return false;
            break;
          case 'last_3months':
            if (daysDiff > 90) return false;
            break;
          case 'last_6months':
            if (daysDiff > 180) return false;
            break;
          case 'last_year':
            if (daysDiff > 365) return false;
            break;
        }
      }
      
      return true;
    });
  };

  const filteredAccidents = filterData(sampleAccidents, 'accidents');
  const filteredBlackspots = filterData(blackspots, 'blackspots');
  const filteredCameras = filterData(cameras, 'cameras');

  // إنشاء الخريطة الحرارية
  useEffect(() => {
    if (mapInstance && filteredAccidents.length > 0) {
      // إزالة الطبقة الحرارية السابقة
      if (heatmapLayerRef.current) {
        mapInstance.removeLayer(heatmapLayerRef.current);
      }

      // إنشاء بيانات الخريطة الحرارية
      const heatmapData = filteredAccidents.map(accident => {
        const intensity = accident.severity === 'مميت' ? 1.0 : 
                         accident.severity === 'خطير' ? 0.8 : 
                         accident.severity === 'متوسط' ? 0.6 : 0.4;
        return [accident.coordinates[0], accident.coordinates[1], intensity];
      });

      // إنشاء طبقة الخريطة الحرارية
      heatmapLayerRef.current = L.heatLayer(heatmapData, {
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
      });

      // إضافة الطبقة للخريطة
      heatmapLayerRef.current.addTo(mapInstance);
    }
  }, [mapInstance, filteredAccidents]);

  const handleMapCreated = (map) => {
    setMapInstance(map);
    if (onMapReady) {
      onMapReady(map);
    }
  };

  // تحديث الفلاتر
  const updateFilters = (newFilters) => {
    setActiveFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="w-full h-full relative">
      {/* شريط الفلاتر */}
      <div className="absolute top-4 left-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
            <select 
              value={activeFilters.governorate} 
              onChange={(e) => updateFilters({ governorate: e.target.value })}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">جميع المحافظات</option>
              {albahaRegionData.governorates.map(gov => (
                <option key={gov.id} value={gov.id}>{gov.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحادث</label>
            <select 
              value={activeFilters.accidentType} 
              onChange={(e) => updateFilters({ accidentType: e.target.value })}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">جميع الأنواع</option>
              <option value="تصادم">تصادم</option>
              <option value="انقلاب">انقلاب</option>
              <option value="دهس مشاة">دهس مشاة</option>
              <option value="اصطدام بجسم ثابت">اصطدام بجسم ثابت</option>
              <option value="حريق مركبة">حريق مركبة</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الشدة</label>
            <select 
              value={activeFilters.severity} 
              onChange={(e) => updateFilters({ severity: e.target.value })}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">جميع الدرجات</option>
              <option value="مميت">مميت</option>
              <option value="خطير">خطير</option>
              <option value="متوسط">متوسط</option>
              <option value="بسيط">بسيط</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الفترة الزمنية</label>
            <select 
              value={activeFilters.period} 
              onChange={(e) => updateFilters({ period: e.target.value })}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="all">جميع الفترات</option>
              <option value="last_week">الأسبوع الماضي</option>
              <option value="last_month">الشهر الماضي</option>
              <option value="last_3months">آخر 3 أشهر</option>
              <option value="last_6months">آخر 6 أشهر</option>
              <option value="last_year">السنة الماضية</option>
            </select>
          </div>
        </div>
      </div>

      {/* الخريطة */}
      <MapContainer
        center={albahaRegionData.center}
        zoom={albahaRegionData.zoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={handleMapCreated}
        ref={mapRef}
      >
        <LayersControl position="topright">
          {/* طبقات الخريطة الأساسية */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="صور الأقمار الصناعية">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="التضاريس">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />
          </LayersControl.BaseLayer>

          {/* طبقات البيانات */}
          <LayersControl.Overlay checked name="الحوادث المرورية">
            <LayerGroup>
              {filteredAccidents.map(accident => (
                <Marker 
                  key={accident.id} 
                  position={accident.coordinates} 
                  icon={accidentIcon}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-lg mb-2">{accident.type}</h3>
                      <p><strong>الموقع:</strong> {accident.location}</p>
                      <p><strong>الشدة:</strong> <span className={`px-2 py-1 rounded text-white text-xs ${
                        accident.severity === 'مميت' ? 'bg-red-600' :
                        accident.severity === 'خطير' ? 'bg-red-500' :
                        accident.severity === 'متوسط' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>{accident.severity}</span></p>
                      <p><strong>التاريخ:</strong> {accident.date}</p>
                      <p><strong>الوقت:</strong> {accident.time}</p>
                      <p><strong>الطقس:</strong> {accident.weather}</p>
                      <p><strong>الإصابات:</strong> {accident.casualties}</p>
                      <p><strong>المركبات:</strong> {accident.vehicles}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="النقاط السوداء">
            <LayerGroup>
              {filteredBlackspots.map(spot => (
                <Marker 
                  key={spot.id} 
                  position={spot.coordinates} 
                  icon={blackspotIcon}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-lg mb-2">نقطة سوداء</h3>
                      <p><strong>الموقع:</strong> {spot.location}</p>
                      <p><strong>النوع:</strong> {spot.type}</p>
                      <p><strong>الشدة:</strong> <span className={`px-2 py-1 rounded text-white text-xs ${
                        spot.severity === 'حرجة' ? 'bg-red-600' :
                        spot.severity === 'عالية' ? 'bg-red-500' :
                        spot.severity === 'متوسطة' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>{spot.severity}</span></p>
                      <p><strong>درجة الخطورة:</strong> {spot.riskScore}/10</p>
                      <p><strong>احتمالية الحادث:</strong> {spot.accidentProbability}%</p>
                      <p><strong>عدد الحوادث:</strong> {spot.accidentCount}</p>
                      <p><strong>الحالة:</strong> {spot.status}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="كاميرات المراقبة">
            <LayerGroup>
              {filteredCameras.map(camera => (
                <Marker 
                  key={camera.id} 
                  position={camera.coordinates} 
                  icon={cameraIcon}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-lg mb-2">كاميرا مراقبة</h3>
                      <p><strong>الموقع:</strong> {camera.location}</p>
                      <p><strong>النوع:</strong> {camera.type}</p>
                      <p><strong>الحالة:</strong> <span className={`px-2 py-1 rounded text-white text-xs ${
                        camera.status === 'نشط' ? 'bg-green-500' : 'bg-red-500'
                      }`}>{camera.status}</span></p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="المستشفيات">
            <LayerGroup>
              {facilities.hospitals.map((hospital, index) => (
                <Marker 
                  key={index} 
                  position={hospital.coordinates} 
                  icon={hospitalIcon}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-lg mb-2">{hospital.name}</h3>
                      <p><strong>النوع:</strong> مستشفى</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="المدارس">
            <LayerGroup>
              {facilities.schools.map((school, index) => (
                <Marker 
                  key={index} 
                  position={school.coordinates} 
                  icon={schoolIcon}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-lg mb-2">{school.name}</h3>
                      <p><strong>النوع:</strong> مدرسة</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="محطات الوقود">
            <LayerGroup>
              {facilities.gasStations.map((station, index) => (
                <Marker 
                  key={index} 
                  position={station.coordinates} 
                  icon={gasStationIcon}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-lg mb-2">{station.name}</h3>
                      <p><strong>النوع:</strong> محطة وقود</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* طبقة الطرق الرئيسية */}
          <LayersControl.Overlay name="الطرق الرئيسية">
            <LayerGroup>
              {albahaRegionData.majorRoads.map((road, index) => (
                <Polyline 
                  key={index}
                  positions={road.coordinates}
                  color={road.type === 'highway' ? '#ef4444' : '#3b82f6'}
                  weight={road.type === 'highway' ? 4 : 3}
                  opacity={0.8}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-lg mb-2">{road.name}</h3>
                      <p><strong>النوع:</strong> {road.type === 'highway' ? 'طريق سريع' : 'طريق رئيسي'}</p>
                    </div>
                  </Popup>
                </Polyline>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* طبقة حدود المحافظات */}
          <LayersControl.Overlay name="حدود المحافظات">
            <LayerGroup>
              {albahaRegionData.governorates.map(gov => (
                <Circle
                  key={gov.id}
                  center={gov.coordinates}
                  radius={gov.type === 'capital' ? 8000 : 5000}
                  fillColor={gov.type === 'capital' ? '#ef4444' : '#3b82f6'}
                  fillOpacity={0.1}
                  color={gov.type === 'capital' ? '#ef4444' : '#3b82f6'}
                  weight={2}
                >
                  <Popup>
                    <div className="text-right" dir="rtl">
                      <h3 className="font-bold text-lg mb-2">{gov.name}</h3>
                      <p><strong>عدد السكان:</strong> {gov.population.toLocaleString()}</p>
                      <p><strong>النوع:</strong> {gov.type === 'capital' ? 'العاصمة الإدارية' : 'محافظة'}</p>
                      <p><strong>المنطقة:</strong> {gov.area}</p>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      {/* إحصائيات الخريطة */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h3 className="font-bold text-lg mb-2 text-right">إحصائيات الخريطة</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-right">
          <div>
            <p className="text-gray-600">الحوادث المعروضة</p>
            <p className="font-bold text-red-600">{filteredAccidents.length}</p>
          </div>
          <div>
            <p className="text-gray-600">النقاط السوداء</p>
            <p className="font-bold text-black">{filteredBlackspots.length}</p>
          </div>
          <div>
            <p className="text-gray-600">الكاميرات</p>
            <p className="font-bold text-blue-600">{filteredCameras.length}</p>
          </div>
          <div>
            <p className="text-gray-600">المحافظات</p>
            <p className="font-bold text-green-600">{albahaRegionData.governorates.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISMap;

