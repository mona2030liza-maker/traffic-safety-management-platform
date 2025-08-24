import React, { useState, useEffect } from 'react';
import { albahaRegionData, sampleAccidents, blackspots } from '../data/albahaData';

// مكون تحليل IRAP للطرق
const IRAPAnalysis = ({ selectedRoad = null, onAnalysisComplete }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);

  // تحليل IRAP للطريق المحدد
  const performIRAPAnalysis = (roadData) => {
    setLoading(true);
    
    // محاكاة تحليل IRAP
    setTimeout(() => {
      const analysis = {
        roadId: roadData.id || 'road_001',
        roadName: roadData.name || 'طريق غير محدد',
        totalLength: roadData.length || 25.5, // كيلومتر
        segments: generateRoadSegments(roadData),
        overallRating: calculateOverallRating(roadData),
        riskFactors: identifyRiskFactors(roadData),
        recommendations: generateRecommendations(roadData),
        costBenefitAnalysis: calculateCostBenefit(roadData),
        timeline: generateImplementationTimeline()
      };
      
      setAnalysisData(analysis);
      setLoading(false);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
    }, 2000);
  };

  // إنشاء قطاعات الطريق للتحليل
  const generateRoadSegments = (roadData) => {
    const segments = [];
    const segmentLength = 1; // كيلومتر واحد لكل قطاع
    const totalSegments = Math.ceil((roadData.length || 25) / segmentLength);

    for (let i = 0; i < totalSegments; i++) {
      const startKm = i * segmentLength;
      const endKm = Math.min((i + 1) * segmentLength, roadData.length || 25);
      
      // حساب تقييم النجوم لكل قطاع (1-5 نجوم)
      const starRating = calculateSegmentStarRating(startKm, endKm, roadData);
      
      // تحديد عوامل الخطر في هذا القطاع
      const riskFactors = identifySegmentRiskFactors(startKm, endKm);
      
      // حساب معدل الحوادث المتوقع
      const crashRate = calculateCrashRate(startKm, endKm, roadData);
      
      segments.push({
        id: `segment_${i + 1}`,
        startKm,
        endKm,
        length: endKm - startKm,
        starRating,
        riskLevel: starRating <= 2 ? 'عالي' : starRating <= 3 ? 'متوسط' : 'منخفض',
        crashRate,
        riskFactors,
        priority: starRating <= 2 ? 'عاجل' : starRating <= 3 ? 'متوسط' : 'منخفض',
        estimatedCost: calculateSegmentCost(starRating, endKm - startKm),
        potentialSavings: calculatePotentialSavings(crashRate, endKm - startKm)
      });
    }

    return segments;
  };

  // حساب تقييم النجوم للقطاع
  const calculateSegmentStarRating = (startKm, endKm, roadData) => {
    // عوامل التقييم (محاكاة)
    const factors = {
      roadWidth: Math.random() > 0.3 ? 4 : 2, // عرض الطريق
      shoulderWidth: Math.random() > 0.4 ? 3 : 1, // عرض الكتف
      medianBarrier: Math.random() > 0.6 ? 5 : 1, // الحاجز الوسطي
      intersectionDesign: Math.random() > 0.5 ? 4 : 2, // تصميم التقاطعات
      speedLimit: Math.random() > 0.7 ? 4 : 3, // حد السرعة
      lighting: Math.random() > 0.5 ? 3 : 1, // الإضاءة
      signage: Math.random() > 0.6 ? 4 : 2, // اللافتات
      roadCondition: Math.random() > 0.4 ? 4 : 2 // حالة الطريق
    };

    // حساب المتوسط المرجح
    const weightedScore = (
      factors.roadWidth * 0.2 +
      factors.shoulderWidth * 0.15 +
      factors.medianBarrier * 0.2 +
      factors.intersectionDesign * 0.15 +
      factors.speedLimit * 0.1 +
      factors.lighting * 0.1 +
      factors.signage * 0.05 +
      factors.roadCondition * 0.05
    );

    return Math.round(Math.max(1, Math.min(5, weightedScore)));
  };

  // تحديد عوامل الخطر في القطاع
  const identifySegmentRiskFactors = (startKm, endKm) => {
    const possibleRisks = [
      'عدم وجود حاجز وسطي',
      'عرض كتف غير كافي',
      'تقاطعات خطيرة',
      'إضاءة ضعيفة',
      'منحنيات حادة',
      'انحدار شديد',
      'عدم وضوح اللافتات',
      'سطح طريق متدهور',
      'عدم وجود ممرات مشاة',
      'سرعة عالية غير مناسبة'
    ];

    // اختيار عوامل خطر عشوائية (محاكاة)
    const numRisks = Math.floor(Math.random() * 4) + 1;
    const selectedRisks = [];
    
    for (let i = 0; i < numRisks; i++) {
      const risk = possibleRisks[Math.floor(Math.random() * possibleRisks.length)];
      if (!selectedRisks.includes(risk)) {
        selectedRisks.push(risk);
      }
    }

    return selectedRisks;
  };

  // حساب معدل الحوادث
  const calculateCrashRate = (startKm, endKm, roadData) => {
    // محاكاة معدل الحوادث بناءً على البيانات التاريخية
    const baseRate = 2.5; // حوادث لكل كيلومتر سنوياً
    const variation = (Math.random() - 0.5) * 2; // تباين ±1
    return Math.max(0.1, baseRate + variation);
  };

  // حساب التكلفة المقدرة للتحسينات
  const calculateSegmentCost = (starRating, length) => {
    const costPerKm = {
      1: 2000000, // 2 مليون ريال لكل كم للطرق سيئة جداً
      2: 1500000, // 1.5 مليون ريال
      3: 1000000, // 1 مليون ريال
      4: 500000,  // 500 ألف ريال
      5: 100000   // 100 ألف ريال للصيانة البسيطة
    };

    return (costPerKm[starRating] || 1000000) * length;
  };

  // حساب الوفورات المحتملة
  const calculatePotentialSavings = (crashRate, length) => {
    const costPerCrash = 500000; // 500 ألف ريال متوسط تكلفة الحادث
    const reductionRate = 0.4; // 40% تقليل في الحوادث بعد التحسين
    const annualCrashes = crashRate * length;
    return annualCrashes * reductionRate * costPerCrash;
  };

  // حساب التقييم العام للطريق
  const calculateOverallRating = (roadData) => {
    // محاكاة التقييم العام
    const ratings = [1, 2, 2, 3, 3, 3, 4, 4, 5];
    const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
    
    return {
      stars: randomRating,
      score: randomRating * 20, // تحويل إلى نسبة مئوية
      category: randomRating <= 2 ? 'عالي الخطورة' : 
                randomRating <= 3 ? 'متوسط الخطورة' : 'منخفض الخطورة',
      color: randomRating <= 2 ? '#ef4444' : 
             randomRating <= 3 ? '#f59e0b' : '#10b981'
    };
  };

  // تحديد عوامل الخطر الرئيسية
  const identifyRiskFactors = (roadData) => {
    return [
      {
        factor: 'التقاطعات الخطيرة',
        severity: 'عالي',
        locations: ['الكيلو 5.2', 'الكيلو 12.8', 'الكيلو 18.5'],
        impact: 'زيادة احتمالية الحوادث بنسبة 65%'
      },
      {
        factor: 'عدم وجود حاجز وسطي',
        severity: 'عالي',
        locations: ['الكيلو 8.0 - 15.0'],
        impact: 'زيادة خطر الحوادث الجانبية بنسبة 45%'
      },
      {
        factor: 'إضاءة غير كافية',
        severity: 'متوسط',
        locations: ['الكيلو 3.0 - 7.0', 'الكيلو 20.0 - 25.0'],
        impact: 'زيادة الحوادث الليلية بنسبة 30%'
      },
      {
        factor: 'عرض كتف غير مناسب',
        severity: 'متوسط',
        locations: ['معظم أجزاء الطريق'],
        impact: 'صعوبة في التعامل مع الطوارئ'
      }
    ];
  };

  // إنشاء التوصيات
  const generateRecommendations = (roadData) => {
    return [
      {
        id: 1,
        priority: 'عاجل',
        title: 'تحسين التقاطعات الخطيرة',
        description: 'إعادة تصميم التقاطعات في الكيلو 5.2 و 12.8 و 18.5 مع إضافة إشارات مرورية ذكية',
        estimatedCost: 3500000,
        timeframe: '6-12 شهر',
        expectedReduction: '60% تقليل في حوادث التقاطعات',
        category: 'هندسة مرورية'
      },
      {
        id: 2,
        priority: 'عاجل',
        title: 'إنشاء حاجز وسطي',
        description: 'تركيب حاجز وسطي خرساني من الكيلو 8.0 إلى 15.0',
        estimatedCost: 2800000,
        timeframe: '4-8 أشهر',
        expectedReduction: '45% تقليل في الحوادث الجانبية',
        category: 'سلامة طرق'
      },
      {
        id: 3,
        priority: 'متوسط',
        title: 'تحسين الإضاءة',
        description: 'تركيب إضاءة LED حديثة في المناطق المظلمة',
        estimatedCost: 1200000,
        timeframe: '3-6 أشهر',
        expectedReduction: '30% تقليل في الحوادث الليلية',
        category: 'إضاءة'
      },
      {
        id: 4,
        priority: 'متوسط',
        title: 'توسيع الأكتاف',
        description: 'توسيع أكتاف الطريق إلى 2.5 متر كحد أدنى',
        estimatedCost: 4500000,
        timeframe: '8-12 شهر',
        expectedReduction: '20% تحسن في السلامة العامة',
        category: 'تطوير بنية تحتية'
      },
      {
        id: 5,
        priority: 'منخفض',
        title: 'تحديث اللافتات',
        description: 'استبدال وإضافة لافتات إرشادية وتحذيرية حديثة',
        estimatedCost: 800000,
        timeframe: '2-4 أشهر',
        expectedReduction: '15% تحسن في وضوح المعلومات',
        category: 'لافتات وإرشادات'
      }
    ];
  };

  // حساب تحليل التكلفة والفائدة
  const calculateCostBenefit = (roadData) => {
    const totalInvestment = 12800000; // إجمالي التكلفة المقدرة
    const annualSavings = 3200000; // الوفورات السنوية المتوقعة
    const paybackPeriod = totalInvestment / annualSavings;
    
    return {
      totalInvestment,
      annualSavings,
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      roi: Math.round((annualSavings / totalInvestment) * 100),
      netPresentValue: calculateNPV(totalInvestment, annualSavings, 10, 0.05),
      benefitCostRatio: Math.round((annualSavings * 10 / totalInvestment) * 100) / 100
    };
  };

  // حساب صافي القيمة الحالية
  const calculateNPV = (investment, annualSavings, years, discountRate) => {
    let npv = -investment;
    for (let year = 1; year <= years; year++) {
      npv += annualSavings / Math.pow(1 + discountRate, year);
    }
    return Math.round(npv);
  };

  // إنشاء جدول زمني للتنفيذ
  const generateImplementationTimeline = () => {
    return [
      {
        phase: 'المرحلة الأولى - التحسينات العاجلة',
        duration: '6-12 شهر',
        tasks: [
          'تحسين التقاطعات الخطيرة',
          'إنشاء حاجز وسطي',
          'تحسين الإضاءة في المناطق الحرجة'
        ],
        cost: 7500000,
        expectedImpact: '50% تقليل في الحوادث الخطيرة'
      },
      {
        phase: 'المرحلة الثانية - التطوير الشامل',
        duration: '8-15 شهر',
        tasks: [
          'توسيع الأكتاف',
          'تحديث اللافتات',
          'تحسين تصريف المياه'
        ],
        cost: 5300000,
        expectedImpact: '30% تحسن إضافي في السلامة'
      },
      {
        phase: 'المرحلة الثالثة - المراقبة والتقييم',
        duration: '12 شهر',
        tasks: [
          'تركيب أنظمة مراقبة ذكية',
          'تقييم فعالية التحسينات',
          'تعديلات إضافية حسب الحاجة'
        ],
        cost: 2000000,
        expectedImpact: 'ضمان استدامة التحسينات'
      }
    ];
  };

  // تشغيل التحليل عند تحديد طريق
  useEffect(() => {
    if (selectedRoad) {
      performIRAPAnalysis(selectedRoad);
    }
  }, [selectedRoad]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحليل الطريق باستخدام معايير IRAP...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-road text-4xl text-gray-400 mb-4"></i>
        <p className="text-gray-600">اختر طريقاً لبدء تحليل IRAP</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* ملخص التحليل */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{analysisData.roadName}</h2>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-gray-600">تقييم IRAP:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <i
                  key={star}
                  className={`fas fa-star ${
                    star <= analysisData.overallRating.stars ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                ></i>
              ))}
            </div>
            <span 
              className="px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: analysisData.overallRating.color }}
            >
              {analysisData.overallRating.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">الطول الإجمالي</p>
            <p className="text-2xl font-bold text-blue-600">{analysisData.totalLength} كم</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">عدد القطاعات</p>
            <p className="text-2xl font-bold text-green-600">{analysisData.segments.length}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">القطاعات عالية الخطورة</p>
            <p className="text-2xl font-bold text-red-600">
              {analysisData.segments.filter(s => s.starRating <= 2).length}
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">التكلفة المقدرة</p>
            <p className="text-2xl font-bold text-yellow-600">
              {(analysisData.costBenefitAnalysis.totalInvestment / 1000000).toFixed(1)} م.ر
            </p>
          </div>
        </div>
      </div>

      {/* تحليل القطاعات */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تحليل قطاعات الطريق</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">القطاع</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">المسافة (كم)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">تقييم النجوم</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">مستوى الخطر</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">معدل الحوادث</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الأولوية</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">التكلفة المقدرة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analysisData.segments.map((segment, index) => (
                <tr 
                  key={segment.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedSegment?.id === segment.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedSegment(segment)}
                >
                  <td className="px-4 py-3 text-sm">
                    {segment.startKm.toFixed(1)} - {segment.endKm.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-sm">{segment.length.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <i
                          key={star}
                          className={`fas fa-star text-xs ${
                            star <= segment.starRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      segment.riskLevel === 'عالي' ? 'bg-red-100 text-red-800' :
                      segment.riskLevel === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {segment.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{segment.crashRate.toFixed(1)}/سنة</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      segment.priority === 'عاجل' ? 'bg-red-100 text-red-800' :
                      segment.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {segment.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {(segment.estimatedCost / 1000).toLocaleString()} ألف ر.س
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* تفاصيل القطاع المحدد */}
      {selectedSegment && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            تفاصيل القطاع {selectedSegment.startKm.toFixed(1)} - {selectedSegment.endKm.toFixed(1)} كم
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">عوامل الخطر المحددة:</h4>
              <ul className="space-y-1">
                {selectedSegment.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <i className="fas fa-exclamation-triangle text-red-500 ml-2"></i>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">الإحصائيات:</h4>
              <div className="space-y-2 text-sm">
                <p><strong>معدل الحوادث:</strong> {selectedSegment.crashRate.toFixed(1)} حادث/سنة</p>
                <p><strong>التكلفة المقدرة:</strong> {selectedSegment.estimatedCost.toLocaleString()} ر.س</p>
                <p><strong>الوفورات المحتملة:</strong> {selectedSegment.potentialSavings.toLocaleString()} ر.س/سنة</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* التوصيات */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">التوصيات والحلول</h3>
        <div className="space-y-4">
          {analysisData.recommendations.map((rec, index) => (
            <div key={rec.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'عاجل' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">التكلفة:</span>
                  <p>{(rec.estimatedCost / 1000).toLocaleString()} ألف ر.س</p>
                </div>
                <div>
                  <span className="font-medium">المدة الزمنية:</span>
                  <p>{rec.timeframe}</p>
                </div>
                <div>
                  <span className="font-medium">التأثير المتوقع:</span>
                  <p>{rec.expectedReduction}</p>
                </div>
                <div>
                  <span className="font-medium">الفئة:</span>
                  <p>{rec.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* تحليل التكلفة والفائدة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">تحليل التكلفة والفائدة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">إجمالي الاستثمار</p>
            <p className="text-2xl font-bold text-blue-600">
              {(analysisData.costBenefitAnalysis.totalInvestment / 1000000).toFixed(1)} مليون ر.س
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">الوفورات السنوية</p>
            <p className="text-2xl font-bold text-green-600">
              {(analysisData.costBenefitAnalysis.annualSavings / 1000000).toFixed(1)} مليون ر.س
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">فترة الاسترداد</p>
            <p className="text-2xl font-bold text-yellow-600">
              {analysisData.costBenefitAnalysis.paybackPeriod} سنة
            </p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">المؤشرات المالية:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>العائد على الاستثمار:</strong> {analysisData.costBenefitAnalysis.roi}%</p>
              <p><strong>صافي القيمة الحالية:</strong> {(analysisData.costBenefitAnalysis.netPresentValue / 1000000).toFixed(1)} مليون ر.س</p>
              <p><strong>نسبة الفائدة إلى التكلفة:</strong> {analysisData.costBenefitAnalysis.benefitCostRatio}:1</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">الفوائد المتوقعة:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 ml-2"></i>
                تقليل الحوادث بنسبة 40-60%
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 ml-2"></i>
                توفير في تكاليف الرعاية الصحية
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 ml-2"></i>
                تحسين تدفق المرور
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle text-green-500 ml-2"></i>
                زيادة الثقة في استخدام الطريق
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* الجدول الزمني للتنفيذ */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">الجدول الزمني للتنفيذ</h3>
        <div className="space-y-4">
          {analysisData.timeline.map((phase, index) => (
            <div key={index} className="border-r-4 border-blue-500 pr-4">
              <h4 className="font-semibold text-gray-800">{phase.phase}</h4>
              <p className="text-sm text-gray-600 mb-2">المدة: {phase.duration}</p>
              <p className="text-sm text-gray-600 mb-2">التكلفة: {(phase.cost / 1000000).toFixed(1)} مليون ر.س</p>
              <p className="text-sm text-gray-600 mb-2">التأثير المتوقع: {phase.expectedImpact}</p>
              <ul className="text-sm space-y-1">
                {phase.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-center">
                    <i className="fas fa-tasks text-blue-500 ml-2"></i>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IRAPAnalysis;

