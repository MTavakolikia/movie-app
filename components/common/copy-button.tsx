"use client";
import { useState } from 'react';
import { FaCopy } from "react-icons/fa";

export default function CopyButton({ text }: { text: string }) {
    const [copyMessage, setCopyMessage] = useState("");

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyMessage("Copied to your clipboard");
            setTimeout(() => setCopyMessage(""), 2000);
        });
    };

    return (
        <>
            <FaCopy
                className="text-xl ml-2 cursor-pointer hover:text-primary transition-transform duration-300 transform hover:scale-125"
                onClick={() => handleCopy(text)}
            />
            {copyMessage && (
                <div className="toast toast-end">
                    <div className="alert alert-success">
                        <span> {copyMessage}.</span>
                    </div>
                </div>
            )}
        </>
    );
}