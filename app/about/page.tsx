'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { BiSolidMessageSquareDetail } from 'react-icons/bi';
import { CgDarkMode } from 'react-icons/cg';
import { GrOptimize } from 'react-icons/gr';
import { MdOutlineAnimation, MdOutlineContentPasteSearch } from 'react-icons/md';
import { SiThemoviedatabase } from 'react-icons/si';

export default function WelcomePage() {
    const technologies = [
        { name: 'React 19', icon: '/icons/react.svg' },
        { name: 'Next.js 15', icon: '/icons/nextjs.svg' },
        { name: 'TypeScript', icon: '/icons/typescript.svg' },
        { name: 'Tailwind CSS', icon: '/icons/tailwindcss.svg' },
        { name: 'Daisy UI', icon: '/icons/daisy-ui.svg' },
        { name: 'Framer Motion', icon: '/icons/framer-motion.svg' },
    ];
    const features = [
        {
            title: 'Search Movies',
            description: 'Find movies by title, genre, or keyword effortlessly.',
            icon: <MdOutlineContentPasteSearch size={42} />,
        },
        {
            title: 'Dynamic Movie Details',
            description: 'Dive into detailed pages with synopses, ratings, and release dates.',
            icon: <BiSolidMessageSquareDetail size={42} />,
        },
        {
            title: 'TheMovieDB Integration',
            description: 'Powered by the reliable and rich TheMovieDB API.',
            icon: <SiThemoviedatabase size={42} />,
        },
        {
            title: 'Smooth Animations',
            description: 'Enjoy fluid and engaging transitions using Framer Motion.',
            icon: <MdOutlineAnimation size={42} />,
        },
        {
            title: 'Dark & Light Modes',
            description: 'Automatic theme adjustment for your preference.',
            icon: <CgDarkMode size={42} />,
        },
        {
            title: 'Optimized Performance',
            description: 'Next.js ensures fast loading and server-side rendering.',
            icon: <GrOptimize size={42} />,
        },
    ]

    return (
        <div className="flex flex-col items-center justify-center p-10  text-white">
            {/* Header Section */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center justify-center mb-10">
                    <label className="swap swap-flip text-5xl">
                        <input type="checkbox" />
                        <div className="swap-on">😈</div>
                        <div className="swap-off">😇</div>
                    </label>
                    <h1 className="text-5xl font-bold">Hello there I&#39;m Mohammad</h1>
                </div>
                <h4 className="text-3xl font-bold mb-4">🎬 Welcome to Movie App!</h4>

                <p className="text-lg max-w-2xl mx-auto">
                    Discover movies, search for your favorites, and explore details with ease! Powered by{' '}
                    <span className="font-bold">TheMovieDB API</span>, featuring beautiful animations, light/dark themes, and an intuitive user experience.
                </p>
            </motion.div>

            {/* Features Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 my-12">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="card  text-gray-800 shadow-lg rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <div className="stats shadow">
                            <div className="stat">
                                <div className="stat-title">{feature.title}</div>
                                <div className="stat-value text-sm">{feature.description}</div>
                                <div className="stat-figure text-secondary">
                                    {feature.icon}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Technologies Section */}
            <div className=" bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-6">
                    {technologies.map((tech, index) => (
                        <motion.div
                            key={index}
                            data-tip={tech.name}
                            className="tooltip  tooltip-top"
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Image src={tech.icon} alt={tech.name} width={40} height={40} unoptimized={process.env.NODE_ENV === 'development'}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
