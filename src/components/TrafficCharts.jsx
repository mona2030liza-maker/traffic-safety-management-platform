import React, { useState, useEffect } from 'react'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie as RechartsPie, Cell, BarChart, Bar as RechartsBar } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Sample data for charts
const monthlyAccidentsData = [
  { month: 'يناير', accidents: 45, injuries: 23, fatalities: 3 },
  { month: 'فبراير', accidents: 38, injuries: 19, fatalities: 2 },
  { month: 'مارس', accidents: 52, injuries: 28, fatalities: 4 },
  { month: 'أبريل', accidents: 41, injuries: 21, fatalities: 2 },
  { month: 'مايو', accidents: 48, injuries: 25, fatalities: 3 },
  { month: 'يونيو', accidents: 55, injuries: 31, fatalities: 5 },
  { month: 'يوليو', accidents: 62, injuries: 35, fatalities: 6 },
  { month: 'أغسطس', accidents: 58, injuries: 32, fatalities: 4 },
  { month: 'سبتمبر', accidents: 44, injuries: 22, fatalities: 3 },
  { month: 'أكتوبر', accidents: 39, injuries: 18, fatalities: 2 },
  { month: 'نوفمبر', accidents: 43, injuries: 24, fatalities: 3 },
  { month: 'ديسمبر', accidents: 47, injuries: 26, fatalities: 4 }
]

const accidentTypeData = [
  { name: 'تصادم خلفي', value: 35, color: '#ef4444' },
  { name: 'تصادم جانبي', value: 25, color: '#f59e0b' },
  { name: 'انقلاب مركبة', value: 20, color: '#10b981' },
  { name: 'اصطدام بعائق', value: 12, color: '#3b82f6' },
  { name: 'دهس مشاة', value: 8, color: '#8b5cf6' }
]

const timeOfDayData = [
  { time: '6-8 ص', accidents: 25 },
  { time: '8-10 ص', accidents: 45 },
  { time: '10-12 ظ', accidents: 20 },
  { time: '12-2 م', accidents: 30 },
  { time: '2-4 م', accidents: 18 },
  { time: '4-6 م', accidents: 38 },
  { time: '6-8 م', accidents: 42 },
  { time: '8-10 م', accidents: 15 },
  { time: '10-12 ل', accidents: 8 },
  { time: '12-6 ص', accidents: 5 }
]

const roadTypeData = [
  { road: 'طرق رئيسية', accidents: 120, percentage: 45 },
  { road: 'طرق فرعية', accidents: 85, percentage: 32 },
  { road: 'طرق داخلية', accidents: 45, percentage: 17 },
  { road: 'طرق سريعة', accidents: 16, percentage: 6 }
]

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

const TrafficCharts = ({ filters = {} }) => {
  const [loading, setLoading] = useState(true)
  const [activeChart, setActiveChart] = useState('monthly')

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monthly">الاتجاهات الشهرية</TabsTrigger>
          <TabsTrigger value="types">أنواع الحوادث</TabsTrigger>
          <TabsTrigger value="timing">التوقيت اليومي</TabsTrigger>
          <TabsTrigger value="roads">أنواع الطرق</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Accidents Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">اتجاه الحوادث الشهرية</CardTitle>
                <CardDescription className="text-right">
                  عدد الحوادث والإصابات والوفيات خلال العام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyAccidentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <RechartsLine 
                      type="monotone" 
                      dataKey="accidents" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="حوادث"
                    />
                    <RechartsLine 
                      type="monotone" 
                      dataKey="injuries" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="إصابات"
                    />
                    <RechartsLine 
                      type="monotone" 
                      dataKey="fatalities" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="وفيات"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">مقارنة شهرية</CardTitle>
                <CardDescription className="text-right">
                  مقارنة الحوادث بين الأشهر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyAccidentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <RechartsBar dataKey="accidents" fill="#3b82f6" name="حوادث" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">572</div>
                  <div className="text-sm text-muted-foreground">إجمالي الحوادث</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">304</div>
                  <div className="text-sm text-muted-foreground">إجمالي الإصابات</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">41</div>
                  <div className="text-sm text-muted-foreground">إجمالي الوفيات</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">47.7</div>
                  <div className="text-sm text-muted-foreground">متوسط شهري</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accident Types Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">توزيع أنواع الحوادث</CardTitle>
                <CardDescription className="text-right">
                  النسبة المئوية لكل نوع من أنواع الحوادث
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <RechartsPie
                      data={accidentTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                    >
                      {accidentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Accident Types List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">تفاصيل أنواع الحوادث</CardTitle>
                <CardDescription className="text-right">
                  قائمة مفصلة بأنواع الحوادث ونسبها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accidentTypeData.map((type, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        ></div>
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{type.value}%</Badge>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(type.value * 5.72)} حادث
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time of Day Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">توزيع الحوادث حسب الوقت</CardTitle>
                <CardDescription className="text-right">
                  عدد الحوادث في كل فترة زمنية خلال اليوم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeOfDayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <RechartsTooltip />
                    <RechartsBar dataKey="accidents" fill="#8b5cf6" name="حوادث" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Peak Hours Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">تحليل ساعات الذروة</CardTitle>
                <CardDescription className="text-right">
                  الفترات الأكثر خطورة خلال اليوم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="destructive">خطر عالي</Badge>
                      <span className="font-bold">8-10 صباحاً</span>
                    </div>
                    <p className="text-sm text-right">45 حادث - ساعة الذروة الصباحية</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="default">خطر متوسط</Badge>
                      <span className="font-bold">6-8 مساءً</span>
                    </div>
                    <p className="text-sm text-right">42 حادث - ساعة الذروة المسائية</p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="secondary">خطر منخفض</Badge>
                      <span className="font-bold">12-6 صباحاً</span>
                    </div>
                    <p className="text-sm text-right">5 حوادث - أقل الفترات خطورة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Road Types Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">الحوادث حسب نوع الطريق</CardTitle>
                <CardDescription className="text-right">
                  توزيع الحوادث على أنواع الطرق المختلفة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roadTypeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="road" type="category" width={100} />
                    <RechartsTooltip />
                    <RechartsBar dataKey="accidents" fill="#10b981" name="حوادث" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Road Safety Index */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">مؤشر السلامة للطرق</CardTitle>
                <CardDescription className="text-right">
                  تقييم مستوى السلامة لكل نوع طريق
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roadTypeData.map((road, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{road.road}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{road.accidents} حادث</span>
                          <Badge variant={
                            road.percentage > 40 ? 'destructive' : 
                            road.percentage > 20 ? 'default' : 'secondary'
                          }>
                            {road.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            road.percentage > 40 ? 'bg-red-500' : 
                            road.percentage > 20 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${road.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TrafficCharts
