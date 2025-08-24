import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { sampleAccidents, blackspots, albahaRegionData } from '../data/albahaData';

const HeatmapLayer = ({ 
  map, 
  data = sampleAccidents, 
  options = {}, 
  visible = true,
  analysisType = 'crash_density' // crash_density, severity_weighted, risk_assessment, temporal_analysis
}) => {
  const heatmapLayerRef = useRef(null);
  const [heatmapSettings, setHeatmapSettings] = useState({
    radius: 25,
    blur: 15,
    maxZoom: 17,
    minOpacity: 0.1,
    maxOpacity: 0.8,
    gradient: {
      0.0: '#0000ff', // أزرق - منخفض
      0.2: '#00ffff', // سماوي
      0.4: '#00ff00', // أخضر
      0.6: '#ffff00', // أصفر
      0.8: '#ff8000', // برتقالي
      1.0: '#ff0000'  // أحمر - عالي
    },
    ...options
  });

  // تحليل البيانات وإنشاء نقاط الخريطة الحرارية
  const generateHeatmapData = () => {
    if (!data || data.length === 0) return [];

    let heatmapPoints = [];

    switch (analysisType) {
      case 'crash_density':
        // كثافة الحوادث - عدد الحوادث في كل موقع
        heatmapPoints = data.map(accident => [
          accident.coordinates[0],
          accident.coordinates[1],
          1.0 // كل حادث له وزن ثابت
        ]);
        break;

      case 'severity_weighted':
        // مرجح بالشدة - الحوادث الأكثر خطورة لها وزن أكبر
        heatmapPoints = data.map(accident => {
          let weight = 0.3; // وزن افتراضي للحوادث البسيطة
          
          switch (accident.severity) {
            case 'مميت':
              weight = 1.0;
              break;
            case 'خطير':
              weight = 0.8;
              break;
            case 'متوسط':
              weight = 0.6;
              break;
            case 'بسيط':
              weight = 0.4;
              break;
            default:
              weight = 0.3;
          }
          
          return [
            accident.coordinates[0],
            accident.coordinates[1],
            weight
          ];
        });
        break;

      case 'risk_assessment':
        // تقييم المخاطر - يجمع بين النقاط السوداء والحوادث
        // إضافة الحوادث
        heatmapPoints = data.map(accident => {
          let weight = accident.severity === 'مميت' ? 0.9 : 
                      accident.severity === 'خطير' ? 0.7 : 
                      accident.severity === 'متوسط' ? 0.5 : 0.3;
          
          return [
            accident.coordinates[0],
            accident.coordinates[1],
            weight
          ];
        });
        
        // إضافة النقاط السوداء بوزن أعلى
        blackspots.forEach(spot => {
          let weight = spot.riskScore / 10; // تحويل درجة الخطورة إلى وزن
          heatmapPoints.push([
            spot.coordinates[0],
            spot.coordinates[1],
            weight
          ]);
        });
        break;

      case 'temporal_analysis':
        // تحليل زمني - الحوادث الحديثة لها وزن أكبر
        const now = new Date();
        heatmapPoints = data.map(accident => {
          const accidentDate = new Date(accident.date);
          const daysDiff = Math.floor((now - accidentDate) / (1000 * 60 * 60 * 24));
          
          // الحوادث الأحدث لها وزن أكبر
          let timeWeight = Math.max(0.1, 1 - (daysDiff / 365)); // تقل الأهمية مع الوقت
          
          let severityWeight = accident.severity === 'مميت' ? 1.0 : 
                              accident.severity === 'خطير' ? 0.8 : 
                              accident.severity === 'متوسط' ? 0.6 : 0.4;
          
          return [
            accident.coordinates[0],
            accident.coordinates[1],
            timeWeight * severityWeight
          ];
        });
        break;

      default:
        heatmapPoints = data.map(accident => [
          accident.coordinates[0],
          accident.coordinates[1],
          1.0
        ]);
    }

    return heatmapPoints;
  };

  // إنشاء/تحديث الخريطة الحرارية
  useEffect(() => {
    if (!map) return;

    // إزالة الطبقة السابقة إن وجدت
    if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current);
      heatmapLayerRef.current = null;
    }

    if (!visible) return;

    const heatmapData = generateHeatmapData();
    
    if (heatmapData.length === 0) return;

    // إنشاء طبقة الخريطة الحرارية الجديدة
    heatmapLayerRef.current = L.heatLayer(heatmapData, heatmapSettings);
    
    // إضافة الطبقة للخريطة
    heatmapLayerRef.current.addTo(map);

  }, [map, data, visible, analysisType, heatmapSettings]);

  // تنظيف الطبقة عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (heatmapLayerRef.current && map) {
        map.removeLayer(heatmapLayerRef.current);
      }
    };
  }, [map]);

  // تحديث إعدادات الخريطة الحرارية
  const updateHeatmapSettings = (newSettings) => {
    setHeatmapSettings(prev => ({ ...prev, ...newSettings }));
  };

  // إرجاع دوال التحكم للمكون الأب
  return {
    updateSettings: updateHeatmapSettings,
    regenerate: () => {
      if (heatmapLayerRef.current && map) {
        map.removeLayer(heatmapLayerRef.current);
        const heatmapData = generateHeatmapData();
        heatmapLayerRef.current = L.heatLayer(heatmapData, heatmapSettings);
        heatmapLayerRef.current.addTo(map);
      }
    },
    getStatistics: () => {
      const heatmapData = generateHeatmapData();
      return {
        totalPoints: heatmapData.length,
        maxIntensity: Math.max(...heatmapData.map(point => point[2])),
        minIntensity: Math.min(...heatmapData.map(point => point[2])),
        averageIntensity: heatmapData.reduce((sum, point) => sum + point[2], 0) / heatmapData.length
      };
    }
  };
};

// مكون التحكم في الخريطة الحرارية
export const HeatmapControls = ({ 
  onSettingsChange, 
  onAnalysisTypeChange, 
  currentAnalysisType = 'crash_density',
  statistics = null 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState({
    radius: 25,
    blur: 15,
    maxOpacity: 0.8,
    minOpacity: 0.1
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const analysisTypes = [
    { value: 'crash_density', label: 'كثافة الحوادث', description: 'عرض كثافة الحوادث في كل منطقة' },
    { value: 'severity_weighted', label: 'مرجح بالشدة', description: 'الحوادث الأكثر خطورة تظهر بكثافة أعلى' },
    { value: 'risk_assessment', label: 'تقييم المخاطر', description: 'يجمع بين الحوادث والنقاط السوداء' },
    { value: 'temporal_analysis', label: 'التحليل الزمني', description: 'الحوادث الحديثة لها أولوية أعلى' }
  ];

  const gradientPresets = [
    {
      name: 'كلاسيكي',
      gradient: {
        0.0: '#0000ff', 0.2: '#00ffff', 0.4: '#00ff00', 
        0.6: '#ffff00', 0.8: '#ff8000', 1.0: '#ff0000'
      }
    },
    {
      name: 'أحادي اللون',
      gradient: {
        0.0: '#ffffff', 0.3: '#ffcccc', 0.6: '#ff6666', 1.0: '#cc0000'
      }
    },
    {
      name: 'طيف بارد',
      gradient: {
        0.0: '#000080', 0.3: '#0080ff', 0.6: '#00ffff', 1.0: '#80ffff'
      }
    },
    {
      name: 'طيف دافئ',
      gradient: {
        0.0: '#800000', 0.3: '#ff4000', 0.6: '#ff8000', 1.0: '#ffff00'
      }
    }
  ];

  return (
    <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg z-[1000] max-w-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-right">التحكم في الخريطة الحرارية</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* نوع التحليل */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">نوع التحليل</label>
            <select
              value={currentAnalysisType}
              onChange={(e) => onAnalysisTypeChange(e.target.value)}
              className="w-full p-2 border rounded-md text-sm text-right"
            >
              {analysisTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {analysisTypes.find(t => t.value === currentAnalysisType)?.description}
            </p>
          </div>

          {/* إعدادات الخريطة الحرارية */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                نصف القطر: {settings.radius}
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={settings.radius}
                onChange={(e) => handleSettingChange('radius', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                التمويه: {settings.blur}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={settings.blur}
                onChange={(e) => handleSettingChange('blur', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                الشفافية القصوى: {Math.round(settings.maxOpacity * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings.maxOpacity}
                onChange={(e) => handleSettingChange('maxOpacity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                الشفافية الدنيا: {Math.round(settings.minOpacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.1"
                value={settings.minOpacity}
                onChange={(e) => handleSettingChange('minOpacity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* إعدادات الألوان المسبقة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">نمط الألوان</label>
            <div className="grid grid-cols-2 gap-2">
              {gradientPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSettingChange('gradient', preset.gradient)}
                  className="p-2 border rounded-md text-xs hover:bg-gray-50 text-right"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* الإحصائيات */}
          {statistics && (
            <div className="border-t pt-3">
              <h4 className="font-semibold text-sm mb-2 text-right">إحصائيات الخريطة الحرارية</h4>
              <div className="text-xs space-y-1 text-right">
                <p>عدد النقاط: {statistics.totalPoints}</p>
                <p>أقصى كثافة: {statistics.maxIntensity?.toFixed(2)}</p>
                <p>أدنى كثافة: {statistics.minIntensity?.toFixed(2)}</p>
                <p>متوسط الكثافة: {statistics.averageIntensity?.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeatmapLayer;

