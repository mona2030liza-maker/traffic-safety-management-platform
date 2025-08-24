import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// Form validation schema
const filterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  severity: z.string().optional(),
  accidentType: z.string().optional(),
  location: z.string().optional(),
  timeOfDay: z.string().optional(),
  roadType: z.string().optional(),
  weatherCondition: z.string().optional(),
})

const TrafficFilterForm = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({})
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      severity: '',
      accidentType: '',
      location: '',
      timeOfDay: '',
      roadType: '',
      weatherCondition: ''
    }
  })

  const watchedValues = watch()

  const onSubmit = (data) => {
    // Filter out empty values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
    )
    
    setActiveFilters(filteredData)
    onFilterChange(filteredData)
    
    toast.success('تم تطبيق الفلاتر بنجاح', {
      description: `تم تطبيق ${Object.keys(filteredData).length} فلتر`,
      duration: 3000,
    })
  }

  const handleReset = () => {
    reset()
    setActiveFilters({})
    onFilterChange({})
    toast.info('تم إعادة تعيين الفلاتر', {
      description: 'تم مسح جميع الفلاتر المطبقة',
      duration: 2000,
    })
  }

  const handleQuickFilter = (filterType, value) => {
    setValue(filterType, value)
    const newFilters = { ...activeFilters, [filterType]: value }
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
    
    toast.success('تم تطبيق الفلتر السريع', {
      duration: 2000,
    })
  }

  const removeFilter = (filterKey) => {
    setValue(filterKey, '')
    const newFilters = { ...activeFilters }
    delete newFilters[filterKey]
    setActiveFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Quick Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">فلاتر سريعة</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter('severity', 'high')}
            className="text-xs"
          >
            حوادث خطيرة
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter('timeOfDay', 'morning')}
            className="text-xs"
          >
            الفترة الصباحية
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter('accidentType', 'collision')}
            className="text-xs"
          >
            تصادمات
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter('roadType', 'main')}
            className="text-xs"
          >
            طرق رئيسية
          </Button>
        </div>
      </div>

      <Separator />

      {/* Active Filters */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">الفلاتر المطبقة</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <Badge
                key={key}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeFilter(key)}
              >
                {value} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Main Filter Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {/* Date Range */}
          <AccordionItem value="date-range">
            <AccordionTrigger className="text-right">النطاق الزمني</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-right">من تاريخ</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register('startDate')}
                    className="text-right"
                  />
                  {errors.startDate && (
                    <p className="text-xs text-destructive text-right">{errors.startDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-right">إلى تاريخ</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate')}
                    className="text-right"
                  />
                  {errors.endDate && (
                    <p className="text-xs text-destructive text-right">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Severity and Type */}
          <AccordionItem value="severity-type">
            <AccordionTrigger className="text-right">نوع ومستوى الحادث</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="severity" className="text-right">مستوى الخطورة</Label>
                <Select onValueChange={(value) => setValue('severity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى الخطورة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">عالي</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accidentType" className="text-right">نوع الحادث</Label>
                <Select onValueChange={(value) => setValue('accidentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الحادث" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collision">تصادم</SelectItem>
                    <SelectItem value="rollover">انقلاب</SelectItem>
                    <SelectItem value="pedestrian">دهس مشاة</SelectItem>
                    <SelectItem value="obstacle">اصطدام بعائق</SelectItem>
                    <SelectItem value="fire">حريق مركبة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Location and Road */}
          <AccordionItem value="location-road">
            <AccordionTrigger className="text-right">الموقع ونوع الطريق</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-right">المنطقة</Label>
                <Select onValueChange={(value) => setValue('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">وسط المدينة</SelectItem>
                    <SelectItem value="north">شمال الباحة</SelectItem>
                    <SelectItem value="south">جنوب الباحة</SelectItem>
                    <SelectItem value="east">شرق الباحة</SelectItem>
                    <SelectItem value="west">غرب الباحة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roadType" className="text-right">نوع الطريق</Label>
                <Select onValueChange={(value) => setValue('roadType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الطريق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">طريق رئيسي</SelectItem>
                    <SelectItem value="secondary">طريق فرعي</SelectItem>
                    <SelectItem value="internal">طريق داخلي</SelectItem>
                    <SelectItem value="highway">طريق سريع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Time and Weather */}
          <AccordionItem value="time-weather">
            <AccordionTrigger className="text-right">الوقت والطقس</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeOfDay" className="text-right">فترة اليوم</Label>
                <Select onValueChange={(value) => setValue('timeOfDay', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فترة اليوم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">صباحاً (6-12)</SelectItem>
                    <SelectItem value="afternoon">ظهراً (12-6)</SelectItem>
                    <SelectItem value="evening">مساءً (6-12)</SelectItem>
                    <SelectItem value="night">ليلاً (12-6)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weatherCondition" className="text-right">حالة الطقس</Label>
                <Select onValueChange={(value) => setValue('weatherCondition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة الطقس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">صافي</SelectItem>
                    <SelectItem value="rain">ممطر</SelectItem>
                    <SelectItem value="fog">ضباب</SelectItem>
                    <SelectItem value="dust">غبار</SelectItem>
                    <SelectItem value="wind">رياح قوية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            تطبيق الفلاتر
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            إعادة تعيين
          </Button>
        </div>
      </form>

      {/* Filter Summary */}
      {Object.keys(activeFilters).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-right">ملخص الفلاتر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-right">
              تم تطبيق {Object.keys(activeFilters).length} فلتر على البيانات
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}

export default TrafficFilterForm
