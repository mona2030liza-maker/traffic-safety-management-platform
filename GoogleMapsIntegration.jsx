import React, { useEffect, useRef, useState } from 'react';
import { albahaRegionData } from '../data/albahaData';

// مكون دمج خرائط جوجل
const GoogleMapsIntegration = ({ 
  onMapReady, 
  showTrafficLayer = true, 
  showTransitLayer = false,
  showBicyclingLayer = false 
}) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [transitLayer, setTransitLayer] = useState(null);
  const [bicyclingLayer, setBicyclingLayer] = useState(null);
  const [mapSettings, setMapSettings] = useState({
    zoom: 10,
    center: { lat: albahaRegionData.center[0], lng: albahaRegionData.center[1] },
    mapTypeId: 'roadmap',
    styles: []
  });

  // تحميل Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      // التحقق من وجود Google Maps API
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // إنشاء script tag لتحميل Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry,places&language=ar&region=SA`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('فشل في تحميل Google Maps API');
        // استخدام خريطة بديلة (OpenStreetMap)
        initializeFallbackMap();
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // تهيئة خريطة جوجل
  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // إنشاء الخريطة
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: mapSettings.zoom,
        center: mapSettings.center,
        mapTypeId: mapSettings.mapTypeId,
        styles: mapSettings.styles,
        // إعدادات إضافية للمنطقة العربية
        language: 'ar',
        region: 'SA',
        // تحسينات للأداء
        gestureHandling: 'cooperative',
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true
      });

      // إنشاء طبقات الخريطة
      createMapLayers();
      
      // إضافة مستمعي الأحداث
      addMapEventListeners();
      
      setMapLoaded(true);
      
      if (onMapReady) {
        onMapReady(googleMapRef.current);
      }
    } catch (error) {
      console.error('خطأ في تهيئة خريطة جوجل:', error);
      initializeFallbackMap();
    }
  };

  // إنشاء طبقات الخريطة
  const createMapLayers = () => {
    if (!googleMapRef.current || !window.google) return;

    // طبقة الحركة المرورية
    const traffic = new window.google.maps.TrafficLayer();
    setTrafficLayer(traffic);
    
    if (showTrafficLayer) {
      traffic.setMap(googleMapRef.current);
    }

    // طبقة النقل العام
    const transit = new window.google.maps.TransitLayer();
    setTransitLayer(transit);
    
    if (showTransitLayer) {
      transit.setMap(googleMapRef.current);
    }

    // طبقة الدراجات
    const bicycling = new window.google.maps.BicyclingLayer();
    setBicyclingLayer(bicycling);
    
    if (showBicyclingLayer) {
      bicycling.setMap(googleMapRef.current);
    }
  };

  // إضافة مستمعي الأحداث
  const addMapEventListeners = () => {
    if (!googleMapRef.current || !window.google) return;

    // حدث تغيير الزوم
    googleMapRef.current.addListener('zoom_changed', () => {
      const newZoom = googleMapRef.current.getZoom();
      setMapSettings(prev => ({ ...prev, zoom: newZoom }));
    });

    // حدث تحريك الخريطة
    googleMapRef.current.addListener('center_changed', () => {
      const newCenter = googleMapRef.current.getCenter();
      setMapSettings(prev => ({ 
        ...prev, 
        center: { lat: newCenter.lat(), lng: newCenter.lng() }
      }));
    });

    // حدث النقر على الخريطة
    googleMapRef.current.addListener('click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      console.log(`تم النقر على الإحداثيات: ${lat}, ${lng}`);
    });
  };

  // تهيئة خريطة بديلة (OpenStreetMap)
  const initializeFallbackMap = () => {
    if (!mapRef.current) return;

    // إنشاء خريطة OpenStreetMap بسيطة
    mapRef.current.innerHTML = `
      <div style="width: 100%; height: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <div style="text-align: center; color: #666;">
          <i class="fas fa-map text-4xl mb-4"></i>
          <p>خريطة تفاعلية لمنطقة الباحة</p>
          <p style="font-size: 12px; margin-top: 10px;">يتم استخدام خريطة بديلة</p>
        </div>
      </div>
    `;
    
    setMapLoaded(true);
  };

  // تبديل طبقة الحركة المرورية
  const toggleTrafficLayer = () => {
    if (!trafficLayer || !googleMapRef.current) return;
    
    const isVisible = trafficLayer.getMap() !== null;
    trafficLayer.setMap(isVisible ? null : googleMapRef.current);
  };

  // تبديل طبقة النقل العام
  const toggleTransitLayer = () => {
    if (!transitLayer || !googleMapRef.current) return;
    
    const isVisible = transitLayer.getMap() !== null;
    transitLayer.setMap(isVisible ? null : googleMapRef.current);
  };

  // تبديل طبقة الدراجات
  const toggleBicyclingLayer = () => {
    if (!bicyclingLayer || !googleMapRef.current) return;
    
    const isVisible = bicyclingLayer.getMap() !== null;
    bicyclingLayer.setMap(isVisible ? null : googleMapRef.current);
  };

  // تغيير نوع الخريطة
  const changeMapType = (mapTypeId) => {
    if (!googleMapRef.current) return;
    
    googleMapRef.current.setMapTypeId(mapTypeId);
    setMapSettings(prev => ({ ...prev, mapTypeId }));
  };

  // تطبيق أنماط مخصصة للخريطة
  const applyCustomStyles = (styles) => {
    if (!googleMapRef.current) return;
    
    googleMapRef.current.setOptions({ styles });
    setMapSettings(prev => ({ ...prev, styles }));
  };

  // أنماط خريطة مخصصة
  const mapStyles = {
    default: [],
    dark: [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ],
    retro: [
      { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#c9b2a6' }]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#dcd2be' }]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ae9e90' }]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#93817c' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#a5b076' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#447530' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#f5f1e6' }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#fdfcf8' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#f8c967' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#e9bc62' }]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{ color: '#e98d58' }]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#db8555' }]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#806b63' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#8f7d77' }]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#ebe3cd' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#b9d3c2' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#92998d' }]
      }
    ]
  };

  return (
    <div className="w-full h-full relative">
      {/* الخريطة */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* أدوات التحكم */}
      {mapLoaded && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="font-bold text-lg mb-3 text-right">أدوات الخريطة</h3>
          
          {/* طبقات الخريطة */}
          <div className="space-y-2 mb-4">
            <h4 className="font-semibold text-sm text-right">الطبقات</h4>
            <label className="flex items-center justify-end">
              <span className="text-sm ml-2">الحركة المرورية</span>
              <input
                type="checkbox"
                defaultChecked={showTrafficLayer}
                onChange={toggleTrafficLayer}
                className="form-checkbox"
              />
            </label>
            <label className="flex items-center justify-end">
              <span className="text-sm ml-2">النقل العام</span>
              <input
                type="checkbox"
                defaultChecked={showTransitLayer}
                onChange={toggleTransitLayer}
                className="form-checkbox"
              />
            </label>
            <label className="flex items-center justify-end">
              <span className="text-sm ml-2">مسارات الدراجات</span>
              <input
                type="checkbox"
                defaultChecked={showBicyclingLayer}
                onChange={toggleBicyclingLayer}
                className="form-checkbox"
              />
            </label>
          </div>
          
          {/* أنواع الخريطة */}
          <div className="space-y-2 mb-4">
            <h4 className="font-semibold text-sm text-right">نوع الخريطة</h4>
            <select
              value={mapSettings.mapTypeId}
              onChange={(e) => changeMapType(e.target.value)}
              className="w-full p-2 border rounded text-sm text-right"
            >
              <option value="roadmap">خريطة الطرق</option>
              <option value="satellite">صور الأقمار الصناعية</option>
              <option value="hybrid">مختلط</option>
              <option value="terrain">التضاريس</option>
            </select>
          </div>
          
          {/* أنماط الخريطة */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-right">نمط الخريطة</h4>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => applyCustomStyles(mapStyles.default)}
                className="p-2 text-xs border rounded hover:bg-gray-50 text-right"
              >
                افتراضي
              </button>
              <button
                onClick={() => applyCustomStyles(mapStyles.dark)}
                className="p-2 text-xs border rounded hover:bg-gray-50 text-right"
              >
                داكن
              </button>
              <button
                onClick={() => applyCustomStyles(mapStyles.retro)}
                className="p-2 text-xs border rounded hover:bg-gray-50 text-right"
              >
                كلاسيكي
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* معلومات الخريطة */}
      {mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <div className="text-xs text-gray-600 text-right">
            <p>المركز: {mapSettings.center.lat.toFixed(4)}, {mapSettings.center.lng.toFixed(4)}</p>
            <p>مستوى التكبير: {mapSettings.zoom}</p>
            <p>نوع الخريطة: {mapSettings.mapTypeId}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsIntegration;

