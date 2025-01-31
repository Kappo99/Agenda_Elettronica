import React from 'react';
import { MdClear } from 'react-icons/md';

interface IProps {
    value: string;
    onChange: (term: string) => void;
}

function SearchBar({ value, onChange }: IProps) {
    return (
        <div className='w-full min-w-80 flex items-center relative'>
            <input type='text' placeholder='Cerca...' className='w-full px-4 py-1 border border-gray-300 rounded-lg'
                value={value} onChange={(e) => onChange(e.target.value)} />
            {value !== '' && (
                <span className='absolute right-3 cursor-pointer' onClick={() => onChange('')}>
                    <MdClear size={20} />
                </span>
            )}
        </div>
    );
}

export default SearchBar;