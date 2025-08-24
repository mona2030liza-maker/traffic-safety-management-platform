import React, { useState, useEffect, useRef } from 'react';
import { albahaRegionData, sampleAccidents } from '../data/albahaData';

// مكون مراقبة الحركة المرورية
const TrafficMonitoring = ({ onDataUpdate }) => {
  const [trafficData, setTrafficData] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [timeRange, setTimeRange] = useState('1h');
  const [updateInterval, setUpdateInterval] = useState(30); // ثانية
  const intervalRef = useRef(null);

  // بيانات وهمية لمحاكاة الحركة المرورية الحية
  const generateTrafficData = () => {
    const locations = [
      { id: 1, name: 'تقاطع طريق الملك فهد الرئيسي', coordinates: [20.0129, 41.4677], type: 'intersection' },
      { id: 2, name: 'طريق الباحة - بلجرشي السريع', coordinates: [20.0000, 41.7000], type: 'highway' },
      { id: 3, name: 'شارع الأمير محمد بن سعود', coordinates: [20.0150, 41.4650], type: 'main_road' },
      { id: 4, name: 'تقاطع بلجرشي المركزي', coordinates: [19.9167, 41.9167], type: 'intersection' },
      { id: 5, name: 'طريق المندق الرئيسي', coordinates: [20.2333, 41.2833], type: 'main_road' },
      { id: 6, name: 'شارع المخواة التجاري', coordinates: [19.7333, 41.3833], type: 'commercial' },
      { id: 7, name: 'طريق العقيق الجبلي', coordinates: [20.3333, 41.6333], type: 'mountain_road' },
      { id: 8, name: 'تقاطع قلوة الرئيسي', coordinates: [19.6333, 41.6333], type: 'intersection' },
      { id: 9, name: 'طريق القرى الداخلي', coordinates: [20.1000, 41.2000], type: 'local_road' },
      { id: 10, name: 'شارع بني حسن', coordinates: [19.8000, 41.5000], type: 'local_road' }
    ];

    return locations.map(location => {
      const currentTime = new Date();
      const hour = currentTime.getHours();
      
      // محاكاة أنماط الحركة المرورية حسب الوقت
      let baseTraffic = 0.3; // حركة أساسية
      
      // ساعات الذروة الصباحية (6-9 صباحاً)
      if (hour >= 6 && hour <= 9) {
        baseTraffic = 0.8 + Math.random() * 0.2;
      }
      // ساعات الذروة المسائية (4-7 مساءً)
      else if (hour >= 16 && hour <= 19) {
        baseTraffic = 0.7 + Math.random() * 0.3;
      }
      // ساعات الليل (10 مساءً - 5 صباحاً)
      else if (hour >= 22 || hour <= 5) {
        baseTraffic = 0.1 + Math.random() * 0.2;
      }
      // باقي الأوقات
      else {
        baseTraffic = 0.4 + Math.random() * 0.3;
      }

      // تعديل حسب نوع الطريق
      const typeMultiplier = {
        'highway': 1.2,
        'intersection': 1.1,
        'main_road': 1.0,
        'commercial': 0.9,
        'mountain_road': 0.7,
        'local_road': 0.6
      };

      const trafficLevel = Math.min(1.0, baseTraffic * (typeMultiplier[location.type] || 1.0));
      
      // حساب السرعة المتوسطة
      const maxSpeed = location.type === 'highway' ? 120 : 
                     location.type === 'main_road' ? 80 : 
                     location.type === 'intersection' ? 40 : 60;
      
      const currentSpeed = Math.round(maxSpeed * (1 - trafficLevel * 0.6));
      
      // حساب عدد المركبات
      const vehicleCount = Math.round(trafficLevel * 200 + Math.random() * 50);
      
      // تحديد حالة الحركة المرورية
      let status = 'سلسة';
      let statusColor = '#10b981';
      
      if (trafficLevel > 0.7) {
        status = 'مزدحمة';
        statusColor = '#ef4444';
      } else if (trafficLevel > 0.5) {
        status = 'متوسطة';
        statusColor = '#f59e0b';
      }

      return {
        ...location,
        trafficLevel: Math.round(trafficLevel * 100),
        currentSpeed,
        maxSpeed,
        vehicleCount,
        status,
        statusColor,
        timestamp: currentTime.toISOString(),
        travelTime: calculateTravelTime(location, trafficLevel),
        incidents: generateIncidents(location, trafficLevel)
      };
    });
  };

  // حساب وقت السفر المتوقع
  const calculateTravelTime = (location, trafficLevel) => {
    const baseTime = location.type === 'highway' ? 15 : 
                    location.type === 'main_road' ? 10 : 5;
    
    const delayFactor = 1 + (trafficLevel * 0.8);
    return Math.round(baseTime * delayFactor);
  };

  // إنشاء حوادث وهمية
  const generateIncidents = (location, trafficLevel) => {
    const incidents = [];
    
    // احتمالية حدوث حادث تزيد مع الازدحام
    if (Math.random() < trafficLevel * 0.1) {
      const incidentTypes = ['عطل مركبة', 'حادث بسيط', 'أعمال صيانة', 'إغلاق مسار'];
      const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
      
      incidents.push({
        type: randomType,
        severity: trafficLevel > 0.7 ? 'عالي' : 'متوسط',
        estimatedDuration: Math.round(Math.random() * 30 + 10), // 10-40 دقيقة
        description: `${randomType} في ${location.name}`
      });
    }
    
    return incidents;
  };

  // بدء المراقبة
  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // تحديث فوري
    const newData = generateTrafficData();
    setTrafficData(newData);
    
    if (onDataUpdate) {
      onDataUpdate(newData);
    }
    
    // تحديث دوري
    intervalRef.current = setInterval(() => {
      const updatedData = generateTrafficData();
      setTrafficData(updatedData);
      
      if (onDataUpdate) {
        onDataUpdate(updatedData);
      }
    }, updateInterval * 1000);
  };

  // إيقاف المراقبة
  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // تنظيف عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // تحديث الفاصل الزمني
  useEffect(() => {
    if (isMonitoring) {
      stopMonitoring();
      startMonitoring();
    }
  }, [updateInterval]);

  return (
    <div className="space-y-6" dir="rtl">
      {/* لوحة التحكم */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">مراقبة الحركة المرورية الحية</h2>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <label className="text-sm font-medium text-gray-700">فترة التحديث:</label>
              <select
                value={updateInterval}
                onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
                className="p-2 border rounded-md text-sm"
              >
                <option value={10}>10 ثواني</option>
                <option value={30}>30 ثانية</option>
                <option value={60}>دقيقة واحدة</option>
                <option value={300}>5 دقائق</option>
              </select>
            </div>
            
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`px-4 py-2 rounded-md font-medium ${
                isMonitoring 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isMonitoring ? (
                <>
                  <i className="fas fa-stop ml-2"></i>
                  إيقاف المراقبة
                </>
              ) : (
                <>
                  <i className="fas fa-play ml-2"></i>
                  بدء المراقبة
                </>
              )}
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        {trafficData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">المواقع السلسة</p>
              <p className="text-2xl font-bold text-green-600">
                {trafficData.filter(d => d.status === 'سلسة').length}
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">المواقع المتوسطة</p>
              <p className="text-2xl font-bold text-yellow-600">
                {trafficData.filter(d => d.status === 'متوسطة').length}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">المواقع المزدحمة</p>
              <p className="text-2xl font-bold text-red-600">
                {trafficData.filter(d => d.status === 'مزدحمة').length}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">إجمالي الحوادث</p>
              <p className="text-2xl font-bold text-blue-600">
                {trafficData.reduce((sum, d) => sum + d.incidents.length, 0)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* جدول بيانات الحركة المرورية */}
      {trafficData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">بيانات الحركة المرورية الحية</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الموقع</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">مستوى الازدحام</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">السرعة الحالية</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">عدد المركبات</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">وقت السفر</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الحوادث</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">آخر تحديث</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trafficData.map((location) => (
                  <tr 
                    key={location.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedLocation?.id === location.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{location.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <span 
                        className="px-2 py-1 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: location.statusColor }}
                      >
                        {location.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${location.trafficLevel}%`,
                              backgroundColor: location.statusColor
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">{location.trafficLevel}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {location.currentSpeed} / {location.maxSpeed} كم/س
                    </td>
                    <td className="px-4 py-3 text-sm">{location.vehicleCount}</td>
                    <td className="px-4 py-3 text-sm">{location.travelTime} دقيقة</td>
                    <td className="px-4 py-3 text-sm">
                      {location.incidents.length > 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {location.incidents.length} حادث
                        </span>
                      ) : (
                        <span className="text-green-600 text-xs">لا توجد</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(location.timestamp).toLocaleTimeString('ar-SA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* تفاصيل الموقع المحدد */}
      {selectedLocation && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            تفاصيل الموقع: {selectedLocation.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">معلومات الحركة المرورية</h4>
              <div className="space-y-2 text-sm">
                <p><strong>الحالة الحالية:</strong> 
                  <span 
                    className="px-2 py-1 rounded-full text-white text-xs font-medium mr-2"
                    style={{ backgroundColor: selectedLocation.statusColor }}
                  >
                    {selectedLocation.status}
                  </span>
                </p>
                <p><strong>مستوى الازدحام:</strong> {selectedLocation.trafficLevel}%</p>
                <p><strong>السرعة المتوسطة:</strong> {selectedLocation.currentSpeed} كم/س</p>
                <p><strong>الحد الأقصى للسرعة:</strong> {selectedLocation.maxSpeed} كم/س</p>
                <p><strong>عدد المركبات المقدر:</strong> {selectedLocation.vehicleCount}</p>
                <p><strong>وقت السفر المتوقع:</strong> {selectedLocation.travelTime} دقيقة</p>
                <p><strong>نوع الطريق:</strong> {selectedLocation.type}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">الحوادث والتنبيهات</h4>
              {selectedLocation.incidents.length > 0 ? (
                <div className="space-y-2">
                  {selectedLocation.incidents.map((incident, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-red-800">{incident.type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident.severity === 'عالي' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {incident.severity}
                        </span>
                      </div>
                      <p className="text-sm text-red-700">{incident.description}</p>
                      <p className="text-xs text-red-600 mt-1">
                        المدة المتوقعة: {incident.estimatedDuration} دقيقة
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 text-sm">لا توجد حوادث أو تنبيهات حالياً</p>
              )}
            </div>
          </div>

          {/* رسم بياني لتطور الحركة المرورية */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">تطور الحركة المرورية (آخر ساعة)</h4>
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">رسم بياني تفاعلي لتطور الحركة المرورية</p>
              {/* يمكن إضافة مكتبة رسوم بيانية هنا مثل Chart.js */}
            </div>
          </div>
        </div>
      )}

      {/* إعدادات المراقبة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">إعدادات المراقبة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">مصادر البيانات</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="ml-2" />
                <span className="text-sm">خرائط جوجل</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="ml-2" />
                <span className="text-sm">OpenStreetMap</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" />
                <span className="text-sm">HERE Maps</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" />
                <span className="text-sm">كاميرات المراقبة</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">التنبيهات</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="ml-2" />
                <span className="text-sm">ازدحام شديد</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="ml-2" />
                <span className="text-sm">حوادث مرورية</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" />
                <span className="text-sm">أعمال صيانة</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" />
                <span className="text-sm">تغيير في أوقات السفر</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">خيارات العرض</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="ml-2" />
                <span className="text-sm">عرض على الخريطة</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="ml-2" />
                <span className="text-sm">الرسوم البيانية</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" />
                <span className="text-sm">التقارير التلقائية</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="ml-2" />
                <span className="text-sm">تصدير البيانات</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficMonitoring;

