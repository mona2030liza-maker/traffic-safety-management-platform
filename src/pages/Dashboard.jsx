import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import TrafficMap from '../components/TrafficMap'
import TrafficCharts from '../components/TrafficCharts'
import TrafficFilterForm from '../components/TrafficFilterForm'
import ThemeToggle from '../components/ThemeToggle'

const Dashboard = () => {
  const [filterData, setFilterData] = useState({
    startDate: '',
    endDate: '',
    severity: '',
    location: ''
  })

  const handleFilterChange = (newFilters) => {
    setFilterData(newFilters)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-primary mb-2">
                منصة بيانات السلامة المرورية
              </h1>
              <p className="text-xl text-muted-foreground">
                مركز تخطيط المرور وهندسة النقل - منطقة الباحة
              </p>
              <div className="flex justify-center gap-2 mt-3">
                <Badge variant="secondary">عرض تفاعلي</Badge>
                <Badge variant="secondary">بيانات مرورية</Badge>
                <Badge variant="secondary">خرائط حرارية</Badge>
              </div>
            </div>
            <div className="absolute left-4 top-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
          {/* Sidebar - Filters */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full p-6 bg-card/30"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">فلاتر البيانات</CardTitle>
                  <CardDescription className="text-right">
                    قم بتخصيص عرض البيانات المرورية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TrafficFilterForm onFilterChange={handleFilterChange} />
                </CardContent>
              </Card>

              {/* Statistics Cards */}
              <div className="mt-6 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-right">إحصائيات سريعة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="destructive">156</Badge>
                      <span className="text-sm">حوادث هذا الشهر</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary">23</Badge>
                      <span className="text-sm">نقاط خطرة</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="default">89%</Badge>
                      <span className="text-sm">معدل السلامة</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Main Content Area */}
          <ResizablePanel defaultSize={70}>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="h-full p-6"
            >
              <Tabs defaultValue="map" className="h-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="map">الخريطة التفاعلية</TabsTrigger>
                  <TabsTrigger value="charts">الرسوم البيانية</TabsTrigger>
                  <TabsTrigger value="analysis">التحليل المتقدم</TabsTrigger>
                </TabsList>

                <TabsContent value="map" className="h-[calc(100%-60px)]">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-right">خريطة البيانات المرورية</CardTitle>
                      <CardDescription className="text-right">
                        عرض تفاعلي للحوادث والنقاط الساخنة في منطقة الباحة
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-100px)]">
                      <TrafficMap filters={filterData} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="charts" className="h-[calc(100%-60px)]">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-right">الرسوم البيانية والإحصائيات</CardTitle>
                      <CardDescription className="text-right">
                        تحليل بصري للبيانات المرورية والاتجاهات
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-100px)] overflow-auto">
                      <TrafficCharts filters={filterData} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="h-[calc(100%-60px)]">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-right">التحليل المتقدم</CardTitle>
                      <CardDescription className="text-right">
                        تحليل معمق للأنماط والتوقعات المرورية
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-right text-lg">تحليل الأنماط الزمنية</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <span className="font-medium">الفترة الصباحية (6-10 ص)</span>
                                <Badge variant="destructive">عالي الخطورة</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">فترة الظهيرة (12-2 م)</span>
                                <Badge variant="secondary">متوسط</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">الفترة المسائية (5-8 م)</span>
                                <Badge variant="destructive">عالي الخطورة</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-right text-lg">التوصيات</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-right">زيادة الدوريات في طريق الملك فهد</p>
                              </div>
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-right">تحسين الإشارات المرورية في وسط المدينة</p>
                              </div>
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm text-right">إضافة كاميرات مراقبة في النقاط الحرجة</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}

export default Dashboard
