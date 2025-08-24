import React, { useState, useEffect } from 'react';
import { albahaRegionData } from '../data/albahaData';

// بيانات وهمية للحملات
const sampleCampaigns = [
  {
    id: 1,
    title: 'حملة السلامة المرورية الشاملة',
    description: 'حملة توعوية شاملة لتعزيز السلامة المرورية في جميع محافظات منطقة الباحة',
    type: 'توعوية',
    status: 'نشطة',
    priority: 'عالية',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    budget: 500000,
    targetAudience: 'جميع الفئات',
    governorates: ['albaha', 'baljurashi', 'almandaq'],
    activities: [
      'ورش توعوية في المدارس',
      'حملات إعلامية',
      'توزيع مواد تثقيفية',
      'فعاليات مجتمعية'
    ],
    kpis: {
      reach: 25000,
      engagement: 15000,
      accidents_reduction: 15
    },
    manager: 'أحمد محمد السلمي',
    team: ['فاطمة أحمد', 'محمد علي', 'سارة خالد'],
    createdAt: '2023-12-15',
    updatedAt: '2024-01-10'
  },
  {
    id: 2,
    title: 'حملة مراقبة السرعة',
    description: 'حملة مكثفة لمراقبة السرعة والحد من المخالفات المرورية',
    type: 'تنفيذية',
    status: 'مجدولة',
    priority: 'متوسطة',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    budget: 300000,
    targetAudience: 'السائقين',
    governorates: ['albaha', 'baljurashi'],
    activities: [
      'نشر كاميرات مراقبة متنقلة',
      'دوريات مرورية مكثفة',
      'حملات توعوية',
      'تطبيق غرامات فورية'
    ],
    kpis: {
      violations_detected: 5000,
      speed_compliance: 80,
      accidents_reduction: 25
    },
    manager: 'خالد عبدالله الغامدي',
    team: ['عبدالرحمن محمد', 'نورا سعد', 'يوسف أحمد'],
    createdAt: '2023-12-20',
    updatedAt: '2024-01-05'
  },
  {
    id: 3,
    title: 'حملة سلامة المشاة',
    description: 'حملة متخصصة لحماية المشاة وتحسين البنية التحتية للمشي',
    type: 'بنية تحتية',
    status: 'مكتملة',
    priority: 'عالية',
    startDate: '2023-09-01',
    endDate: '2023-12-31',
    budget: 750000,
    targetAudience: 'المشاة والسائقين',
    governorates: ['albaha', 'almakhwah', 'qilwah'],
    activities: [
      'إنشاء ممرات مشاة آمنة',
      'تركيب إشارات ضوئية',
      'حملات توعوية للمشاة',
      'تحسين الإضاءة'
    ],
    kpis: {
      pedestrian_crossings: 25,
      accidents_reduction: 40,
      satisfaction_rate: 85
    },
    manager: 'مريم سالم الزهراني',
    team: ['أحمد فهد', 'ليلى محمد', 'عبدالعزيز سعد'],
    createdAt: '2023-08-15',
    updatedAt: '2024-01-02'
  },
  {
    id: 4,
    title: 'حملة السلامة في المدارس',
    description: 'برنامج شامل لتعزيز السلامة المرورية حول المدارس',
    type: 'تعليمية',
    status: 'نشطة',
    priority: 'عالية',
    startDate: '2024-01-15',
    endDate: '2024-05-30',
    budget: 400000,
    targetAudience: 'الطلاب وأولياء الأمور',
    governorates: ['albaha', 'baljurashi', 'aqiq'],
    activities: [
      'برامج تعليمية للطلاب',
      'تدريب المعلمين',
      'تحسين المناطق المدرسية',
      'حملات توعوية لأولياء الأمور'
    ],
    kpis: {
      students_trained: 8000,
      teachers_trained: 200,
      school_zones_improved: 15
    },
    manager: 'عبدالله محمد العسيري',
    team: ['هند علي', 'محمد سعد', 'فاطمة خالد'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12'
  },
  {
    id: 5,
    title: 'حملة السلامة في الطرق الجبلية',
    description: 'حملة متخصصة لتحسين السلامة في الطرق الجبلية الخطيرة',
    type: 'متخصصة',
    status: 'قيد التخطيط',
    priority: 'عالية',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    budget: 600000,
    targetAudience: 'سائقي الطرق الجبلية',
    governorates: ['aqiq', 'bani_hassan', 'ghamd_alzanad'],
    activities: [
      'تحسين اللافتات التحذيرية',
      'إنشاء مناطق استراحة',
      'تدريب السائقين',
      'تطوير خطط الطوارئ'
    ],
    kpis: {
      warning_signs: 50,
      rest_areas: 8,
      drivers_trained: 1500
    },
    manager: 'سعد محمد الشهري',
    team: ['عبدالرحمن أحمد', 'نوال سعد', 'فهد عبدالله'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15'
  }
];

// مكون إدارة الحملات
const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState(sampleCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState(sampleCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    priority: '',
    governorate: '',
    dateRange: 'all',
    manager: ''
  });

  // تطبيق الفلاتر
  useEffect(() => {
    let filtered = campaigns;

    // فلتر البحث النصي
    if (filters.search) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        campaign.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        campaign.manager.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // فلتر النوع
    if (filters.type) {
      filtered = filtered.filter(campaign => campaign.type === filters.type);
    }

    // فلتر الحالة
    if (filters.status) {
      filtered = filtered.filter(campaign => campaign.status === filters.status);
    }

    // فلتر الأولوية
    if (filters.priority) {
      filtered = filtered.filter(campaign => campaign.priority === filters.priority);
    }

    // فلتر المحافظة
    if (filters.governorate) {
      filtered = filtered.filter(campaign => 
        campaign.governorates.includes(filters.governorate)
      );
    }

    // فلتر المدير
    if (filters.manager) {
      filtered = filtered.filter(campaign =>
        campaign.manager.toLowerCase().includes(filters.manager.toLowerCase())
      );
    }

    // فلتر الفترة الزمنية
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'last_month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'last_3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'last_6months':
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case 'last_year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(campaign => 
        new Date(campaign.createdAt) >= filterDate
      );
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, filters]);

  // تحديث الفلاتر
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      priority: '',
      governorate: '',
      dateRange: 'all',
      manager: ''
    });
  };

  // حذف حملة
  const deleteCampaign = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الحملة؟')) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      if (selectedCampaign && selectedCampaign.id === id) {
        setSelectedCampaign(null);
      }
    }
  };

  // تحديث حالة الحملة
  const updateCampaignStatus = (id, newStatus) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === id 
        ? { ...campaign, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : campaign
    ));
  };

  // الحصول على لون الحالة
  const getStatusColor = (status) => {
    switch (status) {
      case 'نشطة': return 'bg-green-100 text-green-800';
      case 'مجدولة': return 'bg-blue-100 text-blue-800';
      case 'مكتملة': return 'bg-gray-100 text-gray-800';
      case 'قيد التخطيط': return 'bg-yellow-100 text-yellow-800';
      case 'متوقفة': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'عالية': return 'bg-red-100 text-red-800';
      case 'متوسطة': return 'bg-yellow-100 text-yellow-800';
      case 'منخفضة': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">إدارة الحملات</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            <i className="fas fa-plus ml-2"></i>
            إنشاء حملة جديدة
          </button>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">الحملات النشطة</p>
            <p className="text-2xl font-bold text-green-600">
              {campaigns.filter(c => c.status === 'نشطة').length}
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">الحملات المجدولة</p>
            <p className="text-2xl font-bold text-blue-600">
              {campaigns.filter(c => c.status === 'مجدولة').length}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">الحملات المكتملة</p>
            <p className="text-2xl font-bold text-gray-600">
              {campaigns.filter(c => c.status === 'مكتملة').length}
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">إجمالي الميزانية</p>
            <p className="text-2xl font-bold text-yellow-600">
              {(campaigns.reduce((sum, c) => sum + c.budget, 0) / 1000000).toFixed(1)} م.ر
            </p>
          </div>
        </div>
      </div>

      {/* فلاتر البحث */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">فلاتر البحث</h2>
          <button
            onClick={resetFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <i className="fas fa-undo ml-1"></i>
            إعادة تعيين
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البحث</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="ابحث في العنوان أو الوصف أو المدير..."
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع الحملة</label>
            <select
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">جميع الأنواع</option>
              <option value="توعوية">توعوية</option>
              <option value="تنفيذية">تنفيذية</option>
              <option value="بنية تحتية">بنية تحتية</option>
              <option value="تعليمية">تعليمية</option>
              <option value="متخصصة">متخصصة</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="نشطة">نشطة</option>
              <option value="مجدولة">مجدولة</option>
              <option value="مكتملة">مكتملة</option>
              <option value="قيد التخطيط">قيد التخطيط</option>
              <option value="متوقفة">متوقفة</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
            <select
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">جميع الأولويات</option>
              <option value="عالية">عالية</option>
              <option value="متوسطة">متوسطة</option>
              <option value="منخفضة">منخفضة</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
            <select
              value={filters.governorate}
              onChange={(e) => updateFilter('governorate', e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">جميع المحافظات</option>
              {albahaRegionData.governorates.map(gov => (
                <option key={gov.id} value={gov.id}>{gov.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الفترة الزمنية</label>
            <select
              value={filters.dateRange}
              onChange={(e) => updateFilter('dateRange', e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="all">جميع الفترات</option>
              <option value="last_month">الشهر الماضي</option>
              <option value="last_3months">آخر 3 أشهر</option>
              <option value="last_6months">آخر 6 أشهر</option>
              <option value="last_year">السنة الماضية</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المدير</label>
            <input
              type="text"
              value={filters.manager}
              onChange={(e) => updateFilter('manager', e.target.value)}
              placeholder="ابحث عن المدير..."
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <p>عدد النتائج: <span className="font-bold">{filteredCampaigns.length}</span></p>
              <p>من أصل: <span className="font-bold">{campaigns.length}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الحملات */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">قائمة الحملات</h2>
        
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">لا توجد حملات تطابق معايير البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">العنوان</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">النوع</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الأولوية</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">المدير</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الميزانية</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">تاريخ البداية</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr 
                    key={campaign.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedCampaign?.id === campaign.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{campaign.title}</td>
                    <td className="px-4 py-3 text-sm">{campaign.type}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(campaign.priority)}`}>
                        {campaign.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{campaign.manager}</td>
                    <td className="px-4 py-3 text-sm">{campaign.budget.toLocaleString()} ر.س</td>
                    <td className="px-4 py-3 text-sm">{campaign.startDate}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCampaign(campaign);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="عرض التفاصيل"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // فتح نموذج التعديل
                          }}
                          className="text-green-600 hover:text-green-800"
                          title="تعديل"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCampaign(campaign.id);
                          }}
                          className="text-red-600 hover:text-red-800"
                          title="حذف"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* تفاصيل الحملة المحددة */}
      {selectedCampaign && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">تفاصيل الحملة</h2>
            <button
              onClick={() => setSelectedCampaign(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">{selectedCampaign.title}</h3>
              <p className="text-gray-600 mb-4">{selectedCampaign.description}</p>
              
              <div className="space-y-2 text-sm">
                <p><strong>النوع:</strong> {selectedCampaign.type}</p>
                <p><strong>الحالة:</strong> 
                  <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(selectedCampaign.status)}`}>
                    {selectedCampaign.status}
                  </span>
                </p>
                <p><strong>الأولوية:</strong> 
                  <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor(selectedCampaign.priority)}`}>
                    {selectedCampaign.priority}
                  </span>
                </p>
                <p><strong>الفئة المستهدفة:</strong> {selectedCampaign.targetAudience}</p>
                <p><strong>تاريخ البداية:</strong> {selectedCampaign.startDate}</p>
                <p><strong>تاريخ النهاية:</strong> {selectedCampaign.endDate}</p>
                <p><strong>الميزانية:</strong> {selectedCampaign.budget.toLocaleString()} ر.س</p>
                <p><strong>المدير:</strong> {selectedCampaign.manager}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">المحافظات المشمولة:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCampaign.governorates.map(govId => {
                  const gov = albahaRegionData.governorates.find(g => g.id === govId);
                  return (
                    <span key={govId} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {gov?.name || govId}
                    </span>
                  );
                })}
              </div>

              <h4 className="font-semibold text-gray-700 mb-2">الأنشطة:</h4>
              <ul className="space-y-1 text-sm mb-4">
                {selectedCampaign.activities.map((activity, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 ml-2"></i>
                    {activity}
                  </li>
                ))}
              </ul>

              <h4 className="font-semibold text-gray-700 mb-2">فريق العمل:</h4>
              <div className="space-y-1 text-sm">
                {selectedCampaign.team.map((member, index) => (
                  <p key={index} className="flex items-center">
                    <i className="fas fa-user text-gray-500 ml-2"></i>
                    {member}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* مؤشرات الأداء */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">مؤشرات الأداء الرئيسية:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(selectedCampaign.kpis).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                    {key.includes('reduction') || key.includes('compliance') || key.includes('rate') ? '%' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* إجراءات سريعة */}
          <div className="mt-6 flex space-x-4 space-x-reverse">
            <select
              onChange={(e) => updateCampaignStatus(selectedCampaign.id, e.target.value)}
              value={selectedCampaign.status}
              className="p-2 border rounded-md text-sm"
            >
              <option value="قيد التخطيط">قيد التخطيط</option>
              <option value="مجدولة">مجدولة</option>
              <option value="نشطة">نشطة</option>
              <option value="متوقفة">متوقفة</option>
              <option value="مكتملة">مكتملة</option>
            </select>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              <i className="fas fa-edit ml-1"></i>
              تعديل الحملة
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
              <i className="fas fa-download ml-1"></i>
              تصدير التقرير
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagement;

