import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface IProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

function PaginationControls({ page, totalPages, onPageChange }: IProps) {
    const getPages = () => {
        const pages = [];
        const startPage = Math.max(1, page - 1); // Dal primo numero alla pagina - 1
        const endPage = Math.min(totalPages, page + 1); // Fino all'ultima pagina o pagina + 1

        if (page > 2) {
            pages.push(1); // Primo numero
            if (startPage > 2) {
                pages.push('...'); // Puntini prima
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (page < totalPages - 1) {
            if (endPage < totalPages - 1) {
                pages.push('...'); // Puntini dopo
            }
            pages.push(totalPages); // Ultimo numero
        }

        return pages;
    };

    return (
        <div className="w-full flex justify-end mt-6">
            <div className="flex items-center gap-2">
                <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                    <MdChevronLeft size={28} />
                </button>

                {getPages().map((p, index) => (
                    <button
                        key={index}
                        onClick={() => typeof p === 'number' && onPageChange(p)}
                        disabled={p === page || p === '...'}
                        className={`px-2 py-1 ${p === page ? 'font-bold text-agenda_primary-dark' : ''}`}
                    >
                        {p}
                    </button>
                ))}

                <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
                    <MdChevronRight size={28} />
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;