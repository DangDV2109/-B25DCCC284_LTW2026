import React from 'react';
import StudentItem from './StudentItem';

const StudentList = ({ students, onDeleteStudent }) => {
    return (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                    <tr>
                        <th className="px-4 py-3 text-center">ID</th>
                        <th className="px-4 py-3">Họ và Tên</th>
                        <th className="px-4 py-3 text-center">Lớp</th>
                        <th className="px-4 py-3 text-center">Điểm số</th>
                        <th className="px-4 py-3 text-center">Đánh giá</th>
                        <th className="px-4 py-3 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <StudentItem
                                key={student.id}
                                student={student}
                                onDeleteStudent={onDeleteStudent}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-6 text-gray-500">
                                Không có sinh viên nào trong danh sách.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;