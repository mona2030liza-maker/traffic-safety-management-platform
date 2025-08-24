import React, { useState, useEffect } from 'react';
import { albahaRegionData } from '../data/albahaData';

// مكون فلاتر البحث المتقدمة القابل لإعادة الاستخدام
const AdvancedFilters = ({ 
  filterConfig, 
  onFiltersChange, 
  data = [], 
  className = "",
  showResultCount = true,
  collapsible = true 
}) => {
  const [filters, setFilters] = useState({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [filteredCount, setFilteredCount] = useState(data.length);

  // تهيئة الفلاتر من التكوين
  useEffect(() => {
    const initialFilters = {};
    filterConfig.forEach(config => {
      initialFilters[config.key] = config.defaultValue || '';
    });
    setFilters(initialFilters);
  }, [filterConfig]);

  // تطبيق الفلاتر وحساب النتائج
  useEffect(() => {
    if (!data.length) return;

    let filtered = data;

    filterConfig.forEach(config => {
      const filterValue = filters[config.key];
      if (!filterValue || filterValue === '' || filterValue === 'all') return;

      switch (config.type) {
        case 'text':
        case 'search':
          filtered = filtered.filter(item => {
            const searchFields = config.searchFields || [config.key];
            return searchFields.some(field => {
              const value = getNestedValue(item, field);
              return value && value.toString().toLowerCase().includes(filterValue.toLowerCase());
            });
          });
          break;

        case 'select':
        case 'multiselect':
          if (config.type === 'multiselect') {
            const selectedValues = Array.isArray(filterValue) ? filterValue : [filterValue];
            filtered = filtered.filter(item => {
              const itemValue = getNestedValue(item, config.key);
              if (Array.isArray(itemValue)) {
                return selectedValues.some(val => itemValue.includes(val));
              }
              return selectedValues.includes(itemValue);
            });
          } else {
            filtered = filtered.filter(item => {
              const itemValue = getNestedValue(item, config.key);
              return itemValue === filterValue;
            });
          }
          break;

        case 'date':
        case 'dateRange':
          if (config.type === 'dateRange') {
            const [startDate, endDate] = filterValue.split(' - ');
            if (startDate && endDate) {
              filtered = filtered.filter(item => {
                const itemDate = new Date(getNestedValue(item, config.key));
                return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
              });
            }
          } else {
            filtered = filtered.filter(item => {
              const itemDate = new Date(getNestedValue(item, config.key));
              const filterDate = new Date(filterValue);
              return itemDate.toDateString() === filterDate.toDateString();
            });
          }
          break;

        case 'number':
        case 'range':
          if (config.type === 'range') {
            const [min, max] = filterValue.split('-').map(Number);
            filtered = filtered.filter(item => {
              const itemValue = Number(getNestedValue(item, config.key));
              return itemValue >= min && itemValue <= max;
            });
          } else {
            filtered = filtered.filter(item => {
              const itemValue = Number(getNestedValue(item, config.key));
              return itemValue === Number(filterValue);
            });
          }
          break;

        case 'boolean':
          filtered = filtered.filter(item => {
            const itemValue = getNestedValue(item, config.key);
            return Boolean(itemValue) === (filterValue === 'true');
          });
          break;

        case 'custom':
          if (config.filterFunction) {
            filtered = filtered.filter(item => config.filterFunction(item, filterValue));
          }
          break;
      }
    });

    setFilteredCount(filtered.length);
    
    if (onFiltersChange) {
      onFiltersChange(filters, filtered);
    }
  }, [filters, data, filterConfig, onFiltersChange]);

  // الحصول على قيمة متداخلة من كائن
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // تحديث فلتر واحد
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // إعادة تعيين جميع الفلاتر
  const resetFilters = () => {
    const resetFilters = {};
    filterConfig.forEach(config => {
      resetFilters[config.key] = config.defaultValue || '';
    });
    setFilters(resetFilters);
  };

  // إعادة تعيين فلتر واحد
  const resetSingleFilter = (key) => {
    const config = filterConfig.find(c => c.key === key);
    updateFilter(key, config?.defaultValue || '');
  };

  // تصدير الفلاتر الحالية
  const exportFilters = () => {
    const activeFilters = Object.entries(filters).filter(([key, value]) => 
      value && value !== '' && value !== 'all'
    );
    
    const filterData = {
      filters: Object.fromEntries(activeFilters),
      timestamp: new Date().toISOString(),
      resultCount: filteredCount
    };

    const blob = new Blob([JSON.stringify(filterData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filters_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // رندر حقل فلتر واحد
  const renderFilterField = (config) => {
    const value = filters[config.key] || '';

    switch (config.type) {
      case 'text':
      case 'search':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateFilter(config.key, e.target.value)}
            placeholder={config.placeholder || `ابحث في ${config.label}...`}
            className="w-full p-2 border rounded-md text-sm"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateFilter(config.key, e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">{config.placeholder || `جميع ${config.label}`}</option>
            {config.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <select
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(e) => {
              const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
              updateFilter(config.key, selectedValues);
            }}
            className="w-full p-2 border rounded-md text-sm"
            size={Math.min(config.options?.length || 3, 5)}
          >
            {config.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => updateFilter(config.key, e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        );

      case 'dateRange':
        return (
          <div className="flex space-x-2 space-x-reverse">
            <input
              type="date"
              placeholder="من"
              onChange={(e) => {
                const [, endDate] = (value || ' - ').split(' - ');
                updateFilter(config.key, `${e.target.value} - ${endDate || ''}`);
              }}
              className="flex-1 p-2 border rounded-md text-sm"
            />
            <input
              type="date"
              placeholder="إلى"
              onChange={(e) => {
                const [startDate] = (value || ' - ').split(' - ');
                updateFilter(config.key, `${startDate || ''} - ${e.target.value}`);
              }}
              className="flex-1 p-2 border rounded-md text-sm"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => updateFilter(config.key, e.target.value)}
            placeholder={config.placeholder}
            min={config.min}
            max={config.max}
            className="w-full p-2 border rounded-md text-sm"
          />
        );

      case 'range':
        return (
          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              type="number"
              placeholder="من"
              onChange={(e) => {
                const [, max] = (value || '-').split('-');
                updateFilter(config.key, `${e.target.value}-${max || ''}`);
              }}
              className="flex-1 p-2 border rounded-md text-sm"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="إلى"
              onChange={(e) => {
                const [min] = (value || '-').split('-');
                updateFilter(config.key, `${min || ''}-${e.target.value}`);
              }}
              className="flex-1 p-2 border rounded-md text-sm"
            />
          </div>
        );

      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => updateFilter(config.key, e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">الكل</option>
            <option value="true">نعم</option>
            <option value="false">لا</option>
          </select>
        );

      case 'custom':
        return config.renderComponent ? 
          config.renderComponent(value, (newValue) => updateFilter(config.key, newValue)) :
          null;

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`} dir="rtl">
      {/* رأس الفلاتر */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <h3 className="text-lg font-bold text-gray-800">فلاتر البحث المتقدمة</h3>
            {showResultCount && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filteredCount} نتيجة
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={exportFilters}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
              title="تصدير الفلاتر"
            >
              <i className="fas fa-download ml-1"></i>
              تصدير
            </button>
            
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              title="إعادة تعيين جميع الفلاتر"
            >
              <i className="fas fa-undo ml-1"></i>
              إعادة تعيين
            </button>
            
            {collapsible && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700"
                title={isExpanded ? "طي الفلاتر" : "توسيع الفلاتر"}
              >
                <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* حقول الفلاتر */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filterConfig.map((config) => (
              <div key={config.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    {config.label}
                    {config.required && <span className="text-red-500 mr-1">*</span>}
                  </label>
                  
                  {filters[config.key] && filters[config.key] !== '' && filters[config.key] !== 'all' && (
                    <button
                      onClick={() => resetSingleFilter(config.key)}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                      title="إعادة تعيين هذا الفلتر"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                
                {renderFilterField(config)}
                
                {config.description && (
                  <p className="text-xs text-gray-500">{config.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* الفلاتر النشطة */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">الفلاتر النشطة:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === '' || value === 'all') return null;
                
                const config = filterConfig.find(c => c.key === key);
                if (!config) return null;

                let displayValue = value;
                if (config.type === 'select' && config.options) {
                  const option = config.options.find(opt => opt.value === value);
                  displayValue = option?.label || value;
                } else if (config.type === 'multiselect' && Array.isArray(value)) {
                  displayValue = value.map(v => {
                    const option = config.options?.find(opt => opt.value === v);
                    return option?.label || v;
                  }).join(', ');
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span className="font-medium ml-1">{config.label}:</span>
                    <span>{displayValue}</span>
                    <button
                      onClick={() => resetSingleFilter(key)}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </span>
                );
              })}
              
              {Object.values(filters).every(value => !value || value === '' || value === 'all') && (
                <span className="text-gray-500 text-sm">لا توجد فلاتر نشطة</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// تكوينات فلاتر جاهزة للاستخدام
export const filterConfigs = {
  // فلاتر الحوادث المرورية
  accidents: [
    {
      key: 'search',
      label: 'البحث العام',
      type: 'search',
      searchFields: ['location', 'type', 'description'],
      placeholder: 'ابحث في الموقع أو النوع أو الوصف...'
    },
    {
      key: 'type',
      label: 'نوع الحادث',
      type: 'select',
      options: [
        { value: 'تصادم', label: 'تصادم' },
        { value: 'انقلاب', label: 'انقلاب' },
        { value: 'دهس مشاة', label: 'دهس مشاة' },
        { value: 'اصطدام بجسم ثابت', label: 'اصطدام بجسم ثابت' },
        { value: 'حريق مركبة', label: 'حريق مركبة' }
      ]
    },
    {
      key: 'severity',
      label: 'الشدة',
      type: 'select',
      options: [
        { value: 'مميت', label: 'مميت' },
        { value: 'خطير', label: 'خطير' },
        { value: 'متوسط', label: 'متوسط' },
        { value: 'بسيط', label: 'بسيط' }
      ]
    },
    {
      key: 'governorate',
      label: 'المحافظة',
      type: 'select',
      options: albahaRegionData.governorates.map(gov => ({
        value: gov.id,
        label: gov.name
      }))
    },
    {
      key: 'date',
      label: 'التاريخ',
      type: 'dateRange'
    },
    {
      key: 'weather',
      label: 'حالة الطقس',
      type: 'select',
      options: [
        { value: 'مشمس', label: 'مشمس' },
        { value: 'ممطر', label: 'ممطر' },
        { value: 'غائم', label: 'غائم' },
        { value: 'ضبابي', label: 'ضبابي' }
      ]
    },
    {
      key: 'casualties',
      label: 'عدد الإصابات',
      type: 'range'
    }
  ],

  // فلاتر الحملات
  campaigns: [
    {
      key: 'search',
      label: 'البحث العام',
      type: 'search',
      searchFields: ['title', 'description', 'manager'],
      placeholder: 'ابحث في العنوان أو الوصف أو المدير...'
    },
    {
      key: 'type',
      label: 'نوع الحملة',
      type: 'select',
      options: [
        { value: 'توعوية', label: 'توعوية' },
        { value: 'تنفيذية', label: 'تنفيذية' },
        { value: 'بنية تحتية', label: 'بنية تحتية' },
        { value: 'تعليمية', label: 'تعليمية' },
        { value: 'متخصصة', label: 'متخصصة' }
      ]
    },
    {
      key: 'status',
      label: 'الحالة',
      type: 'select',
      options: [
        { value: 'نشطة', label: 'نشطة' },
        { value: 'مجدولة', label: 'مجدولة' },
        { value: 'مكتملة', label: 'مكتملة' },
        { value: 'قيد التخطيط', label: 'قيد التخطيط' },
        { value: 'متوقفة', label: 'متوقفة' }
      ]
    },
    {
      key: 'priority',
      label: 'الأولوية',
      type: 'select',
      options: [
        { value: 'عالية', label: 'عالية' },
        { value: 'متوسطة', label: 'متوسطة' },
        { value: 'منخفضة', label: 'منخفضة' }
      ]
    },
    {
      key: 'governorates',
      label: 'المحافظات',
      type: 'multiselect',
      options: albahaRegionData.governorates.map(gov => ({
        value: gov.id,
        label: gov.name
      }))
    },
    {
      key: 'budget',
      label: 'الميزانية (ر.س)',
      type: 'range'
    },
    {
      key: 'startDate',
      label: 'تاريخ البداية',
      type: 'dateRange'
    }
  ],

  // فلاتر النقاط السوداء
  blackspots: [
    {
      key: 'search',
      label: 'البحث في الموقع',
      type: 'search',
      searchFields: ['location'],
      placeholder: 'ابحث في اسم الموقع...'
    },
    {
      key: 'severity',
      label: 'مستوى الخطورة',
      type: 'select',
      options: [
        { value: 'حرجة', label: 'حرجة' },
        { value: 'عالية', label: 'عالية' },
        { value: 'متوسطة', label: 'متوسطة' },
        { value: 'منخفضة', label: 'منخفضة' }
      ]
    },
    {
      key: 'type',
      label: 'نوع الموقع',
      type: 'select',
      options: [
        { value: 'تقاطع', label: 'تقاطع' },
        { value: 'منحنى', label: 'منحنى' },
        { value: 'طريق مستقيم', label: 'طريق مستقيم' },
        { value: 'جسر', label: 'جسر' }
      ]
    },
    {
      key: 'governorate',
      label: 'المحافظة',
      type: 'select',
      options: albahaRegionData.governorates.map(gov => ({
        value: gov.id,
        label: gov.name
      }))
    },
    {
      key: 'riskScore',
      label: 'درجة الخطورة',
      type: 'range',
      description: 'من 0 إلى 10'
    },
    {
      key: 'accidentCount',
      label: 'عدد الحوادث',
      type: 'range'
    }
  ]
};

export default AdvancedFilters;

