// import { getCourses } from "@/actions/course-actions";
// import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
// import { StatusBadge } from "@/components/admin/common/StatusBadge";
// import { CourseTableActions } from "./_components/course-table-actions"; // Component chứa nút Edit/Delete (Client Component)
// import { BookOpen, Layers } from "lucide-react";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow
// } from "@/components/ui/table";

// // Server Component - Async mặc định
// export default async function CoursesPage() {
//   // 1. Fetch data từ Action (Logic tách biệt)
//   const { data: courses, error } = await getCourses();

//   if (error) return <div>Error loading courses</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* 2. Sử dụng Header chung */}
//       <AdminPageHeader
//         title="Quản lý Khóa học"
//         description="Quản lý các khóa học, chương trình đào tạo và tài liệu đính kèm."
//         icon={BookOpen}
//         action={{
//           label: "Tạo khóa học mới",
//           href: "/admin/courses/create",
//           icon: Layers
//         }}
//       />

//       {/* 3. Render Table (Có thể tách ra CourseTable component nếu muốn gọn hơn nữa) */}
//       <div className="border rounded-md shadow-sm bg-white">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-slate-50">
//               <TableHead>Tên khóa học</TableHead>
//               <TableHead>Trạng thái</TableHead>
//               <TableHead>Giá</TableHead>
//               <TableHead className="text-right">Hành động</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {courses?.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={4} className="h-24 text-center text-slate-500">
//                   Chưa có khóa học nào. Hãy tạo mới!
//                 </TableCell>
//               </TableRow>
//             ) : (
//               courses?.map((course) => (
//                 <TableRow key={course.id}>
//                   <TableCell className="font-medium">
//                     <div className="flex flex-col">
//                       <span>{course.title}</span>
//                       <span className="text-xs text-slate-400">ID: {course.id.slice(0, 8)}...</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {/* Sử dụng StatusBadge chung */}
//                     <StatusBadge
//                       status={course.is_published || false}
//                       labels={{ 'true': 'Đang bán', 'false': 'Nháp' }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {course.price === 0
//                       ? <span className="text-green-600 font-semibold">Miễn phí</span>
//                       : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price || 0)
//                     }
//                   </TableCell>
//                   <TableCell className="text-right">
//                     {/* Client Component xử lý sự kiện Delete/Edit */}
//                     <CourseTableActions course={course} />
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }

import { getCourses } from "@/actions/course-actions";
import CourseTable from "@/components/admin/courses/CourseTable";

type SearchParams = Promise<{
  page?: string;
  query?: string;
}>;

export default async function CoursesPage(props: {
  searchParams: SearchParams 
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  
  // Gọi hàm getCourses đã refactor ở bước trước (trả về data + count)
  const { data, count, error } = await getCourses(page, pageSize, searchParams.query);

  if (error) return <div>Lỗi tải dữ liệu</div>;

  return (
    <div className="p-6">
       <div className="flex justify-between mb-4">
         <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
         {/* Button tạo mới, Search box đặt ở đây */}
       </div>
       
       <CourseTable 
         data={data || []} 
         totalCount={count || 0} 
         currentPage={page} 
         pageSize={pageSize} 
       />
    </div>
  );
}