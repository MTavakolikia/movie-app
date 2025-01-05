"use client";
import { FaMapSigns, FaCopy } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill, BsGlobeAmericas } from "react-icons/bs";
import { motion } from "framer-motion";
import { useState } from "react";

const ContactPage = () => {
    const [copyMessage, setCopyMessage] = useState("");

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyMessage("Copied in your clipboard");
            setTimeout(() => setCopyMessage(""), 2000);
        });
    };

    const contactTab = [
        {
            icon: <MdEmail className="text-4xl" />,
            title: "Email Address",
            description: `mtwebdev66@gmail.com`,
            showCopy: true
        },
        {
            icon: <BsFillTelephoneFill className="text-4xl" />,
            title: "Contact Number",
            description: `+98 912 804 85 79`,
            showCopy: true
        }, {
            icon: <FaMapSigns className="text-4xl" />,
            title: "Address",
            description: `Tehran`,
            showCopy: false
        },

        {
            icon: <BsGlobeAmericas className="text-4xl" />,
            title: "Website",
            description: "mtwebdev.ir",
            showCopy: true
        },
    ];

    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center p-6">
            <motion.h1
                className="text-4xl font-bold text-center text-primary mb-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Contact Me
            </motion.h1>

            <div className="container mx-auto flex flex-wrap shadow-2xl  rounded-md p-5">
                <div className="lg:w-1/2 w-full p-4">
                    <div className="relative aspect-w-16 h-[50vw] lg:h-full aspect-h-9">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207344.07543406743!2d51.18284440493186!3d35.70774021774471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491ff3dcd9%3A0xf0b3697c567024bc!2sTehran%2C%20Tehran%20Province%2C%20Iran!5e0!3m2!1sen!2sde!4v1735908935807!5m2!1sen!2sde"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>


                {copyMessage && (
                    <div className="toast toast-end">
                        <div className="alert alert-success">
                            <span> {copyMessage}.</span>
                        </div>
                    </div>
                )}
                <div className="lg:w-1/2 w-full p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {contactTab.map((item, index) => (
                            <div key={index} className="card w-full shadow-xl h-auto">
                                <div className="card-body items-center flex-grow-0 text-center">
                                    <h2 className="card-title">{item.icon}</h2>
                                    <p className="text-lg font-bold my-3">{item.title}</p>
                                    <div className="flex items-center justify-center">
                                        <p className="text-lg font-semibold">{item.description}</p>
                                        {item.showCopy &&
                                            <FaCopy
                                                className="text-xl ml-2 cursor-pointer hover:text-primary transition-transform duration-300 transform hover:scale-125"
                                                onClick={() => handleCopy(item.description)}
                                            />
                                        }
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;