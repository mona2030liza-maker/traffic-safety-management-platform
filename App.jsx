import React, { useState, useEffect } from 'react';
import './App.css';

// استيراد المكونات
import Dashboard from './components/Dashboard';
import GISMap from './components/GISMap';
import HeatmapLayer from './components/HeatmapLayer';
import IRAPAnalysis from './components/IRAPAnalysis';
import TrafficMonitoring from './components/TrafficMonitoring';
import GoogleMapsIntegration from './components/GoogleMapsIntegration';
import CampaignManagement from './components/CampaignManagement';
import AdvancedFilters from './components/AdvancedFilters';
import BeforeAfterAnalysis from './components/BeforeAfterAnalysis';
import AIPrediction from './components/AIPrediction';

// استيراد البيانات
import { albahaRegionData } from './data/albahaData';
import { 
  developmentProjects, 
  eventsAndActivities, 
  reportsAndStudies,
  partnerships,
  humanResources,
  performanceStats,
  trainingPrograms,
  budgetData,
  aiExamples
} from './data/extendedData';

// قائمة الأقسام الرئيسية
const mainSections = [
  {
    id: 'dashboard',
    name: 'لوحة العرض العامة',
    icon: 'fa-tachometer-alt',
    description: 'نظرة شاملة على جميع المؤشرات والإحصائيات'
  },
  {
    id: 'gis-maps',
    name: 'خرائط GIS',
    icon: 'fa-map',
    description: 'خرائط جغرافية تفاعلية شاملة لمنطقة الباحة'
  },
  {
    id: 'heatmaps',
    name: 'الخرائط الحرارية',
    icon: 'fa-fire',
    description: 'خرائط حرارية مماثلة لنظام IRAP'
  },
  {
    id: 'irap-analysis',
    name: 'تحليل IRAP',
    icon: 'fa-chart-line',
    description: 'تحليل وتقييم مخاطر الطرق'
  },
  {
    id: 'traffic-monitoring',
    name: 'مراقبة المرور',
    icon: 'fa-video',
    description: 'مراقبة الحركة المرورية في الوقت الحقيقي'
  },
  {
    id: 'google-maps',
    name: 'خرائط جوجل التفاعلية',
    icon: 'fa-globe',
    description: 'دمج خرائط جوجل مع بيانات المرور'
  },
  {
    id: 'campaigns',
    name: 'إدارة الحملات',
    icon: 'fa-bullhorn',
    description: 'إدارة الحملات التوعوية والسلامة المرورية'
  },
  {
    id: 'before-after',
    name: 'التحليل قبل وبعد',
    icon: 'fa-exchange-alt',
    description: 'تحليل ومقارنة البيانات قبل وبعد التدخلات'
  },
  {
    id: 'ai-prediction',
    name: 'التنبؤ بالذكاء الاصطناعي',
    icon: 'fa-brain',
    description: 'استخدام الذكاء الاصطناعي للتنبؤ والتحليل'
  },
  {
    id: 'reports',
    name: 'التقارير والدراسات',
    icon: 'fa-file-alt',
    description: 'مكتبة شاملة للتقارير والدراسات'
  },
  {
    id: 'projects',
    name: 'المشاريع التطويرية',
    icon: 'fa-project-diagram',
    description: 'متابعة المشاريع التطويرية الجارية'
  },
  {
    id: 'partnerships',
    name: 'الشراكات والتعاون',
    icon: 'fa-handshake',
    description: 'إدارة الشراكات مع الجهات المختلفة'
  },
  {
    id: 'hr',
    name: 'الموارد البشرية',
    icon: 'fa-users',
    description: 'إدارة الموارد البشرية والتدريب'
  },
  {
    id: 'budget',
    name: 'الميزانية والمالية',
    icon: 'fa-chart-pie',
    description: 'متابعة الميزانية والمصروفات'
  },
  {
    id: 'settings',
    name: 'الإعدادات',
    icon: 'fa-cog',
    description: 'إعدادات النظام والتحكم'
  }
];

// مكون التطبيق الرئيسي
function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'تحذير مروري',
      message: 'ازدحام مروري في طريق الباحة - بلجرشي',
      time: '10:30 ص',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'تحديث النظام',
      message: 'تم تحديث بيانات الكاميرات المرورية',
      time: '09:15 ص',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'مشروع مكتمل',
      message: 'اكتمال مرحلة من مشروع تطوير الإضاءة',
      time: '08:45 ص',
      read: true
    }
  ]);

  // تحديث الوقت كل دقيقة
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // تصفية الأقسام بناءً على البحث
  const filteredSections = mainSections.filter(section =>
    section.name.includes(searchQuery) || section.description.includes(searchQuery)
  );

  // عرض المكون المناسب حسب القسم المحدد
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'gis-maps':
        return <GISMap />;
      case 'heatmaps':
        return <HeatmapLayer />;
      case 'irap-analysis':
        return <IRAPAnalysis />;
      case 'traffic-monitoring':
        return <TrafficMonitoring />;
      case 'google-maps':
        return <GoogleMapsIntegration />;
      case 'campaigns':
        return <CampaignManagement />;
      case 'before-after':
        return <BeforeAfterAnalysis />;
      case 'ai-prediction':
        return <AIPrediction />;
      case 'reports':
        return <ReportsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'partnerships':
        return <PartnershipsSection />;
      case 'hr':
        return <HRSection />;
      case 'budget':
        return <BudgetSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <Dashboard />;
    }
  };

  // مكون قسم التقارير
  const ReportsSection = () => (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">التقارير والدراسات</h1>
        <p className="text-gray-600 mb-6">مكتبة شاملة للتقارير والدراسات المتخصصة في مجال النقل والمرور</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportsAndStudies.map(report => (
            <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {report.type}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>المؤلف:</strong> {report.author}</p>
                <p><strong>تاريخ النشر:</strong> {report.publishDate}</p>
                <p><strong>عدد الصفحات:</strong> {report.pages}</p>
                <p><strong>مرات التحميل:</strong> {report.downloadCount}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-700">{report.summary}</p>
              </div>
              
              <div className="flex space-x-2 space-x-reverse">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">
                  <i className="fas fa-download ml-1"></i>
                  تحميل
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm">
                  <i className="fas fa-eye ml-1"></i>
                  معاينة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // مكون قسم المشاريع
  const ProjectsSection = () => (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">المشاريع التطويرية</h1>
        <p className="text-gray-600 mb-6">متابعة وإدارة المشاريع التطويرية الجارية في المنطقة</p>
        
        <div className="space-y-6">
          {developmentProjects.map(project => (
            <div key={project.id} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">الميزانية</p>
                  <p className="text-lg font-bold text-gray-900">
                    {(project.budget / 1000000).toFixed(1)} مليون ريال
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">نسبة الإنجاز</p>
                  <p className="text-lg font-bold text-green-600">{project.currentProgress}%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">المقاول</p>
                  <p className="text-sm font-medium text-gray-900">{project.contractor}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>التقدم العام</span>
                  <span>{project.currentProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.currentProgress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">الفوائد المتوقعة:</h4>
                  <ul className="space-y-1">
                    {project.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <i className="fas fa-check text-green-500 ml-2"></i>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">مراحل المشروع:</h4>
                  <div className="space-y-2">
                    {project.phases.map((phase, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{phase.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          phase.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                          phase.status === 'قيد التنفيذ' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {phase.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // مكون قسم الشراكات
  const PartnershipsSection = () => (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">الشراكات والتعاون</h1>
        <p className="text-gray-600 mb-6">إدارة الشراكات الاستراتيجية مع الجهات المختلفة</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnerships.map(partnership => (
            <div key={partnership.id} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{partnership.partner}</h3>
                  <p className="text-sm text-gray-600 mb-3">{partnership.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  partnership.type === 'أكاديمي' ? 'bg-blue-100 text-blue-800' :
                  partnership.type === 'تقني' ? 'bg-green-100 text-green-800' :
                  partnership.type === 'خدمي' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {partnership.type}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">تاريخ البداية</p>
                  <p className="font-medium">{partnership.startDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">المدة</p>
                  <p className="font-medium">{partnership.duration}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">المشاريع المشتركة:</h4>
                <ul className="space-y-1">
                  {partnership.projects.slice(0, 3).map((project, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <i className="fas fa-dot-circle text-blue-500 ml-2"></i>
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  partnership.status === 'نشط' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {partnership.status}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  عرض التفاصيل <i className="fas fa-arrow-left mr-1"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // مكون قسم الموارد البشرية
  const HRSection = () => (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">الموارد البشرية</h1>
        <p className="text-gray-600 mb-6">إدارة الموارد البشرية والتدريب والتطوير</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* الهيكل التنظيمي */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">الهيكل التنظيمي</h2>
            {humanResources.map((dept, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {dept.employees} موظف
                  </span>
                </div>
                <div className="space-y-2">
                  {dept.positions.map((pos, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{pos.title}</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-gray-600">{pos.count}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          pos.level === 'إدارة عليا' ? 'bg-red-100 text-red-800' :
                          pos.level === 'إدارة وسطى' ? 'bg-yellow-100 text-yellow-800' :
                          pos.level === 'تخصصي' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pos.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* برامج التدريب */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">برامج التدريب</h2>
            {trainingPrograms.map(program => (
              <div key={program.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-gray-600">المدة</p>
                    <p className="font-medium">{program.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">السعة</p>
                    <p className="font-medium">{program.capacity} متدرب</p>
                  </div>
                  <div>
                    <p className="text-gray-600">التكرار</p>
                    <p className="font-medium">{program.frequency}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">معدل الرضا</p>
                    <p className="font-medium text-green-600">{program.satisfactionRate}%</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-700">
                    <strong>إجمالي المتدربين:</strong> {program.totalParticipants} | 
                    <strong> الجلسات المكتملة:</strong> {program.completedSessions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // مكون قسم الميزانية
  const BudgetSection = () => (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">الميزانية والمالية</h1>
        <p className="text-gray-600 mb-6">متابعة الميزانية والمصروفات والمشاريع المالية</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ميزانية 2024 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">ميزانية 2024</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">إجمالي الميزانية</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(budgetData.annual[2024].total / 1000000).toFixed(0)} مليون ريال
                </p>
              </div>
              
              <div className="space-y-3">
                {Object.entries(budgetData.annual[2024].allocated).map(([category, amount]) => {
                  const spent = budgetData.annual[2024].spent[category];
                  const percentage = (spent / amount) * 100;
                  
                  const categoryNames = {
                    infrastructure: 'البنية التحتية',
                    technology: 'التقنية',
                    campaigns: 'الحملات',
                    maintenance: 'الصيانة',
                    training: 'التدريب',
                    operations: 'التشغيل'
                  };
                  
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{categoryNames[category]}</span>
                        <span className="text-gray-600">
                          {(spent / 1000000).toFixed(1)} / {(amount / 1000000).toFixed(1)} مليون
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 text-left">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* المشاريع المالية */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">المشاريع المالية</h2>
            <div className="space-y-3">
              {budgetData.projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className="text-sm text-gray-600">
                      {project.progress}%
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>المصروف</span>
                      <span>
                        {(project.spent / 1000000).toFixed(1)} / {(project.budget / 1000000).toFixed(1)} مليون
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.category === 'infrastructure' ? 'bg-blue-100 text-blue-800' :
                      project.category === 'technology' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.category === 'infrastructure' ? 'بنية تحتية' :
                       project.category === 'technology' ? 'تقنية' : 'حملات'}
                    </span>
                    <span className="text-sm text-gray-600">
                      متبقي: {((project.budget - project.spent) / 1000000).toFixed(1)} مليون
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // مكون قسم الإعدادات
  const SettingsSection = () => (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">إعدادات النظام</h1>
        <p className="text-gray-600 mb-6">إعدادات عامة للنظام والتحكم في الخصائص المختلفة</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* إعدادات الخرائط */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">إعدادات الخرائط</h2>
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الخريطة الافتراضي</label>
                <select className="w-full p-3 border rounded-md">
                  <option value="satellite">صور الأقمار الصناعية</option>
                  <option value="roadmap">خريطة الطرق</option>
                  <option value="hybrid">مختلط</option>
                  <option value="terrain">التضاريس</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مستوى التكبير الافتراضي</label>
                <input type="range" min="8" max="18" defaultValue="12" className="w-full" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">عرض طبقة الحركة المرورية</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">عرض الكاميرات المرورية</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">عرض النقاط السوداء</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* إعدادات التنبيهات */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">إعدادات التنبيهات</h2>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">تنبيهات الحوادث</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">تنبيهات الازدحام</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">تنبيهات الصيانة</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تكرار التحديث (بالدقائق)</label>
                <select className="w-full p-3 border rounded-md">
                  <option value="1">كل دقيقة</option>
                  <option value="5">كل 5 دقائق</option>
                  <option value="10">كل 10 دقائق</option>
                  <option value="30">كل 30 دقيقة</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* إعدادات قاعدة البيانات */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">إعدادات قاعدة البيانات</h2>
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع قاعدة البيانات</label>
                <select className="w-full p-3 border rounded-md">
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="oracle">Oracle</option>
                  <option value="sqlserver">SQL Server</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الخادم</label>
                <input type="text" defaultValue="localhost" className="w-full p-3 border rounded-md" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم المنفذ</label>
                <input type="number" defaultValue="3306" className="w-full p-3 border rounded-md" />
              </div>
              
              <div className="flex space-x-4 space-x-reverse">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  اختبار الاتصال
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </div>
          
          {/* إعدادات النسخ الاحتياطي */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">النسخ الاحتياطي</h2>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">النسخ الاحتياطي التلقائي</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تكرار النسخ الاحتياطي</label>
                <select className="w-full p-3 border rounded-md">
                  <option value="daily">يومي</option>
                  <option value="weekly">أسبوعي</option>
                  <option value="monthly">شهري</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مسار حفظ النسخ</label>
                <input type="text" defaultValue="/backup/traffic-system" className="w-full p-3 border rounded-md" />
              </div>
              
              <div className="flex space-x-4 space-x-reverse">
                <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md">
                  إنشاء نسخة احتياطية الآن
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">
                  استعادة من نسخة احتياطية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* شريط علوي */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          {/* شعار المركز والعنوان */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3 space-x-reverse">
              <img 
                src="/assets/شعاربعدالاخير.png" 
                alt="شعار المركز" 
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">مركز تخطيط المرور وهندسة النقل</h1>
                <p className="text-sm text-gray-600">للسلامة المرورية - منطقة الباحة</p>
              </div>
            </div>
          </div>

          {/* شريط البحث والإشعارات */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في النظام..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <i className="fas fa-bell text-gray-600"></i>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              <div>{currentTime.toLocaleDateString('ar-SA')}</div>
              <div>{currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* الشريط الجانبي */}
        <aside className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <div className="p-4">
            <nav className="space-y-2">
              {filteredSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-right transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`fas ${section.icon} ${sidebarCollapsed ? 'text-lg' : ''}`}></i>
                  {!sidebarCollapsed && (
                    <div className="flex-1">
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default App;
