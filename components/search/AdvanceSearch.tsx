'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { fetchAdvanceSearch } from '@/services/advanceSearchService';
import MovieCard from '../MovieCard';
import { genres } from '@/constants/genres';
import { languages } from '@/constants/languages';
import { sortOptions } from '@/constants/sortOptions';
import { initialFilterValues } from '@/constants/initialFilterValues';
import { PopularMovie } from '@/types/popularMoviesTypes';

const AdvanceSearch = () => {
    const [filters, setFilters] = useState(initialFilterValues);
    const [results, setResults] = useState<PopularMovie[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const handleSearch = async () => {
        setIsLoading(true)
        const response = await fetchAdvanceSearch(filters)
        setResults(response)
        setIsLoading(false)
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-6 rounded-lg shadow-lg">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
            >


                <div className='grid grid-cols-2 gap-4'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Sort By</legend>
                        <select
                            className="select w-full"
                            value={filters.sort_by}
                            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                        >
                            {sortOptions.map((item, index) =>
                                <option key={index} value={item.value}>{item.name}</option>
                            )}

                        </select>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Genre</legend>
                        <select
                            className="select w-full"
                            value={filters.with_genres}
                            onChange={(e) => handleFilterChange('with_genres', e.target.value)}
                        >
                            <option value="">All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Release Year</legend>
                        <input
                            type="number"
                            placeholder="Enter release year..."
                            className="input w-full"
                            value={filters.primary_release_year}
                            onChange={(e) => handleFilterChange('primary_release_year', e.target.value)}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Original Language</legend>
                        <select
                            className="select w-full"
                            value={filters.with_original_language}
                            onChange={(e) => handleFilterChange('with_original_language', e.target.value)}
                        >
                            <option value="">All Languages</option>
                            {languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Rating Range</legend>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="input w-1/2"
                                value={filters.vote_average_gte}
                                onChange={(e) => handleFilterChange('vote_average_gte', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="input w-1/2"
                                value={filters.vote_average_lte}
                                onChange={(e) => handleFilterChange('vote_average_lte', e.target.value)}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Runtime Range (Minutes)</legend>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="input w-1/2"
                                value={filters.with_runtime_gte}
                                onChange={(e) => handleFilterChange('with_runtime_gte', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="input w-1/2"
                                value={filters.with_runtime_lte}
                                onChange={(e) => handleFilterChange('with_runtime_lte', e.target.value)}
                            />
                        </div>
                    </fieldset>
                </div>


                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Keywords</legend>
                    <input
                        type="text"
                        placeholder="Enter keywords..."
                        className="input w-full"
                        value={filters.with_keywords}
                        onChange={(e) => handleFilterChange('with_keywords', e.target.value)}
                    />
                </fieldset>
                <button
                    onClick={handleSearch}
                    className="btn btn-primary w-full mt-6"
                    disabled={isLoading}
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </motion.div>
            {results.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                >
                    <h2 className="text-3xl font-bold mb-4 text-center   bg-linear-to-b from-violet-800 to-violet-400 bg-clip-text text-transparent">Search Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdvanceSearch;
