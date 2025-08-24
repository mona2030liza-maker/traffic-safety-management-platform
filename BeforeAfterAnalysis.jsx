import React, { useState, useRef } from 'react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { albahaRegionData } from '../data/albahaData';

// بيانات وهمية للمشاريع والتحليلات
const sampleProjects = [
  {
    id: 1,
    title: 'تطوير تقاطع طريق الملك فهد الرئيسي',
    description: 'مشروع تطوير وتحسين تقاطع طريق الملك فهد الرئيسي في مدينة الباحة',
    location: 'الباحة - طريق الملك فهد',
    governorate: 'albaha',
    type: 'تطوير تقاطع',
    status: 'مكتمل',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    budget: 2500000,
    actualCost: 2350000,
    beforeData: {
      accidents: 45,
      fatalities: 8,
      injuries: 67,
      trafficFlow: 15000,
      averageSpeed: 35,
      congestionLevel: 75,
      responseTime: 12,
      satisfactionRate: 45,
      violationCount: 230
    },
    afterData: {
      accidents: 18,
      fatalities: 2,
      injuries: 25,
      trafficFlow: 18000,
      averageSpeed: 45,
      congestionLevel: 35,
      responseTime: 8,
      satisfactionRate: 82,
      violationCount: 95
    },
    images: {
      before: ['/images/before1.jpg', '/images/before2.jpg'],
      after: ['/images/after1.jpg', '/images/after2.jpg']
    },
    reports: [
      { name: 'تقرير التحليل الأولي', url: '/reports/initial_analysis.pdf', date: '2023-05-15' },
      { name: 'تقرير التنفيذ', url: '/reports/implementation.pdf', date: '2023-10-20' },
      { name: 'تقرير التقييم النهائي', url: '/reports/final_evaluation.pdf', date: '2024-01-15' }
    ]
  },
  {
    id: 2,
    title: 'حملة مراقبة السرعة في طريق بلجرشي',
    description: 'حملة مكثفة لمراقبة السرعة والحد من المخالفات في طريق بلجرشي الرئيسي',
    location: 'بلجرشي - الطريق الرئيسي',
    governorate: 'baljurashi',
    type: 'حملة مرورية',
    status: 'مكتمل',
    startDate: '2023-09-01',
    endDate: '2023-11-30',
    budget: 150000,
    actualCost: 142000,
    beforeData: {
      accidents: 28,
      fatalities: 4,
      injuries: 35,
      trafficFlow: 8000,
      averageSpeed: 85,
      congestionLevel: 25,
      responseTime: 15,
      satisfactionRate: 60,
      violationCount: 450
    },
    afterData: {
      accidents: 12,
      fatalities: 1,
      injuries: 15,
      trafficFlow: 8200,
      averageSpeed: 65,
      congestionLevel: 20,
      responseTime: 12,
      satisfactionRate: 75,
      violationCount: 180
    },
    images: {
      before: ['/images/speed_before1.jpg'],
      after: ['/images/speed_after1.jpg']
    },
    reports: [
      { name: 'تقرير الحملة', url: '/reports/speed_campaign.pdf', date: '2023-12-10' }
    ]
  },
  {
    id: 3,
    title: 'تحسين الإضاءة في طريق المندق الجبلي',
    description: 'مشروع تحسين الإضاءة وإضافة عاكسات في الطريق الجبلي المؤدي للمندق',
    location: 'المندق - الطريق الجبلي',
    governorate: 'almandaq',
    type: 'تحسين إضاءة',
    status: 'قيد التنفيذ',
    startDate: '2023-10-01',
    endDate: '2024-03-31',
    budget: 800000,
    actualCost: 450000,
    beforeData: {
      accidents: 35,
      fatalities: 6,
      injuries: 42,
      trafficFlow: 5000,
      averageSpeed: 40,
      congestionLevel: 15,
      responseTime: 20,
      satisfactionRate: 35,
      violationCount: 85
    },
    afterData: {
      accidents: 22,
      fatalities: 3,
      injuries: 28,
      trafficFlow: 5200,
      averageSpeed: 45,
      congestionLevel: 12,
      responseTime: 16,
      satisfactionRate: 58,
      violationCount: 65
    },
    images: {
      before: ['/images/lighting_before1.jpg'],
      after: ['/images/lighting_after1.jpg']
    },
    reports: [
      { name: 'تقرير المرحلة الأولى', url: '/reports/lighting_phase1.pdf', date: '2023-12-01' }
    ]
  }
];

// مكون التحليل قبل وبعد
const BeforeAfterAnalysis = () => {
  const [selectedProject, setSelectedProject] = useState(sampleProjects[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [comparisonMode, setComparisonMode] = useState('chart');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // حساب التحسن النسبي
  const calculateImprovement = (before, after, isReverse = false) => {
    if (before === 0) return 0;
    const improvement = ((before - after) / before) * 100;
    return isReverse ? -improvement : improvement;
  };

  // الحصول على لون التحسن
  const getImprovementColor = (improvement, isReverse = false) => {
    const actualImprovement = isReverse ? -improvement : improvement;
    if (actualImprovement > 0) return 'text-green-600';
    if (actualImprovement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // رفع الملفات
  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // حذف ملف
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // بيانات الرسم البياني للمقارنة
  const getComparisonChartData = () => {
    const metrics = [
      { key: 'accidents', label: 'الحوادث', color: '#ef4444' },
      { key: 'fatalities', label: 'الوفيات', color: '#dc2626' },
      { key: 'injuries', label: 'الإصابات', color: '#f59e0b' },
      { key: 'violationCount', label: 'المخالفات', color: '#8b5cf6' }
    ];

    return {
      labels: metrics.map(m => m.label),
      datasets: [
        {
          label: 'قبل التنفيذ',
          data: metrics.map(m => selectedProject.beforeData[m.key]),
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: '#ef4444',
          borderWidth: 2
        },
        {
          label: 'بعد التنفيذ',
          data: metrics.map(m => selectedProject.afterData[m.key]),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: '#10b981',
          borderWidth: 2
        }
      ]
    };
  };

  // بيانات الرادار للأداء الشامل
  const getPerformanceRadarData = () => {
    const performanceMetrics = [
      { key: 'accidents', label: 'السلامة', reverse: true },
      { key: 'trafficFlow', label: 'تدفق المرور', reverse: false },
      { key: 'averageSpeed', label: 'السرعة المتوسطة', reverse: false },
      { key: 'responseTime', label: 'وقت الاستجابة', reverse: true },
      { key: 'satisfactionRate', label: 'الرضا', reverse: false },
      { key: 'congestionLevel', label: 'الازدحام', reverse: true }
    ];

    // تحويل القيم إلى نسب مئوية للمقارنة
    const normalizeValue = (value, key, isAfter = false) => {
      const maxValues = {
        accidents: 100,
        trafficFlow: 20000,
        averageSpeed: 100,
        responseTime: 30,
        satisfactionRate: 100,
        congestionLevel: 100
      };
      
      let normalized = (value / maxValues[key]) * 100;
      
      // عكس القيم للمؤشرات السلبية
      const metric = performanceMetrics.find(m => m.key === key);
      if (metric && metric.reverse) {
        normalized = 100 - normalized;
      }
      
      return Math.max(0, Math.min(100, normalized));
    };

    return {
      labels: performanceMetrics.map(m => m.label),
      datasets: [
        {
          label: 'قبل التنفيذ',
          data: performanceMetrics.map(m => 
            normalizeValue(selectedProject.beforeData[m.key], m.key, false)
          ),
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: '#ef4444',
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#ef4444'
        },
        {
          label: 'بعد التنفيذ',
          data: performanceMetrics.map(m => 
            normalizeValue(selectedProject.afterData[m.key], m.key, true)
          ),
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: '#10b981',
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#10b981'
        }
      ]
    };
  };

  // خيارات الرسوم البيانية
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
        beginAtZero: true
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">التحليل قبل وبعد</h1>
          <div className="flex space-x-4 space-x-reverse">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              <i className="fas fa-upload ml-2"></i>
              رفع تقرير
            </button>
            <button
              onClick={() => imageInputRef.current?.click()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
            >
              <i className="fas fa-image ml-2"></i>
              رفع صور
            </button>
          </div>
        </div>

        {/* اختيار المشروع */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">اختر المشروع للتحليل:</label>
          <select
            value={selectedProject.id}
            onChange={(e) => {
              const project = sampleProjects.find(p => p.id === parseInt(e.target.value));
              setSelectedProject(project);
            }}
            className="w-full p-3 border rounded-md text-sm"
          >
            {sampleProjects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title} - {project.location}
              </option>
            ))}
          </select>
        </div>

        {/* معلومات المشروع */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">نوع المشروع</p>
            <p className="text-lg font-bold text-blue-600">{selectedProject.type}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">الحالة</p>
            <p className="text-lg font-bold text-green-600">{selectedProject.status}</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">الميزانية</p>
            <p className="text-lg font-bold text-yellow-600">{selectedProject.budget.toLocaleString()} ر.س</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">التكلفة الفعلية</p>
            <p className="text-lg font-bold text-purple-600">{selectedProject.actualCost.toLocaleString()} ر.س</p>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b">
          <nav className="flex space-x-8 space-x-reverse px-6">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: 'fa-chart-line' },
              { id: 'comparison', label: 'المقارنة التفصيلية', icon: 'fa-balance-scale' },
              { id: 'performance', label: 'تحليل الأداء', icon: 'fa-tachometer-alt' },
              { id: 'media', label: 'الصور والتقارير', icon: 'fa-folder-open' },
              { id: 'recommendations', label: 'التوصيات', icon: 'fa-lightbulb' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`fas ${tab.icon} ml-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* تبويب النظرة العامة */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">نظرة عامة على المشروع</h3>
                <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">معلومات المشروع</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>الموقع:</strong> {selectedProject.location}</p>
                      <p><strong>المحافظة:</strong> {albahaRegionData.governorates.find(g => g.id === selectedProject.governorate)?.name}</p>
                      <p><strong>تاريخ البداية:</strong> {selectedProject.startDate}</p>
                      <p><strong>تاريخ النهاية:</strong> {selectedProject.endDate}</p>
                      <p><strong>المدة:</strong> {Math.ceil((new Date(selectedProject.endDate) - new Date(selectedProject.startDate)) / (1000 * 60 * 60 * 24))} يوم</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">النتائج الرئيسية</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>تقليل الحوادث:</span>
                        <span className={getImprovementColor(calculateImprovement(selectedProject.beforeData.accidents, selectedProject.afterData.accidents))}>
                          {calculateImprovement(selectedProject.beforeData.accidents, selectedProject.afterData.accidents).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>تقليل الوفيات:</span>
                        <span className={getImprovementColor(calculateImprovement(selectedProject.beforeData.fatalities, selectedProject.afterData.fatalities))}>
                          {calculateImprovement(selectedProject.beforeData.fatalities, selectedProject.afterData.fatalities).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>تحسين الرضا:</span>
                        <span className={getImprovementColor(calculateImprovement(selectedProject.beforeData.satisfactionRate, selectedProject.afterData.satisfactionRate, true))}>
                          {calculateImprovement(selectedProject.beforeData.satisfactionRate, selectedProject.afterData.satisfactionRate, true).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>توفير في التكلفة:</span>
                        <span className="text-green-600">
                          {((selectedProject.budget - selectedProject.actualCost) / selectedProject.budget * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تبويب المقارنة التفصيلية */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">المقارنة التفصيلية</h3>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => setComparisonMode('chart')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      comparisonMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    رسم بياني
                  </button>
                  <button
                    onClick={() => setComparisonMode('table')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      comparisonMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    جدول
                  </button>
                </div>
              </div>

              {comparisonMode === 'chart' ? (
                <div className="h-96">
                  <Bar data={getComparisonChartData()} options={chartOptions} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">المؤشر</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">قبل التنفيذ</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">بعد التنفيذ</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">التحسن</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">النسبة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { key: 'accidents', label: 'عدد الحوادث', unit: 'حادث' },
                        { key: 'fatalities', label: 'عدد الوفيات', unit: 'وفاة' },
                        { key: 'injuries', label: 'عدد الإصابات', unit: 'إصابة' },
                        { key: 'trafficFlow', label: 'تدفق المرور', unit: 'مركبة/يوم', reverse: true },
                        { key: 'averageSpeed', label: 'السرعة المتوسطة', unit: 'كم/س', reverse: true },
                        { key: 'congestionLevel', label: 'مستوى الازدحام', unit: '%' },
                        { key: 'responseTime', label: 'وقت الاستجابة', unit: 'دقيقة' },
                        { key: 'satisfactionRate', label: 'معدل الرضا', unit: '%', reverse: true },
                        { key: 'violationCount', label: 'عدد المخالفات', unit: 'مخالفة' }
                      ].map(metric => {
                        const before = selectedProject.beforeData[metric.key];
                        const after = selectedProject.afterData[metric.key];
                        const improvement = calculateImprovement(before, after, metric.reverse);
                        
                        return (
                          <tr key={metric.key}>
                            <td className="px-4 py-3 text-sm font-medium">{metric.label}</td>
                            <td className="px-4 py-3 text-sm">{before.toLocaleString()} {metric.unit}</td>
                            <td className="px-4 py-3 text-sm">{after.toLocaleString()} {metric.unit}</td>
                            <td className="px-4 py-3 text-sm">
                              {metric.reverse ? (after - before).toLocaleString() : (before - after).toLocaleString()} {metric.unit}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={getImprovementColor(improvement, metric.reverse)}>
                                {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* تبويب تحليل الأداء */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">تحليل الأداء الشامل</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-700 mb-4">مقارنة الأداء العام</h4>
                  <div className="h-64">
                    <Radar data={getPerformanceRadarData()} options={radarOptions} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">تقييم النتائج</h4>
                  
                  {[
                    { 
                      title: 'السلامة المرورية', 
                      score: 85, 
                      description: 'تحسن كبير في مؤشرات السلامة مع انخفاض الحوادث والوفيات' 
                    },
                    { 
                      title: 'كفاءة المرور', 
                      score: 78, 
                      description: 'تحسن ملحوظ في تدفق المرور وانخفاض الازدحام' 
                    },
                    { 
                      title: 'رضا المستخدمين', 
                      score: 82, 
                      description: 'ارتفاع كبير في معدل رضا المستخدمين عن الخدمات' 
                    },
                    { 
                      title: 'الاستجابة للطوارئ', 
                      score: 75, 
                      description: 'تحسن في أوقات الاستجابة للحوادث والطوارئ' 
                    }
                  ].map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{item.title}</h5>
                        <span className="text-2xl font-bold text-blue-600">{item.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تبويب الصور والتقارير */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">الصور والتقارير</h3>
              
              {/* الصور قبل وبعد */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">صور قبل التنفيذ</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProject.images.before.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <i className="fas fa-image text-2xl mb-2"></i>
                          <p className="text-sm">صورة قبل {index + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">صور بعد التنفيذ</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProject.images.after.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <i className="fas fa-image text-2xl mb-2"></i>
                          <p className="text-sm">صورة بعد {index + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* التقارير */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">التقارير المرفقة</h4>
                <div className="space-y-3">
                  {selectedProject.reports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-file-pdf text-red-500 text-xl ml-3"></i>
                        <div>
                          <p className="font-medium text-gray-900">{report.name}</p>
                          <p className="text-sm text-gray-500">تاريخ الرفع: {report.date}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* الملفات المرفوعة */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">الملفات المرفوعة حديثاً</h4>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center">
                          <i className={`fas ${file.type === 'image' ? 'fa-image' : 'fa-file'} text-blue-500 text-xl ml-3`}></i>
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB - {new Date(file.uploadDate).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* تبويب التوصيات */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">التوصيات والخطوات التالية</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">التوصيات الرئيسية</h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'مواصلة المراقبة',
                        description: 'الاستمرار في مراقبة المؤشرات للتأكد من استدامة التحسن',
                        priority: 'عالية',
                        timeline: '3 أشهر'
                      },
                      {
                        title: 'توسيع النطاق',
                        description: 'تطبيق نفس الحلول على مواقع مشابهة في المنطقة',
                        priority: 'متوسطة',
                        timeline: '6 أشهر'
                      },
                      {
                        title: 'تحسينات إضافية',
                        description: 'إضافة تحسينات تقنية لزيادة الفعالية',
                        priority: 'منخفضة',
                        timeline: '12 شهر'
                      }
                    ].map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{rec.title}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'عالية' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'متوسطة' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <p className="text-xs text-gray-500">الإطار الزمني: {rec.timeline}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">الدروس المستفادة</h4>
                  <div className="space-y-3">
                    {[
                      'أهمية التخطيط المسبق والدراسة التفصيلية للموقع',
                      'ضرورة إشراك المجتمع المحلي في عملية التطوير',
                      'فعالية استخدام التقنيات الحديثة في المراقبة',
                      'أهمية المتابعة المستمرة لضمان استدامة النتائج',
                      'قيمة التنسيق بين الجهات المختلفة'
                    ].map((lesson, index) => (
                      <div key={index} className="flex items-start">
                        <i className="fas fa-lightbulb text-yellow-500 mt-1 ml-2"></i>
                        <p className="text-sm text-gray-700">{lesson}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">خطة العمل المستقبلية</h4>
                    <div className="space-y-2">
                      {[
                        { task: 'مراجعة شهرية للمؤشرات', date: '2024-02-01' },
                        { task: 'تقرير ربع سنوي', date: '2024-03-31' },
                        { task: 'تقييم سنوي شامل', date: '2024-12-31' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{item.task}</span>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* حقول الرفع المخفية */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        onChange={(e) => handleFileUpload(e, 'document')}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'image')}
        className="hidden"
      />
    </div>
  );
};

export default BeforeAfterAnalysis;

