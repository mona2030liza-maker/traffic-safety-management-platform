// بيانات موسعة وأمثلة تطبيقية إضافية
import { albahaRegionData, sampleAccidents, blackspots, cameras } from './albahaData';

// بيانات إضافية للحوادث المرورية
export const extendedAccidents = [
  ...sampleAccidents,
  {
    id: 11,
    date: '2024-01-16',
    time: '14:30',
    location: 'طريق المخواة - العقيق',
    coordinates: [19.7333, 41.3833],
    type: 'تصادم',
    severity: 'متوسط',
    casualties: 3,
    fatalities: 0,
    vehiclesInvolved: 2,
    weather: 'مشمس',
    roadCondition: 'جيدة',
    cause: 'عدم ترك مسافة آمنة',
    governorate: 'almakhwah',
    description: 'تصادم بين مركبتين على طريق المخواة - العقيق نتيجة عدم ترك مسافة آمنة'
  },
  {
    id: 12,
    date: '2024-01-17',
    time: '08:15',
    location: 'منحنى وادي الأحسبة',
    coordinates: [20.1500, 41.2000],
    type: 'انقلاب',
    severity: 'خطير',
    casualties: 2,
    fatalities: 1,
    vehiclesInvolved: 1,
    weather: 'ضبابي',
    roadCondition: 'رطبة',
    cause: 'السرعة الزائدة',
    governorate: 'albaha',
    description: 'انقلاب مركبة في منحنى وادي الأحسبة بسبب السرعة الزائدة والضباب'
  },
  {
    id: 13,
    date: '2024-01-18',
    time: '19:45',
    location: 'تقاطع طريق قلوة الرئيسي',
    coordinates: [19.6333, 41.6333],
    type: 'تصادم',
    severity: 'بسيط',
    casualties: 1,
    fatalities: 0,
    vehiclesInvolved: 2,
    weather: 'مشمس',
    roadCondition: 'جيدة',
    cause: 'عدم احترام الأولوية',
    governorate: 'qilwah',
    description: 'تصادم بسيط في تقاطع قلوة نتيجة عدم احترام أولوية المرور'
  },
  {
    id: 14,
    date: '2024-01-19',
    time: '22:30',
    location: 'طريق بني حسن الجبلي',
    coordinates: [19.8000, 41.5000],
    type: 'اصطدام بجسم ثابت',
    severity: 'خطير',
    casualties: 2,
    fatalities: 0,
    vehiclesInvolved: 1,
    weather: 'ضبابي',
    roadCondition: 'رطبة',
    cause: 'ضعف الإضاءة',
    governorate: 'bani_hassan',
    description: 'اصطدام مركبة بحاجز خرساني في الطريق الجبلي بسبب ضعف الإضاءة والضباب'
  },
  {
    id: 15,
    date: '2024-01-20',
    time: '16:20',
    location: 'تقاطع غامد الزناد المركزي',
    coordinates: [19.9500, 41.1500],
    type: 'تصادم',
    severity: 'متوسط',
    casualties: 4,
    fatalities: 0,
    vehiclesInvolved: 3,
    weather: 'مشمس',
    roadCondition: 'جيدة',
    cause: 'عدم احترام الإشارة',
    governorate: 'ghamd_alzanad',
    description: 'تصادم متعدد المركبات في تقاطع غامد الزناد نتيجة عدم احترام الإشارة المرورية'
  }
];

// بيانات موسعة للنقاط السوداء
export const extendedBlackspots = [
  ...blackspots,
  {
    id: 11,
    location: 'منحنى طريق بني حسن الجبلي',
    coordinates: [19.8000, 41.5000],
    riskScore: 8.2,
    accidentCount: 18,
    lastAccident: '2024-01-12',
    type: 'منحنى',
    severity: 'عالية',
    status: 'مؤكدة',
    governorate: 'bani_hassan',
    recommendations: [
      'تحسين الإضاءة',
      'إضافة عاكسات جانبية',
      'تقليل السرعة المسموحة',
      'تركيب حواجز أمان'
    ],
    factors: ['منحنى حاد', 'إضاءة ضعيفة', 'عدم وجود حواجز']
  },
  {
    id: 12,
    location: 'تقاطع طريق غامد الزناد',
    coordinates: [19.9500, 41.1500],
    riskScore: 7.8,
    accidentCount: 15,
    lastAccident: '2024-01-08',
    type: 'تقاطع',
    severity: 'عالية',
    status: 'قيد المراجعة',
    governorate: 'ghamd_alzanad',
    recommendations: [
      'تركيب إشارة ضوئية',
      'تحسين الرؤية',
      'إضافة لافتات تحذيرية',
      'تعديل هندسة التقاطع'
    ],
    factors: ['رؤية محدودة', 'عدم وجود إشارة', 'حركة مرور كثيفة']
  },
  {
    id: 13,
    location: 'منحنى طريق المخواة - قلوة',
    coordinates: [19.6800, 41.5000],
    riskScore: 7.5,
    accidentCount: 12,
    lastAccident: '2024-01-15',
    type: 'منحنى',
    severity: 'متوسطة',
    status: 'مؤكدة',
    governorate: 'almakhwah',
    recommendations: [
      'تحسين العلامات الأرضية',
      'إضافة مرايا محدبة',
      'تركيب حواجز معدنية',
      'تحسين تصريف المياه'
    ],
    factors: ['منحنى مفاجئ', 'تجمع مياه الأمطار', 'عدم وضوح العلامات']
  }
];

// بيانات الكاميرات المرورية الموسعة
export const extendedCameras = [
  ...cameras,
  {
    id: 11,
    location: 'طريق المخواة التجاري',
    coordinates: [19.7333, 41.3833],
    type: 'مراقبة سرعة',
    status: 'نشط',
    governorate: 'almakhwah',
    installDate: '2023-08-15',
    lastMaintenance: '2024-01-05',
    violationsDetected: 145,
    averageViolationsPerDay: 8
  },
  {
    id: 12,
    location: 'تقاطع بني حسن المركزي',
    coordinates: [19.8000, 41.5000],
    type: 'مراقبة عامة',
    status: 'نشط',
    governorate: 'bani_hassan',
    installDate: '2023-09-20',
    lastMaintenance: '2023-12-28',
    violationsDetected: 89,
    averageViolationsPerDay: 5
  },
  {
    id: 13,
    location: 'طريق غامد الزناد الرئيسي',
    coordinates: [19.9500, 41.1500],
    type: 'مراقبة سرعة',
    status: 'صيانة',
    governorate: 'ghamd_alzanad',
    installDate: '2023-07-10',
    lastMaintenance: '2024-01-18',
    violationsDetected: 203,
    averageViolationsPerDay: 12
  },
  {
    id: 14,
    location: 'مدخل مدينة الباحة الشمالي',
    coordinates: [20.0500, 41.4500],
    type: 'مراقبة شاملة',
    status: 'نشط',
    governorate: 'albaha',
    installDate: '2023-11-10',
    lastMaintenance: '2024-01-10',
    violationsDetected: 267,
    averageViolationsPerDay: 15
  },
  {
    id: 15,
    location: 'طريق العقيق السياحي',
    coordinates: [20.3500, 41.6500],
    type: 'مراقبة بيئية',
    status: 'نشط',
    governorate: 'aqiq',
    installDate: '2023-12-01',
    lastMaintenance: '2024-01-12',
    violationsDetected: 78,
    averageViolationsPerDay: 4
  }
];

// بيانات المشاريع التطويرية
export const developmentProjects = [
  {
    id: 1,
    title: 'مشروع تطوير طريق الباحة - بلجرشي السريع',
    description: 'مشروع شامل لتطوير وتوسيع الطريق السريع الرابط بين الباحة وبلجرشي',
    location: 'الباحة - بلجرشي',
    governorate: 'albaha',
    type: 'تطوير طرق',
    status: 'قيد التنفيذ',
    startDate: '2023-03-01',
    expectedEndDate: '2024-12-31',
    budget: 45000000,
    currentProgress: 65,
    contractor: 'شركة الطرق المتقدمة',
    benefits: [
      'تقليل وقت السفر بنسبة 30%',
      'تحسين السلامة المرورية',
      'زيادة السعة المرورية',
      'تقليل استهلاك الوقود'
    ],
    phases: [
      { name: 'التصميم والتخطيط', status: 'مكتمل', progress: 100 },
      { name: 'أعمال الحفر والتسوية', status: 'مكتمل', progress: 100 },
      { name: 'أعمال الأسفلت', status: 'قيد التنفيذ', progress: 70 },
      { name: 'أعمال الإشارات والعلامات', status: 'لم يبدأ', progress: 0 }
    ]
  },
  {
    id: 2,
    title: 'مشروع تحسين الإضاءة في الطرق الجبلية',
    description: 'مشروع تحسين الإضاءة وإضافة عاكسات في الطرق الجبلية الخطيرة',
    location: 'جميع المحافظات',
    governorate: 'all',
    type: 'تحسين إضاءة',
    status: 'قيد التنفيذ',
    startDate: '2023-09-01',
    expectedEndDate: '2024-06-30',
    budget: 8500000,
    currentProgress: 45,
    contractor: 'شركة الإضاءة الذكية',
    benefits: [
      'تقليل الحوادث الليلية بنسبة 50%',
      'تحسين الرؤية للسائقين',
      'زيادة الأمان في الطرق الجبلية',
      'توفير الطاقة باستخدام LED'
    ],
    phases: [
      { name: 'المسح الميداني', status: 'مكتمل', progress: 100 },
      { name: 'التوريد والتركيب', status: 'قيد التنفيذ', progress: 45 },
      { name: 'الاختبار والتشغيل', status: 'لم يبدأ', progress: 0 }
    ]
  },
  {
    id: 3,
    title: 'مشروع نظام إدارة المرور الذكي',
    description: 'تطوير نظام ذكي لإدارة المرور وتحسين تدفق المركبات',
    location: 'المدن الرئيسية',
    governorate: 'multiple',
    type: 'تقنية ذكية',
    status: 'مخطط',
    startDate: '2024-04-01',
    expectedEndDate: '2025-03-31',
    budget: 15000000,
    currentProgress: 10,
    contractor: 'شركة التقنيات الذكية',
    benefits: [
      'تقليل الازدحام بنسبة 25%',
      'تحسين كفاءة الوقود',
      'تقليل انبعاثات الكربون',
      'تحسين تجربة السائقين'
    ],
    phases: [
      { name: 'دراسة الجدوى', status: 'قيد التنفيذ', progress: 80 },
      { name: 'التصميم التفصيلي', status: 'لم يبدأ', progress: 0 },
      { name: 'التنفيذ والتركيب', status: 'لم يبدأ', progress: 0 },
      { name: 'التشغيل والصيانة', status: 'لم يبدأ', progress: 0 }
    ]
  },
  {
    id: 4,
    title: 'مشروع تطوير محطات الوقود الذكية',
    description: 'تطوير محطات وقود ذكية مع خدمات متكاملة للسائقين',
    location: 'الطرق الرئيسية',
    governorate: 'multiple',
    type: 'خدمات ذكية',
    status: 'مخطط',
    startDate: '2024-06-01',
    expectedEndDate: '2025-05-31',
    budget: 12000000,
    currentProgress: 5,
    contractor: 'شركة الخدمات المتكاملة',
    benefits: [
      'تحسين خدمات السائقين',
      'توفير خدمات طوارئ',
      'تقليل أوقات الانتظار',
      'خدمات رقمية متطورة'
    ],
    phases: [
      { name: 'اختيار المواقع', status: 'قيد التنفيذ', progress: 60 },
      { name: 'التصميم والتراخيص', status: 'لم يبدأ', progress: 0 },
      { name: 'الإنشاء والتجهيز', status: 'لم يبدأ', progress: 0 },
      { name: 'التشغيل والإدارة', status: 'لم يبدأ', progress: 0 }
    ]
  }
];

// بيانات الفعاليات والأنشطة
export const eventsAndActivities = [
  {
    id: 1,
    title: 'أسبوع السلامة المرورية',
    description: 'فعاليات توعوية شاملة حول السلامة المرورية لجميع فئات المجتمع',
    type: 'توعوية',
    startDate: '2024-02-10',
    endDate: '2024-02-17',
    location: 'جميع محافظات المنطقة',
    organizer: 'مركز تخطيط المرور',
    targetAudience: 'جميع الفئات',
    expectedParticipants: 5000,
    activities: [
      'معرض السلامة المرورية',
      'ورش تدريبية للسائقين',
      'برامج للأطفال في المدارس',
      'محاضرات توعوية',
      'مسابقات ثقافية'
    ],
    status: 'مخطط'
  },
  {
    id: 2,
    title: 'حملة فحص المركبات المجانية',
    description: 'حملة مجانية لفحص المركبات والتأكد من سلامتها',
    type: 'خدمية',
    startDate: '2024-01-25',
    endDate: '2024-01-27',
    location: 'مراكز الفحص في المنطقة',
    organizer: 'إدارة المرور',
    targetAudience: 'أصحاب المركبات',
    expectedParticipants: 1500,
    activities: [
      'فحص الفرامل والإطارات',
      'فحص الأضواء والإشارات',
      'فحص مستوى الزيوت',
      'نصائح الصيانة الوقائية'
    ],
    status: 'نشط'
  },
  {
    id: 3,
    title: 'مؤتمر تقنيات النقل الذكي',
    description: 'مؤتمر متخصص حول أحدث تقنيات النقل الذكي وتطبيقاتها',
    type: 'مؤتمر',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    location: 'مركز المؤتمرات - الباحة',
    organizer: 'مركز تخطيط المرور',
    targetAudience: 'المختصين والأكاديميين',
    expectedParticipants: 300,
    activities: [
      'جلسات علمية متخصصة',
      'عروض تقنية',
      'ورش عمل تطبيقية',
      'معرض التقنيات الحديثة'
    ],
    status: 'مخطط'
  },
  {
    id: 4,
    title: 'يوم المرور الخليجي',
    description: 'فعاليات خاصة بمناسبة يوم المرور الخليجي',
    type: 'مناسبة',
    startDate: '2024-03-04',
    endDate: '2024-03-04',
    location: 'الساحات العامة',
    organizer: 'مركز تخطيط المرور',
    targetAudience: 'المجتمع',
    expectedParticipants: 2000,
    activities: [
      'عروض توعوية',
      'توزيع مواد تثقيفية',
      'فعاليات للأطفال',
      'معرض للمركبات الآمنة'
    ],
    status: 'مخطط'
  }
];

// بيانات التقارير والدراسات
export const reportsAndStudies = [
  {
    id: 1,
    title: 'تقرير الحوادث المرورية السنوي 2023',
    description: 'تقرير شامل عن إحصائيات الحوادث المرورية في منطقة الباحة لعام 2023',
    type: 'تقرير سنوي',
    publishDate: '2024-01-15',
    author: 'قسم الإحصاء والتحليل',
    pages: 85,
    language: 'العربية',
    format: 'PDF',
    size: '12.5 MB',
    downloadCount: 245,
    summary: 'انخفاض في عدد الحوادث بنسبة 12% مقارنة بالعام السابق مع تحسن في مؤشرات السلامة',
    keyFindings: [
      'انخفاض الحوادث المميتة بنسبة 18%',
      'تحسن في أوقات الاستجابة للطوارئ',
      'زيادة في معدل استخدام أحزمة الأمان',
      'تأثير إيجابي للحملات التوعوية'
    ]
  },
  {
    id: 2,
    title: 'دراسة تحليل النقاط السوداء في الطرق الجبلية',
    description: 'دراسة تفصيلية لتحليل النقاط السوداء في الطرق الجبلية وتقديم الحلول',
    type: 'دراسة تحليلية',
    publishDate: '2023-11-20',
    author: 'فريق هندسة الطرق',
    pages: 156,
    language: 'العربية والإنجليزية',
    format: 'PDF',
    size: '28.3 MB',
    downloadCount: 189,
    summary: 'تحديد 25 نقطة سوداء في الطرق الجبلية مع تقديم حلول هندسية مبتكرة',
    keyFindings: [
      'تحديد العوامل الرئيسية للحوادث الجبلية',
      'تطوير نموذج تقييم المخاطر',
      'اقتراح حلول هندسية متدرجة',
      'خطة تنفيذ على مراحل زمنية'
    ]
  },
  {
    id: 3,
    title: 'دراسة جدوى نظام النقل العام الذكي',
    description: 'دراسة جدوى اقتصادية وتقنية لتطوير نظام نقل عام ذكي في المنطقة',
    type: 'دراسة جدوى',
    publishDate: '2023-09-10',
    author: 'قسم التخطيط الاستراتيجي',
    pages: 203,
    language: 'العربية',
    format: 'PDF',
    size: '35.7 MB',
    downloadCount: 156,
    summary: 'إمكانية تطوير نظام نقل عام ذكي بعائد استثماري إيجابي خلال 8 سنوات',
    keyFindings: [
      'توفير 40% من تكاليف النقل للمواطنين',
      'تقليل الازدحام المروري بنسبة 30%',
      'خلق 500 فرصة عمل مباشرة',
      'تقليل انبعاثات الكربون بنسبة 25%'
    ]
  },
  {
    id: 4,
    title: 'تقرير تقييم فعالية الحملات التوعوية',
    description: 'تقرير تحليلي لتقييم فعالية الحملات التوعوية المنفذة خلال العامين الماضيين',
    type: 'تقرير تقييم',
    publishDate: '2024-01-08',
    author: 'قسم التوعية والإعلام',
    pages: 67,
    language: 'العربية',
    format: 'PDF',
    size: '8.2 MB',
    downloadCount: 123,
    summary: 'تحسن ملحوظ في الوعي المروري بنسبة 35% نتيجة الحملات التوعوية المستهدفة',
    keyFindings: [
      'زيادة الوعي بقوانين المرور بنسبة 40%',
      'تحسن في سلوك السائقين الشباب',
      'فعالية وسائل التواصل الاجتماعي',
      'أهمية الشراكة مع المدارس'
    ]
  }
];

// بيانات الشراكات والتعاون
export const partnerships = [
  {
    id: 1,
    partner: 'جامعة الباحة',
    type: 'أكاديمي',
    startDate: '2023-01-15',
    duration: '3 سنوات',
    status: 'نشط',
    description: 'شراكة بحثية لتطوير حلول مبتكرة في مجال النقل والمرور',
    projects: [
      'بحث أنماط الحركة المرورية',
      'تطوير نماذج التنبؤ بالحوادث',
      'دراسة سلوك السائقين',
      'تقييم فعالية الحملات التوعوية'
    ],
    benefits: [
      'الاستفادة من الخبرات الأكاديمية',
      'تدريب الطلاب والباحثين',
      'تطوير حلول مبتكرة',
      'نشر البحوث العلمية'
    ]
  },
  {
    id: 2,
    partner: 'شركة التقنيات المتقدمة',
    type: 'تقني',
    startDate: '2023-06-01',
    duration: '2 سنة',
    status: 'نشط',
    description: 'شراكة تقنية لتطوير أنظمة المراقبة والتحكم المروري',
    projects: [
      'تطوير نظام إدارة الإشارات الذكية',
      'تركيب كاميرات مراقبة متطورة',
      'تطوير تطبيق المرور الذكي',
      'نظام التنبؤ بالازدحام'
    ],
    benefits: [
      'تحديث البنية التحتية التقنية',
      'تحسين كفاءة إدارة المرور',
      'توفير خدمات رقمية للمواطنين',
      'تقليل التكاليف التشغيلية'
    ]
  },
  {
    id: 3,
    partner: 'الهلال الأحمر السعودي',
    type: 'خدمي',
    startDate: '2022-09-01',
    duration: 'مستمر',
    status: 'نشط',
    description: 'تعاون في مجال الاستجابة للطوارئ والحوادث المرورية',
    projects: [
      'تحسين أوقات الاستجابة للحوادث',
      'تدريب فرق الطوارئ',
      'تطوير خطط الإخلاء',
      'تحسين التنسيق بين الجهات'
    ],
    benefits: [
      'تحسين خدمات الطوارئ',
      'تقليل وقت الوصول للحوادث',
      'تحسين معدلات الإنقاذ',
      'تعزيز التنسيق المؤسسي'
    ]
  },
  {
    id: 4,
    partner: 'وزارة التعليم',
    type: 'تعليمي',
    startDate: '2023-09-01',
    duration: '5 سنوات',
    status: 'نشط',
    description: 'شراكة تعليمية لتعزيز الوعي المروري في المدارس',
    projects: [
      'برامج التوعية المرورية للطلاب',
      'تدريب المعلمين',
      'تطوير المناهج التعليمية',
      'مسابقات السلامة المرورية'
    ],
    benefits: [
      'غرس ثقافة السلامة منذ الصغر',
      'تحسين سلوك الجيل الجديد',
      'تعزيز دور المدرسة في التوعية',
      'خلق جيل واعٍ مرورياً'
    ]
  }
];

// بيانات الموارد البشرية
export const humanResources = [
  {
    department: 'الإدارة العامة',
    employees: 12,
    positions: [
      { title: 'مدير عام', count: 1, level: 'إدارة عليا' },
      { title: 'نائب مدير عام', count: 1, level: 'إدارة عليا' },
      { title: 'مدير إداري', count: 2, level: 'إدارة وسطى' },
      { title: 'منسق مشاريع', count: 3, level: 'إدارة وسطى' },
      { title: 'سكرتير تنفيذي', count: 2, level: 'دعم إداري' },
      { title: 'موظف إداري', count: 3, level: 'دعم إداري' }
    ]
  },
  {
    department: 'الهندسة والتخطيط',
    employees: 18,
    positions: [
      { title: 'مدير الهندسة', count: 1, level: 'إدارة عليا' },
      { title: 'مهندس طرق أول', count: 3, level: 'تخصصي' },
      { title: 'مهندس مرور', count: 4, level: 'تخصصي' },
      { title: 'مخطط حضري', count: 2, level: 'تخصصي' },
      { title: 'مهندس تقني', count: 5, level: 'تخصصي' },
      { title: 'فني مساحة', count: 3, level: 'فني' }
    ]
  },
  {
    department: 'التقنية والمعلومات',
    employees: 15,
    positions: [
      { title: 'مدير التقنية', count: 1, level: 'إدارة عليا' },
      { title: 'محلل أنظمة أول', count: 2, level: 'تخصصي' },
      { title: 'مطور برمجيات', count: 4, level: 'تخصصي' },
      { title: 'مختص أمن معلومات', count: 2, level: 'تخصصي' },
      { title: 'مشغل أنظمة', count: 3, level: 'تقني' },
      { title: 'فني دعم تقني', count: 3, level: 'فني' }
    ]
  },
  {
    department: 'السلامة والمراقبة',
    employees: 22,
    positions: [
      { title: 'مدير السلامة', count: 1, level: 'إدارة عليا' },
      { title: 'مختص سلامة مرورية', count: 4, level: 'تخصصي' },
      { title: 'مراقب مروري', count: 8, level: 'تشغيلي' },
      { title: 'مفتش سلامة', count: 5, level: 'تشغيلي' },
      { title: 'مشغل غرفة تحكم', count: 4, level: 'تقني' }
    ]
  },
  {
    department: 'التوعية والإعلام',
    employees: 8,
    positions: [
      { title: 'مدير التوعية', count: 1, level: 'إدارة عليا' },
      { title: 'مختص إعلام', count: 2, level: 'تخصصي' },
      { title: 'منسق برامج توعوية', count: 2, level: 'تخصصي' },
      { title: 'مصمم جرافيك', count: 2, level: 'تقني' },
      { title: 'منسق فعاليات', count: 1, level: 'تنسيقي' }
    ]
  }
];

// إحصائيات الأداء الشاملة
export const performanceStats = {
  monthly: {
    accidents: [45, 38, 42, 35, 29, 33, 28, 31, 26, 24, 22, 25],
    violations: [1250, 1180, 1320, 1150, 980, 1050, 920, 1100, 850, 780, 720, 800],
    campaigns: [2, 3, 1, 4, 2, 3, 2, 1, 3, 2, 4, 2],
    satisfaction: [78, 79, 81, 83, 85, 87, 88, 89, 90, 91, 92, 93]
  },
  yearly: {
    2021: { accidents: 520, violations: 15600, campaigns: 28, satisfaction: 75 },
    2022: { accidents: 465, violations: 14200, campaigns: 32, satisfaction: 82 },
    2023: { accidents: 385, violations: 12800, campaigns: 29, satisfaction: 87 },
    2024: { accidents: 320, violations: 11200, campaigns: 35, satisfaction: 91 }
  },
  governorateComparison: {
    albaha: { accidents: 125, population: 95000, rate: 1.32 },
    baljurashi: { accidents: 89, population: 75000, rate: 1.19 },
    almandaq: { accidents: 67, population: 45000, rate: 1.49 },
    almakhwah: { accidents: 54, population: 38000, rate: 1.42 },
    qilwah: { accidents: 43, population: 32000, rate: 1.34 },
    aqiq: { accidents: 38, population: 28000, rate: 1.36 },
    bani_hassan: { accidents: 32, population: 25000, rate: 1.28 },
    ghamd_alzanad: { accidents: 28, population: 22000, rate: 1.27 }
  }
};

// بيانات التدريب والتطوير
export const trainingPrograms = [
  {
    id: 1,
    title: 'برنامج السلامة المرورية للسائقين المهنيين',
    description: 'برنامج تدريبي شامل للسائقين المهنيين حول قواعد السلامة المرورية',
    duration: '3 أيام',
    capacity: 30,
    frequency: 'شهري',
    completedSessions: 8,
    totalParticipants: 240,
    satisfactionRate: 94,
    topics: [
      'قوانين المرور والسلامة',
      'القيادة الدفاعية',
      'صيانة المركبات',
      'الإسعافات الأولية',
      'إدارة المخاطر'
    ]
  },
  {
    id: 2,
    title: 'ورشة تقنيات المراقبة المرورية',
    description: 'ورشة متخصصة للموظفين حول أحدث تقنيات المراقبة المرورية',
    duration: '5 أيام',
    capacity: 20,
    frequency: 'ربع سنوي',
    completedSessions: 3,
    totalParticipants: 60,
    satisfactionRate: 91,
    topics: [
      'أنظمة المراقبة الذكية',
      'تحليل البيانات المرورية',
      'تقنيات الذكاء الاصطناعي',
      'إدارة غرف التحكم',
      'صيانة الأنظمة'
    ]
  },
  {
    id: 3,
    title: 'دورة التخطيط الحضري والمروري',
    description: 'دورة تدريبية للمهندسين والمخططين في مجال التخطيط المروري',
    duration: '10 أيام',
    capacity: 15,
    frequency: 'نصف سنوي',
    completedSessions: 2,
    totalParticipants: 30,
    satisfactionRate: 96,
    topics: [
      'أسس التخطيط المروري',
      'تصميم التقاطعات',
      'نمذجة حركة المرور',
      'تقييم الأثر المروري',
      'التخطيط المستدام'
    ]
  },
  {
    id: 4,
    title: 'برنامج إدارة الأزمات والطوارئ المرورية',
    description: 'برنامج متخصص في إدارة الأزمات والطوارئ المرورية',
    duration: '4 أيام',
    capacity: 25,
    frequency: 'ربع سنوي',
    completedSessions: 2,
    totalParticipants: 50,
    satisfactionRate: 89,
    topics: [
      'إدارة الأزمات المرورية',
      'خطط الطوارئ',
      'التنسيق بين الجهات',
      'الاتصال في الأزمات',
      'التعافي السريع'
    ]
  }
];

// بيانات الميزانية والمالية
export const budgetData = {
  annual: {
    2024: {
      total: 85000000,
      allocated: {
        infrastructure: 35000000,
        technology: 20000000,
        campaigns: 8000000,
        maintenance: 12000000,
        training: 3000000,
        operations: 7000000
      },
      spent: {
        infrastructure: 22000000,
        technology: 15000000,
        campaigns: 5500000,
        maintenance: 8000000,
        training: 2000000,
        operations: 4500000
      }
    },
    2023: {
      total: 78000000,
      allocated: {
        infrastructure: 32000000,
        technology: 18000000,
        campaigns: 7000000,
        maintenance: 11000000,
        training: 2500000,
        operations: 7500000
      },
      spent: {
        infrastructure: 31500000,
        technology: 17200000,
        campaigns: 6800000,
        maintenance: 10500000,
        training: 2400000,
        operations: 7300000
      }
    }
  },
  projects: [
    {
      name: 'تطوير طريق الباحة - بلجرشي',
      budget: 45000000,
      spent: 29250000,
      progress: 65,
      category: 'infrastructure'
    },
    {
      name: 'نظام المراقبة الذكية',
      budget: 15000000,
      spent: 12000000,
      progress: 80,
      category: 'technology'
    },
    {
      name: 'حملات التوعية',
      budget: 8000000,
      spent: 5500000,
      progress: 69,
      category: 'campaigns'
    },
    {
      name: 'تحسين الإضاءة الجبلية',
      budget: 8500000,
      spent: 3825000,
      progress: 45,
      category: 'infrastructure'
    }
  ]
};

// أمثلة تطبيقية للذكاء الاصطناعي
export const aiExamples = [
  {
    id: 1,
    title: 'نظام التنبؤ بالحوادث المرورية',
    description: 'نظام ذكي يتنبأ بالحوادث المرورية بناءً على البيانات التاريخية والعوامل البيئية',
    accuracy: 87,
    implementation: 'مطبق',
    benefits: [
      'تقليل الحوادث بنسبة 23%',
      'تحسين توزيع الدوريات',
      'توفير 2.5 مليون ريال سنوياً',
      'تحسين أوقات الاستجابة'
    ],
    features: [
      'تحليل البيانات التاريخية',
      'مراقبة الطقس الحية',
      'تحليل أنماط المرور',
      'تنبيهات فورية للدوريات'
    ]
  },
  {
    id: 2,
    title: 'نظام إدارة الإشارات المرورية الذكية',
    description: 'نظام يدير الإشارات المرورية تلقائياً بناءً على كثافة المرور الحية',
    accuracy: 94,
    implementation: 'قيد التطوير',
    benefits: [
      'تقليل الازدحام بنسبة 35%',
      'توفير الوقود بنسبة 20%',
      'تحسين تدفق المرور',
      'تقليل الانبعاثات'
    ],
    features: [
      'كشف كثافة المرور الحية',
      'تحسين توقيت الإشارات',
      'التكيف مع الأحداث الخاصة',
      'تقارير الأداء التلقائية'
    ]
  },
  {
    id: 3,
    title: 'نظام كشف المخالفات المرورية بالذكاء الاصطناعي',
    description: 'نظام يستخدم الرؤية الحاسوبية لكشف المخالفات المرورية تلقائياً',
    accuracy: 92,
    implementation: 'مطبق جزئياً',
    benefits: [
      'كشف 95% من المخالفات',
      'تقليل التدخل البشري',
      'معالجة فورية للمخالفات',
      'تحسين الانضباط المروري'
    ],
    features: [
      'كشف تجاوز السرعة',
      'كشف التجاوز الخاطئ',
      'كشف عدم ربط الحزام',
      'كشف استخدام الهاتف أثناء القيادة'
    ]
  },
  {
    id: 4,
    title: 'نظام التنبؤ بصيانة الطرق',
    description: 'نظام يتنبأ بحاجة الطرق للصيانة قبل تدهور حالتها',
    accuracy: 89,
    implementation: 'مخطط',
    benefits: [
      'توفير 40% من تكاليف الصيانة',
      'تحسين حالة الطرق',
      'تقليل الحوادث الناتجة عن سوء الطرق',
      'تحسين تخطيط الميزانية'
    ],
    features: [
      'تحليل بيانات الاستشعار',
      'مراقبة حالة الأسفلت',
      'تقييم تأثير الطقس',
      'جدولة الصيانة الوقائية'
    ]
  }
];

// تصدير جميع البيانات
export {
  extendedAccidents as allAccidents,
  extendedBlackspots as allBlackspots,
  extendedCameras as allCameras
};

