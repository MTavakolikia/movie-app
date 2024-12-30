
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBox() {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (search.trim() === '') {
            router.push(`/`);
        } else {
            router.push(`/search/${search.trim()}`);
        }

    };
    return (
        <form
            className='flex justify-between items-center input input-bordered px-5 max-w-6xl mx-auto relative h-10'
            onSubmit={handleSubmit}
        >
            <div className="form-control">
                <input type="text" onChange={(e) => setSearch(e.target.value)}
                    value={search} placeholder="Search keywords..." className=" w-32 md:w-auto text-sm " />
            </div>
            <button
                className='text-purple-800 cursor-pointer absolute right-2 disabled:text-gray-400'
                disabled={search === ''}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </form>
    );
}