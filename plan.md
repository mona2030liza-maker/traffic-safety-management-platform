```markdown
# خطة التنفيذ التفصيلية لتطبيق منصة بيانات السلامة المرورية بمنطقة الباحة

تتضمن الخطة تعديل وتحسين إعداد المشروع الحالي (Next.js) مع التحول إلى استخدام pnpm، والاحتفاظ بـ TypeScript والتوجيه المدمج في Next.js. سيتم إنشاء صفحات جديدة ومكونات متخصصة للتعامل مع الخرائط، الرسوم البيانية، النماذج التفاعلية، الإشعارات والدعم المظلم/الفاتح. فيما يلي الخطوات التفصيلية مع الملفات المعتمدة والتغييرات المطلوبة.

---

## 1. إعداد بيئة المشروع وإدارة الحزم

### أ. التحول إلى pnpm
- **ملف:** `package.json`
  - تأكد من تحديث السكريبتات لتعمل مع pnpm (على سبيل المثال، `"dev": "next dev"`, `"build": "next build"`).
- **إجراء:**  
  - حذف الملف `package-lock.json`.
  - تشغيل الأمر:  
    ```bash
    rm package-lock.json
    pnpm install
    ```
- **ملف إضافي:** سيتم إنشاء `pnpm-lock.yaml` تلقائيًا.

---

## 2. إعداد التخطيط العام والدعم اللغوي

### أ. إنشاء/تحديث ملف التخطيط العام
- **ملف:** `src/app/layout.tsx`
  - إنشاء ملف جديد أو تعديل الموجود لاحتواء العناصر الأساسية:
    - وضع علامة `<html>` مع الخصائص: `lang="ar"` و `dir="rtl"`.
    - تضمين `ThemeProvider` من `next-themes` لدعم الوضع المظلم/الفاتح.
    - تغليف محتوى التطبيق بـ Error Boundary (معالجة الأخطاء على مستوى الصفحات).
    
    **مثال للتطبيق:**
    ```tsx
    import { ThemeProvider } from "next-themes";
    import "../app/globals.css";

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="ar" dir="rtl">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body>
            <ThemeProvider attribute="class" defaultTheme="light">
              {/* يمكن إضافة ErrorBoundary هنا */}
              {children}
            </ThemeProvider>
          </body>
        </html>
      );
    }
    ```

### ب. تحديث تنسيق CSS العام
- **ملف:** `src/app/globals.css`
  - تحديث المتغيرات (CSS variables) لتدعم الوضع المظلم والاتجاه RTL.
  - إضافة قواعد للخطوط والتباعد لتوفير واجهة حديثة.
  - مثال:
    ```css
    :root {
      --primary-color: #2563eb;
      --secondary-color: #f3f4f6;
      --bg-color: #ffffff;
      --text-color: #1f2937;
    }
    [data-theme="dark"] {
      --bg-color: #1f2937;
      --text-color: #f3f4f6;
    }
    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      direction: rtl;
      font-family: 'Noto Sans Arabic', sans-serif;
    }
    ```

---

## 3. إنشاء الصفحة الرئيسية (Dashboard) لعرض البيانات

### أ. إنشاء صفحة لوحة التحكم
- **ملف:** `src/app/dashboard/page.tsx`
  - ستكون الصفحة الرئيسية للمنصة وتحتوي على:
    - رأس (Header) يحتوي على عنوان المنصة ووصف موجز.
    - تخطيط من قسمين (باستخدام `react-resizable-panels`):
      - لوحة جانبية (Sidebar) تحتوي على نموذج التصفية والفلاتر باستخدام مكون Accordion من Radix UI.
      - منطقة المحتوى الرئيسي لعرض الخرائط والرسوم البيانية.
    - دمج حركات سلسة باستخدام `framer-motion` للانتقالات.
  
  **هيكل تقريبي للصفحة:**
  ```tsx
  import { m } from "framer-motion";
  import ResizablePanel from "@/components/ui/resizable"; // تأكد من أن هذا المكون موجود أو قم بإنشائه
  import TrafficMap from "@/components/TrafficMap";
  import TrafficCharts from "@/components/TrafficCharts";
  import TrafficFilterForm from "@/components/TrafficFilterForm";
  
  export default function DashboardPage() {
    return (
      <div className="p-4">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold">منصة بيانات السلامة المرورية - منطقة الباحة</h1>
          <p className="text-lg mt-2">عرض تفاعلي للبيانات المرورية والخرائط والرسوم البيانية</p>
        </header>
        <div className="flex flex-col md:flex-row gap-4">
          {/* اللوحة اليسارية: الفلاتر */}
          <div className="md:w-1/3">
            <TrafficFilterForm />
          </div>
          {/* اللوحة الرئيسية: الخرائط والرسوم البيانية */}
          <ResizablePanel className="md:w-2/3">
            <div className="space-y-6">
              <TrafficMap />
              <TrafficCharts />
            </div>
          </ResizablePanel>
        </div>
      </div>
    );
  }
  ```

---

## 4. مكونات العرض التفاعلية للبيانات

### أ. خريطة المرور
- **ملف:** `src/components/TrafficMap.tsx`
  - استخدام `react-leaflet` و `leaflet` لعرض خريطة تفاعلية لمنطقة الباحة.
  - دمج `leaflet.heat` لإظهار الخريطة الحرارية.
  - يجب تضمين معالجة الأخطاء في حال فشل تحميل الخريطة.
  
  **مثال مبدئي:**
  ```tsx
  import { MapContainer, TileLayer, useMap } from "react-leaflet";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { useEffect } from "react";

  function HeatLayer({ data }: { data: number[][] }) {
    const map = useMap();
    useEffect(() => {
      // تحقق من تحميل مكتبة leaflet.heat بشكل ديناميكي إذا لم تكن مدمجة
      // @ts-ignore
      const heatLayer = L.heatLayer(data, { radius: 25, blur: 15 });
      heatLayer.addTo(map);
      return () => {
        map.removeLayer(heatLayer);
      };
    }, [map, data]);
    return null;
  }

  export default function TrafficMap() {
    // بيانات افتراضية لخريطة حرارية
    const heatData = [
      [27.5, 41.1, 0.5],
      [27.51, 41.12, 0.8],
      // المزيد من النقاط...
    ];
    
    return (
      <div className="border rounded-lg overflow-hidden shadow">
        <MapContainer center={[27.5, 41.1]} zoom={13} className="h-64 w-full">
          <TileLayer
            attribution='&copy; مصدر البيانات'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatLayer data={heatData} />
        </MapContainer>
        <p className="text-sm text-center py-2">خريطة تفاعلية مع طبقة حرارية تعرض كثافة البيانات</p>
      </div>
    );
  }
  ```

### ب. الرسوم البيانية للبيانات المرورية
- **ملف:** `src/components/TrafficCharts.tsx`
  - دمج مكتبات `react-chartjs-2` و `recharts` لإنشاء رسوم بيانية تفاعلية (خطية، شريطية، دائرية).
  - يجب تضمين مؤشرات للتحميل ومعالجة الأخطاء في حال فشل جلب البيانات.
  
  **مخطط تقريبي:**
  ```tsx
  import { Line } from "react-chartjs-2";
  import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
  
  export default function TrafficCharts() {
    // بيانات افتراضية للرسوم البيانية
    const lineData = {
      labels: ["يناير", "فبراير", "مارس", "أبريل"],
      datasets: [
        {
          label: "حوادث المرور",
          data: [65, 59, 80, 81],
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.2)",
        }
      ]
    };

    const pieData = [
      { name: "حادث خفيف", value: 400 },
      { name: "حادث متوسط", value: 300 },
      { name: "حادث خطير", value: 300 },
    ];
    const COLORS = ["#2563eb", "#16a34a", "#f59e0b"];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg shadow">
          <Line data={lineData} />
          <p className="text-center mt-2 text-sm">الرسم البياني لعدد الحوادث عبر الشهور</p>
        </div>
        <div className="border p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center mt-2 text-sm">توزيع أنواع الحوادث</p>
        </div>
      </div>
    );
  }
  ```

### ج. نموذج التصفية والفلترة
- **ملف:** `src/components/TrafficFilterForm.tsx`
  - استخدام `react-hook-form` مع التحقق بواسطة `zod` لجمع مدخلات المستخدم (مثل الفترة الزمنية، نوع الحادث، إلخ).
  - عند تقديم النموذج، يتم تمرير البيانات لتحديث الرسوم البيانية والخريطة.
  
  **مثال أولي:**
  ```tsx
  import { useForm } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";

  const filterSchema = z.object({
    startDate: z.string().min(1, "مطلوب"),
    endDate: z.string().min(1, "مطلوب"),
    severity: z.string().optional(),
  });

  type FilterForm = z.infer<typeof filterSchema>;

  export default function TrafficFilterForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FilterForm>({
      resolver: zodResolver(filterSchema),
    });

    const onSubmit = (data: FilterForm) => {
      // تحديث البيانات بناءً على مدخلات المستخدم
      console.log("تصفية البيانات: ", data);
      // يمكن هنا تفعيل إشعار باستخدام sonner لنجاح التطبيق
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded-lg shadow space-y-4">
        <div>
          <label className="block mb-1 text-sm">من:</label>
          <input type="date" {...register("startDate")} className="w-full border rounded p-2" />
          {errors.startDate && <span className="text-xs text-red-500">{errors.startDate.message}</span>}
        </div>
        <div>
          <label className="block mb-1 text-sm">إلى:</label>
          <input type="date" {...register("endDate")} className="w-full border rounded p-2" />
          {errors.endDate && <span className="text-xs text-red-500">{errors.endDate.message}</span>}
        </div>
        <div>
          <label className="block mb-1 text-sm">درجة الحادث:</label>
          <select {...register("severity")} className="w-full border rounded p-2">
            <option value="">اختر</option>
            <option value="light">خفيف</option>
            <option value="medium">متوسط</option>
            <option value="severe">خطير</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-primary-color text-white p-2 rounded">
          تطبيق الفلاتر
        </button>
      </form>
    );
  }
  ```

---

## 5. دمج المكونات التفاعلية والأنيميشن والإشعارات

### أ. تفعيل إشعارات sonner
- **ملف:** `src/components/ui/sonner.tsx`
  - تأكد من أن مكون الإشعارات يستخدم مكتبة `sonner` لعرض التوستات عند تغييرات الفلاتر أو في حال وقوع أخطاء.
  - يمكن تضمين هذا المكون في التخطيط العام أو في صفحة Dashboard.

### ب. استخدام مكونات Radix UI & react-resizable-panels
- **مكونات موجودة:**  
  - تأكد من أن الملفات الموجودة ضمن `src/components/ui/` (مثل `accordion.tsx`, `alert-dialog.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `tabs.tsx`) مدمجة بشكل صحيح داخل لوحة التحكم – على سبيل المثال، يمكن استخدامها في الشريط الجانبي لتقديم فلاتر قابلة للطي.
- **react-resizable-panels:**  
  - استخدمه لتقسيم الصفحة بين اللوحة الجانبية (الفلاتر) ومنطقة العرض (الخرائط والرسوم البيانية)، مع السماح للمستخدم بتغيير حجم الأقسام بسلاسة.

---

## 6. تحسين إعداد ESLint وإعدادات المسارات

### أ. تحديث إعدادات ESLint
- **ملف:** `eslint.config.mjs`
  - تأكد من تضمين إعدادات إضافية لـ `eslint-plugin-react-hooks` و `eslint-plugin-react-refresh` لتفادي مشاكل الاستخدام.
  - مثال (جزئي):
    ```js
    module.exports = {
      root: true,
      extends: ["next/core-web-vitals", "plugin:react/recommended"],
      plugins: ["react-hooks", "react-refresh"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    };
    ```

### ب. إعداد المسارات (Aliases)
- **ملف:** `tsconfig.json`
  - تأكد من إعداد خاصية `paths` لتحديد مسارات مختصرة مثل:
    ```json
    {
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@/*": ["src/*"]
        }
      }
    }
    ```

---

## 7. اعتبارات أخيرة واختبار الأداء

- **معالجة الأخطاء:**  
  - يتم تضمين معالجة أخطاء تحميل الخرائط والرسوم البيانية والتعامل مع مدخلات النماذج باستخدام try/catch أو استخدام مكتبات مثل Error Boundary.
- **تحسين الأداء:**  
  - من الأفضل التحميل الكسول (lazy-loading) لبعض المكونات الكبيرة (مثل الخرائط) لضمان أداء أفضل.
- **الاختبارات اليدوية:**  
  - اختبر كل صفحة للتأكد من عمل الفلاتر، الخرائط والرسوم البيانية بسلاسة.
- **تحسين الواجهة:**  
  - استخدام خطوط واضحة، تباعد مناسب، وألوان متوافقة مع الوضعين الفاتح والمظلم؛ تجنب استخدام مكتبات الأيقونات واستبدالها بنصوص أو رسومات بسيطة عند الحاجة.
  
---

## الخلاصة

- تم تحويل المشروع الحالي إلى Next.js مع الحفاظ على TypeScript والاعتماد على pnpm.
- إنشاء تخطيط عام يدعم اللغة العربية والاتجاه RTL مع تضمين الوضع المظلم/الفاتح عبر `next-themes`.
- إنشاء صفحة لوحة تحكم تفاعلية تشمل نموذج تصفية، خريطة تفاعلية باستخدام `react-leaflet` مع طبقة حرارة، ورسوم بيانية تفاعلية باستخدام `react-chartjs-2` و `recharts`.
- دمج مكونات واجهة المستخدم القائمة (Radix UI) وتطبيق تفاعلات سلسة باستخدام `framer-motion` و `react-resizable-panels`.
- تحديث إعدادات ESLint ومسارات التوصيل في `tsconfig.json` لضمان جودة الكود والتنقل السريع.
- تم تضمين معالجات الأخطاء، تحسين الأداء، والاهتمام بتجربة المستخدم باستخدام تركيبات حديثة تعتمد على مسافات ونصوص واضحة دون استخدام أي مكتبات للأيقونات.
``` 

**الخلاصة:**  
- تحويل المشروع إلى Next.js مع استخدام TypeScript وpnpm.  
- إعداد تخطيط HTML بـ `lang="ar"` و `dir="rtl" بالإضافة إلى دعم الوضع المظلم باستخدام next-themes.  
- إنشاء صفحة Dashboard تفاعلية تضم خرائط تفاعلية وبيانات رسوم بيانية مع نموذج تصفية بيانات باستخدام react-hook-form وzod.  
- دمج المكونات الجاهزة من Radix UI مع تحسينات في الأنيميشن باستخدام framer-motion وتغيير حجم اللوحات باستخدام react-resizable-panels.  
- تحديث إعدادات ESLint ومسارات TypeScript لضمان تنظيم الكود وجودته.  
- ضمان تجربة مستخدم متكاملة، حديثة، ومستجيبة دون الاعتماد على مكتبات الأيقونات الخارجية.
