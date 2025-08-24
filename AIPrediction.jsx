import React, { useState, useEffect } from 'react';
import { Line, Bar, Scatter, Doughnut } from 'react-chartjs-2';
import { albahaRegionData } from '../data/albahaData';

// نماذج التنبؤ المختلفة
const predictionModels = {
  accidents: {
    name: 'نموذج التنبؤ بالحوادث',
    description: 'يتنبأ بعدد الحوادث المتوقعة بناءً على العوامل المختلفة',
    accuracy: 87.5,
    lastTrained: '2024-01-10',
    features: ['الطقس', 'الوقت', 'حجم المرور', 'نوع الطريق', 'السرعة المتوسطة']
  },
  traffic: {
    name: 'نموذج التنبؤ بالازدحام',
    description: 'يتنبأ بمستويات الازدحام المرورية في أوقات مختلفة',
    accuracy: 92.3,
    lastTrained: '2024-01-08',
    features: ['التاريخ والوقت', 'الأحداث الخاصة', 'الطقس', 'البيانات التاريخية']
  },
  violations: {
    name: 'نموذج التنبؤ بالمخالفات',
    description: 'يتنبأ بأنواع وأعداد المخالفات المرورية المتوقعة',
    accuracy: 84.7,
    lastTrained: '2024-01-12',
    features: ['نوع الطريق', 'الوقت', 'كثافة المرور', 'وجود كاميرات']
  },
  maintenance: {
    name: 'نموذج التنبؤ بالصيانة',
    description: 'يتنبأ بالحاجة لصيانة الطرق والبنية التحتية',
    accuracy: 89.1,
    lastTrained: '2024-01-05',
    features: ['عمر الطريق', 'حجم المرور', 'الطقس', 'نوع المواد']
  }
};

// بيانات وهمية للتنبؤات
const generatePredictionData = (type, period) => {
  const now = new Date();
  const data = [];
  
  for (let i = 0; i < period; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    let value;
    switch (type) {
      case 'accidents':
        // محاكاة تنبؤات الحوادث مع تأثير الطقس والوقت
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
        const baseAccidents = isWeekend ? 3 : 5;
        const weatherFactor = Math.random() > 0.7 ? 1.5 : 1; // 30% احتمال طقس سيء
        value = Math.round(baseAccidents * weatherFactor + Math.random() * 2);
        break;
        
      case 'traffic':
        // محاكاة تنبؤات الازدحام
        const hour = Math.floor(Math.random() * 24);
        let congestion = 30; // مستوى أساسي
        if (hour >= 7 && hour <= 9) congestion = 80; // ذروة صباحية
        else if (hour >= 16 && hour <= 19) congestion = 75; // ذروة مسائية
        else if (hour >= 22 || hour <= 5) congestion = 15; // ليلاً
        value = congestion + Math.random() * 10 - 5;
        break;
        
      case 'violations':
        // محاكاة تنبؤات المخالفات
        value = Math.round(15 + Math.random() * 20);
        break;
        
      case 'maintenance':
        // محاكاة تنبؤات الصيانة (احتمالية)
        value = Math.random() * 100;
        break;
        
      default:
        value = Math.random() * 100;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value),
      confidence: 70 + Math.random() * 25 // مستوى الثقة 70-95%
    });
  }
  
  return data;
};

// مكون التنبؤ بالذكاء الاصطناعي
const AIPrediction = () => {
  const [selectedModel, setSelectedModel] = useState('accidents');
  const [predictionPeriod, setPredictionPeriod] = useState(7);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [predictionData, setPredictionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeFactors, setRealTimeFactors] = useState({
    weather: 'مشمس',
    traffic: 'متوسط',
    events: 'لا توجد',
    temperature: 25,
    humidity: 45,
    windSpeed: 10
  });

  // تحديث التنبؤات عند تغيير المعاملات
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generatePredictionData(selectedModel, predictionPeriod);
      setPredictionData(data);
      setIsLoading(false);
    }, 1000);
  }, [selectedModel, predictionPeriod, selectedLocation]);

  // إنشاء بيانات الرسم البياني
  const getChartData = () => {
    const labels = predictionData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
    });
    
    const values = predictionData.map(d => d.value);
    const confidence = predictionData.map(d => d.confidence);
    
    return {
      labels,
      datasets: [
        {
          label: 'التنبؤ',
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'مستوى الثقة',
          data: confidence,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };

  // خيارات الرسم البياني
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        max: 100,
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  // تشغيل التنبؤ
  const runPrediction = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generatePredictionData(selectedModel, predictionPeriod);
      setPredictionData(data);
      setIsLoading(false);
    }, 2000);
  };

  // حفظ النموذج
  const saveModel = () => {
    alert('تم حفظ النموذج بنجاح!');
  };

  // تصدير التنبؤات
  const exportPredictions = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "التاريخ,القيمة المتوقعة,مستوى الثقة\n"
      + predictionData.map(d => `${d.date},${d.value.toFixed(2)},${d.confidence.toFixed(1)}%`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `predictions_${selectedModel}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">التنبؤ بالذكاء الاصطناعي</h1>
            <p className="text-gray-600 mt-2">استخدام نماذج الذكاء الاصطناعي للتنبؤ بالأنماط المرورية والحوادث</p>
          </div>
          <div className="flex space-x-4 space-x-reverse">
            <button
              onClick={runPrediction}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin ml-2"></i>
                  جاري التنبؤ...
                </>
              ) : (
                <>
                  <i className="fas fa-brain ml-2"></i>
                  تشغيل التنبؤ
                </>
              )}
            </button>
            <button
              onClick={exportPredictions}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
            >
              <i className="fas fa-download ml-2"></i>
              تصدير النتائج
            </button>
          </div>
        </div>

        {/* إعدادات التنبؤ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نموذج التنبؤ</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              {Object.entries(predictionModels).map(([key, model]) => (
                <option key={key} value={key}>{model.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">فترة التنبؤ</label>
            <select
              value={predictionPeriod}
              onChange={(e) => setPredictionPeriod(parseInt(e.target.value))}
              className="w-full p-3 border rounded-md"
            >
              <option value={7}>أسبوع واحد</option>
              <option value={14}>أسبوعين</option>
              <option value={30}>شهر واحد</option>
              <option value={90}>3 أشهر</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="all">جميع المواقع</option>
              {albahaRegionData.governorates.map(gov => (
                <option key={gov.id} value={gov.id}>{gov.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-center w-full">
              <p className="text-sm text-gray-600">دقة النموذج</p>
              <p className="text-2xl font-bold text-green-600">
                {predictionModels[selectedModel].accuracy}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات النموذج المحدد */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">معلومات النموذج</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">{predictionModels[selectedModel].name}</h3>
            <p className="text-gray-600 mb-4">{predictionModels[selectedModel].description}</p>
            
            <div className="space-y-2 text-sm">
              <p><strong>دقة النموذج:</strong> {predictionModels[selectedModel].accuracy}%</p>
              <p><strong>آخر تدريب:</strong> {predictionModels[selectedModel].lastTrained}</p>
              <p><strong>عدد المتغيرات:</strong> {predictionModels[selectedModel].features.length}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">المتغيرات المستخدمة:</h4>
            <div className="flex flex-wrap gap-2">
              {predictionModels[selectedModel].features.map((feature, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">حالة النموذج:</h4>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">نشط ومحدث</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* العوامل المؤثرة في الوقت الحقيقي */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">العوامل المؤثرة في الوقت الحقيقي</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">الطقس</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">حالة الطقس</label>
                <select
                  value={realTimeFactors.weather}
                  onChange={(e) => setRealTimeFactors(prev => ({...prev, weather: e.target.value}))}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="مشمس">مشمس</option>
                  <option value="غائم">غائم</option>
                  <option value="ممطر">ممطر</option>
                  <option value="ضبابي">ضبابي</option>
                  <option value="عاصف">عاصف</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">درجة الحرارة (°م)</label>
                <input
                  type="number"
                  value={realTimeFactors.temperature}
                  onChange={(e) => setRealTimeFactors(prev => ({...prev, temperature: parseInt(e.target.value)}))}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">المرور</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">كثافة المرور</label>
                <select
                  value={realTimeFactors.traffic}
                  onChange={(e) => setRealTimeFactors(prev => ({...prev, traffic: e.target.value}))}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="خفيف">خفيف</option>
                  <option value="متوسط">متوسط</option>
                  <option value="كثيف">كثيف</option>
                  <option value="مزدحم جداً">مزدحم جداً</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">الرطوبة (%)</label>
                <input
                  type="number"
                  value={realTimeFactors.humidity}
                  onChange={(e) => setRealTimeFactors(prev => ({...prev, humidity: parseInt(e.target.value)}))}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">الأحداث</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">الأحداث الخاصة</label>
                <select
                  value={realTimeFactors.events}
                  onChange={(e) => setRealTimeFactors(prev => ({...prev, events: e.target.value}))}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="لا توجد">لا توجد</option>
                  <option value="مهرجان">مهرجان</option>
                  <option value="مباراة">مباراة رياضية</option>
                  <option value="أعمال صيانة">أعمال صيانة</option>
                  <option value="حادث">حادث مروري</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">سرعة الرياح (كم/س)</label>
                <input
                  type="number"
                  value={realTimeFactors.windSpeed}
                  onChange={(e) => setRealTimeFactors(prev => ({...prev, windSpeed: parseInt(e.target.value)}))}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* نتائج التنبؤ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الرسم البياني الرئيسي */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">نتائج التنبؤ</h2>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">التنبؤ</span>
              <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
              <span className="text-sm text-gray-600">مستوى الثقة</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
                <p className="text-gray-600">جاري إنشاء التنبؤات...</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <Line data={getChartData()} options={chartOptions} />
            </div>
          )}
        </div>

        {/* الإحصائيات السريعة */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">إحصائيات التنبؤ</h3>
            
            {predictionData.length > 0 && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">المتوسط المتوقع</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(predictionData.reduce((sum, d) => sum + d.value, 0) / predictionData.length).toFixed(1)}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">أعلى قيمة متوقعة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.max(...predictionData.map(d => d.value)).toFixed(1)}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">أقل قيمة متوقعة</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {Math.min(...predictionData.map(d => d.value)).toFixed(1)}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">متوسط الثقة</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(predictionData.reduce((sum, d) => sum + d.confidence, 0) / predictionData.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* التنبيهات والتوصيات */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">التنبيهات والتوصيات</h3>
            
            <div className="space-y-3">
              {predictionData.length > 0 && (
                <>
                  {Math.max(...predictionData.map(d => d.value)) > 10 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-exclamation-triangle text-red-500 ml-2"></i>
                        <div>
                          <p className="text-sm font-medium text-red-800">تحذير عالي</p>
                          <p className="text-xs text-red-600">متوقع ارتفاع في القيم خلال الفترة القادمة</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {predictionData.some(d => d.confidence < 80) && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-info-circle text-yellow-500 ml-2"></i>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">انتباه</p>
                          <p className="text-xs text-yellow-600">بعض التنبؤات لها مستوى ثقة منخفض</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <i className="fas fa-lightbulb text-blue-500 ml-2"></i>
                      <div>
                        <p className="text-sm font-medium text-blue-800">توصية</p>
                        <p className="text-xs text-blue-600">زيادة المراقبة في الأوقات المتوقع ارتفاع القيم فيها</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* أمثلة تطبيقية */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">أمثلة تطبيقية للذكاء الاصطناعي</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'التنبؤ بالحوادث في المنحنيات الخطيرة',
              description: 'استخدام بيانات الطقس والسرعة للتنبؤ بالحوادث في المنحنيات',
              accuracy: '89%',
              example: 'تنبؤ بزيادة 40% في الحوادث عند هطول الأمطار',
              icon: 'fa-road',
              color: 'red'
            },
            {
              title: 'تحسين توقيت الإشارات المرورية',
              description: 'تحليل أنماط المرور لتحسين توقيت الإشارات تلقائياً',
              accuracy: '94%',
              example: 'تقليل وقت الانتظار بنسبة 25% في التقاطعات الرئيسية',
              icon: 'fa-traffic-light',
              color: 'green'
            },
            {
              title: 'كشف المخالفات تلقائياً',
              description: 'استخدام الرؤية الحاسوبية لكشف المخالفات المرورية',
              accuracy: '92%',
              example: 'كشف 95% من مخالفات السرعة والتجاوز الخاطئ',
              icon: 'fa-camera',
              color: 'blue'
            },
            {
              title: 'التنبؤ بأعطال البنية التحتية',
              description: 'تحليل بيانات الاستشعار للتنبؤ بحاجة الطرق للصيانة',
              accuracy: '87%',
              example: 'توقع الحاجة للصيانة قبل 3 أشهر من الموعد المعتاد',
              icon: 'fa-tools',
              color: 'yellow'
            },
            {
              title: 'تحليل سلوك السائقين',
              description: 'تحليل أنماط القيادة لتحديد السائقين عالي المخاطر',
              accuracy: '85%',
              example: 'تحديد السائقين المعرضين للحوادث بدقة 85%',
              icon: 'fa-user-check',
              color: 'purple'
            },
            {
              title: 'تحسين مسارات الطوارئ',
              description: 'تحديد أفضل المسارات لسيارات الإسعاف والطوارئ',
              accuracy: '91%',
              example: 'تقليل وقت الوصول للطوارئ بنسبة 30%',
              icon: 'fa-ambulance',
              color: 'orange'
            }
          ].map((example, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 bg-${example.color}-100 rounded-full flex items-center justify-center ml-3`}>
                  <i className={`fas ${example.icon} text-${example.color}-600`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{example.title}</h4>
                  <span className={`text-xs px-2 py-1 bg-${example.color}-100 text-${example.color}-800 rounded-full`}>
                    دقة {example.accuracy}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{example.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-700">
                  <strong>مثال:</strong> {example.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إعدادات النموذج */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">إعدادات النموذج المتقدمة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">معاملات التدريب</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">معدل التعلم</label>
                <input type="number" step="0.001" defaultValue="0.001" className="w-full p-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">عدد العصور</label>
                <input type="number" defaultValue="100" className="w-full p-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">حجم الدفعة</label>
                <input type="number" defaultValue="32" className="w-full p-2 border rounded-md text-sm" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">إعدادات التحقق</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">نسبة بيانات التحقق (%)</label>
                <input type="number" defaultValue="20" className="w-full p-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">طريقة التحقق</label>
                <select className="w-full p-2 border rounded-md text-sm">
                  <option value="holdout">Hold-out</option>
                  <option value="kfold">K-Fold Cross Validation</option>
                  <option value="stratified">Stratified Sampling</option>
                </select>
              </div>
              <div className="flex space-x-4 space-x-reverse">
                <button
                  onClick={saveModel}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  حفظ النموذج
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  إعادة تدريب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPrediction;

