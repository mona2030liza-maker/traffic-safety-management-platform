import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { albahaRegionData, sampleAccidents, blackspots, cameras } from '../data/albahaData';

// تسجيل مكونات Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// بيانات وهمية للأخبار والفعاليات
const newsAndEvents = [
  {
    id: 1,
    type: 'news',
    title: 'انخفاض الحوادث المرورية بنسبة 15% في الربع الأول',
    content: 'أظهرت الإحصائيات الأولية انخفاضاً ملحوظاً في عدد الحوادث المرورية بمنطقة الباحة',
    date: '2024-01-15',
    priority: 'high',
    category: 'إحصائيات'
  },
  {
    id: 2,
    type: 'event',
    title: 'ورشة تدريبية حول السلامة المرورية',
    content: 'تنظم إدارة المرور ورشة تدريبية للسائقين المهنيين يوم الأحد القادم',
    date: '2024-01-20',
    priority: 'medium',
    category: 'تدريب'
  },
  {
    id: 3,
    type: 'alert',
    title: 'تحذير من الضباب الكثيف',
    content: 'يتوقع تشكل ضباب كثيف على الطرق الجبلية خلال الساعات القادمة',
    date: '2024-01-18',
    priority: 'urgent',
    category: 'طقس'
  },
  {
    id: 4,
    type: 'news',
    title: 'افتتاح مركز جديد لفحص المركبات',
    content: 'تم افتتاح مركز جديد لفحص المركبات في محافظة بلجرشي لخدمة المواطنين',
    date: '2024-01-12',
    priority: 'medium',
    category: 'خدمات'
  },
  {
    id: 5,
    type: 'event',
    title: 'حملة توعوية في المدارس',
    content: 'انطلاق حملة توعوية شاملة حول السلامة المرورية في جميع مدارس المنطقة',
    date: '2024-01-25',
    priority: 'high',
    category: 'توعية'
  }
];

// بيانات وهمية للحملات النشطة
const activeCampaigns = [
  {
    id: 1,
    title: 'حملة السلامة الشاملة',
    progress: 75,
    budget: 500000,
    spent: 375000,
    endDate: '2024-06-30',
    status: 'نشطة'
  },
  {
    id: 2,
    title: 'مراقبة السرعة',
    progress: 45,
    budget: 300000,
    spent: 135000,
    endDate: '2024-04-30',
    status: 'نشطة'
  },
  {
    id: 3,
    title: 'سلامة المشاة',
    progress: 90,
    budget: 750000,
    spent: 675000,
    endDate: '2024-03-31',
    status: 'قريباً من الانتهاء'
  }
];

// لوحة العرض العامة
const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dashboardData, setDashboardData] = useState({});

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // إنشاء بيانات المؤشرات
  useEffect(() => {
    const generateDashboardData = () => {
      const data = {
        // المؤشرات الرئيسية
        kpis: {
          totalAccidents: sampleAccidents.length,
          activeBlackspots: blackspots.filter(b => b.status === 'مؤكدة').length,
          activeCameras: cameras.filter(c => c.status === 'نشط').length,
          activeCampaigns: activeCampaigns.filter(c => c.status === 'نشطة').length,
          accidentReduction: 15.2,
          responseTime: 8.5,
          satisfactionRate: 87.3,
          budgetUtilization: 68.4
        },

        // بيانات الحوادث حسب النوع
        accidentsByType: {
          labels: ['تصادم', 'انقلاب', 'دهس مشاة', 'اصطدام بجسم ثابت', 'حريق مركبة'],
          datasets: [{
            label: 'عدد الحوادث',
            data: [45, 23, 12, 18, 2],
            backgroundColor: [
              '#ef4444',
              '#f59e0b',
              '#8b5cf6',
              '#06b6d4',
              '#10b981'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },

        // اتجاه الحوادث عبر الوقت
        accidentTrend: {
          labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
          datasets: [{
            label: 'الحوادث الفعلية',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
          }, {
            label: 'المتوقع',
            data: [70, 65, 75, 70, 65, 60],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            borderDash: [5, 5]
          }]
        },

        // الحوادث حسب المحافظة
        accidentsByGovernorate: {
          labels: albahaRegionData.governorates.slice(0, 6).map(g => g.name),
          datasets: [{
            label: 'عدد الحوادث',
            data: [25, 18, 12, 8, 6, 4],
            backgroundColor: '#3b82f6',
            borderColor: '#1d4ed8',
            borderWidth: 1
          }]
        },

        // تحليل الأداء
        performanceRadar: {
          labels: ['السلامة', 'الاستجابة', 'التوعية', 'البنية التحتية', 'التقنية', 'الشراكات'],
          datasets: [{
            label: 'الأداء الحالي',
            data: [85, 78, 92, 67, 74, 81],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#3b82f6'
          }, {
            label: 'الهدف',
            data: [90, 85, 95, 80, 85, 90],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: '#10b981',
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#10b981'
          }]
        }
      };

      setDashboardData(data);
    };

    generateDashboardData();
  }, [selectedPeriod]);

  // خيارات الرسوم البيانية
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Arial, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
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
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-r-4 border-red-500 bg-red-50';
      case 'high': return 'border-r-4 border-orange-500 bg-orange-50';
      case 'medium': return 'border-r-4 border-yellow-500 bg-yellow-50';
      default: return 'border-r-4 border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* رأس اللوحة */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* الشعار والعنوان */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <img 
                src="/src/assets/logo.png" 
                alt="شعار المركز" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  مركز تخطيط المرور وهندسة النقل للسلامة المرورية
                </h1>
                <p className="text-sm text-gray-600">منطقة الباحة - المملكة العربية السعودية</p>
              </div>
            </div>

            {/* الوقت والتاريخ */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleTimeString('ar-SA')}
                </p>
                <p className="text-xs text-gray-600">
                  {currentTime.toLocaleDateString('ar-SA', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border rounded-md px-3 py-1"
                >
                  <option value="day">اليوم</option>
                  <option value="week">الأسبوع</option>
                  <option value="month">الشهر</option>
                  <option value="quarter">الربع</option>
                  <option value="year">السنة</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* المؤشرات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-car-crash text-red-600"></i>
                </div>
              </div>
              <div className="mr-4 flex-1">
                <p className="text-sm font-medium text-gray-600">إجمالي الحوادث</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis?.totalAccidents || 0}</p>
                <p className="text-xs text-green-600">
                  <i className="fas fa-arrow-down mr-1"></i>
                  انخفاض {dashboardData.kpis?.accidentReduction || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-white"></i>
                </div>
              </div>
              <div className="mr-4 flex-1">
                <p className="text-sm font-medium text-gray-600">النقاط السوداء النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis?.activeBlackspots || 0}</p>
                <p className="text-xs text-yellow-600">
                  <i className="fas fa-exclamation mr-1"></i>
                  تحتاج متابعة
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-video text-blue-600"></i>
                </div>
              </div>
              <div className="mr-4 flex-1">
                <p className="text-sm font-medium text-gray-600">كاميرات المراقبة</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis?.activeCameras || 0}</p>
                <p className="text-xs text-green-600">
                  <i className="fas fa-check-circle mr-1"></i>
                  نشطة
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-bullhorn text-green-600"></i>
                </div>
              </div>
              <div className="mr-4 flex-1">
                <p className="text-sm font-medium text-gray-600">الحملات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.kpis?.activeCampaigns || 0}</p>
                <p className="text-xs text-blue-600">
                  <i className="fas fa-play mr-1"></i>
                  قيد التنفيذ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الصف الثاني من المؤشرات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">وقت الاستجابة</p>
              <p className="text-3xl font-bold text-blue-600">{dashboardData.kpis?.responseTime || 0}</p>
              <p className="text-xs text-gray-500">دقيقة</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">معدل الرضا</p>
              <p className="text-3xl font-bold text-green-600">{dashboardData.kpis?.satisfactionRate || 0}%</p>
              <p className="text-xs text-gray-500">من المستفيدين</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">استغلال الميزانية</p>
              <p className="text-3xl font-bold text-yellow-600">{dashboardData.kpis?.budgetUtilization || 0}%</p>
              <p className="text-xs text-gray-500">من الميزانية المخصصة</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">تقليل الحوادث</p>
              <p className="text-3xl font-bold text-green-600">{dashboardData.kpis?.accidentReduction || 0}%</p>
              <p className="text-xs text-gray-500">مقارنة بالعام الماضي</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* الرسوم البيانية */}
          <div className="lg:col-span-2 space-y-6">
            {/* اتجاه الحوادث */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">اتجاه الحوادث المرورية</h3>
              <div className="h-64">
                {dashboardData.accidentTrend && (
                  <Line data={dashboardData.accidentTrend} options={chartOptions} />
                )}
              </div>
            </div>

            {/* الحوادث حسب المحافظة */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">الحوادث حسب المحافظة</h3>
              <div className="h-64">
                {dashboardData.accidentsByGovernorate && (
                  <Bar data={dashboardData.accidentsByGovernorate} options={chartOptions} />
                )}
              </div>
            </div>
          </div>

          {/* الأخبار والتنبيهات */}
          <div className="space-y-6">
            {/* الأخبار والفعاليات */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">الأخبار والفعاليات</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {newsAndEvents.slice(0, 5).map((item) => (
                  <div key={item.id} className={`p-3 rounded-lg ${getPriorityColor(item.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{item.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{item.date}</span>
                          <span className="text-xs bg-white px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="mr-2">
                        <i className={`fas ${
                          item.type === 'news' ? 'fa-newspaper' :
                          item.type === 'event' ? 'fa-calendar' : 'fa-exclamation-triangle'
                        } text-gray-400`}></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الحوادث حسب النوع */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">توزيع الحوادث حسب النوع</h3>
              <div className="h-48">
                {dashboardData.accidentsByType && (
                  <Doughnut 
                    data={dashboardData.accidentsByType} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            font: {
                              size: 10
                            }
                          }
                        }
                      }
                    }} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* تحليل الأداء */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">تحليل الأداء</h3>
            <div className="h-64">
              {dashboardData.performanceRadar && (
                <Radar data={dashboardData.performanceRadar} options={radarOptions} />
              )}
            </div>
          </div>

          {/* الحملات النشطة */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">الحملات النشطة</h3>
            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'نشطة' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>التقدم</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>الميزانية: {campaign.budget.toLocaleString()} ر.س</span>
                    <span>المنفق: {campaign.spent.toLocaleString()} ر.س</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    ينتهي في: {campaign.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* خريطة سريعة */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">نظرة عامة على الخريطة</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              عرض الخريطة الكاملة
              <i className="fas fa-external-link-alt mr-1"></i>
            </button>
          </div>
          
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <i className="fas fa-map text-4xl mb-2"></i>
              <p>خريطة تفاعلية لمنطقة الباحة</p>
              <p className="text-sm">عرض الحوادث والنقاط السوداء والكاميرات</p>
            </div>
          </div>
        </div>

        {/* تذييل اللوحة */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <img 
                src="/src/assets/logo.png" 
                alt="شعار المركز" 
                className="h-8 w-8 object-contain"
              />
              <div className="text-sm text-gray-600">
                <p>مركز تخطيط المرور وهندسة النقل للسلامة المرورية</p>
                <p>منطقة الباحة - المملكة العربية السعودية</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>آخر تحديث: {currentTime.toLocaleString('ar-SA')}</p>
              <p>الإصدار: 2.1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

