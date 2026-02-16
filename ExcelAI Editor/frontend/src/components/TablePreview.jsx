import React from 'react';

const TablePreview = ({ data }) => {
    if (!data || !data.columns) return null;

    return (
        <div className="relative w-full h-full">
            <table className="w-full text-sm text-left text-zinc-600">
                <thead className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50/80 backdrop-blur sticky top-0 z-10">
                    <tr>
                        {data.columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 font-medium border-b border-zinc-100 first:pl-8 last:pr-8">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {data.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="bg-white hover:bg-zinc-50/50 transition-colors">
                            {data.columns.map((col, colIdx) => (
                                <td key={colIdx} className="px-6 py-3.5 whitespace-nowrap text-zinc-700 first:pl-8 last:pr-8 border-r border-transparent hover:border-zinc-100 first:font-medium first:text-zinc-900">
                                    {row[col] !== null ? String(row[col]) : ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="sticky bottom-0 bg-white/80 backdrop-blur border-t border-zinc-100 py-2.5 px-6 text-xs font-medium text-zinc-400 flex justify-between items-center">
                <span>Showing first 10 rows</span>
                <span>Total: {data.total_rows} rows</span>
            </div>
        </div>
    );
};

export default TablePreview;
