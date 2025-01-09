'use client';

import { motion } from 'framer-motion';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-6xl font-bold text-error mb-4">Oops!</h1>
                <p className="text-2xl text-base-content mb-8">
                    Something went wrong. Please try again.
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={reset}
                    className="btn btn-primary"
                >
                    Try Again
                </motion.button>
            </motion.div>

            {/* Optional: Display error details for debugging */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 bg-base-100 p-6 rounded-lg shadow-lg"
            >
                <h2 className="text-xl font-semibold text-error mb-4">Error Details</h2>
                <pre className="text-sm text-base-content whitespace-pre-wrap">
                    {error.message}
                </pre>
                {error.digest && (
                    <p className="text-sm text-base-content mt-2">Digest: {error.digest}</p>
                )}
            </motion.div>
        </div>
    );
}