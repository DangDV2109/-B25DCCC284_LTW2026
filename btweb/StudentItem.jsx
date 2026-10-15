import React from 'react';

const StudentItem = ({ student, onDeleteStudent }) => {
    const { id, name, score, class: className } = student;

    const isExcellent = score >= 8;
    const isFailed = score < 5;

    return (
        <tr className="border-b hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-center">{id}</td>
            <td className="px-4 py-3 font-medium text-gray-900">{name}</td>
            <td className="px-4 py-3 text-center">{className}</td>
            <td className="px-4 py-3 text-center font-semibold">
                {score}
            </td>
            <td className="px-4 py-3 text-center">
                {isExcellent && (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Giỏi
                    </span>
                )}
                {isFailed && (
                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                        Trượt
                    </span>
                )}
                {!isExcellent && !isFailed && (
                    <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                        Trung bình / Khá
                    </span>
                )}
            </td>
            <td className="px-4 py-3 text-center">
                <button
                    onClick={() => onDeleteStudent(id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                    Xóa
                </button>
            </td>
        </tr>
    );
};

export default StudentItem;