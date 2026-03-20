import { Course } from '@/types';

interface CourseTableProps {
    courses: Course[];
}

export default function CourseTable({ courses }: CourseTableProps) {
    return (
        <div className="table-fixed w-full h-full">
            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="px-6 py-2 text-left text-xs text-gray-500 font-semibold whitespace-nowrap uppercase">Course ID</th>
                        <th className="px-4 py-2 text-left text-xs text-gray-500 font-semibold whitespace-nowrap uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs text-gray-500 font-semibold whitespace-nowrap uppercase">Code</th>
                        <th className="px-4 py-2 text-left text-xs text-gray-500 font-semibold whitespace-nowrap uppercase">Department</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={course.course_id} className={`border-t border-t-gray-300 ${index % 2 === 0 ? 'bg-stone-100' : ''}`}>
                            <td className="px-6 py-2 text-sm">{course.course_id}</td>
                            <td className="px-4 py-2 text-sm font-semibold">{course.name}</td>
                            <td className="px-4 py-2 text-sm">{course.code || '-'}</td>
                            <td className="px-4 py-2 text-sm">{course.department?.name || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
