'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProjectsSection = () => {
    const projects = [
        {
            title: "Nippon Homes",
            description: "An English Zillow for Japan. ~8k monthly users.",
            technologies: ["Supabase", "PostgreSQL", "Vercel", "AWS S3", "AWS API Gateway", "Next.js", "Scrapy", "React", "PyTorch", "PostGIS",],
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
            link: "https://nipponhomes.com",
            image: "/nipponhomes.png"
        },
        // {
        //     title: "Notarix - EthGlobal Hackathon Winner",
        //     description: "A secure, real-world, ID-verified notarization platform built during the 2024 EthGlobal Hackathon San Francisco. Won the Build with USDC/EURC award ($1,500). The platform streamlines digital notarization while maintaining strong user privacy and security.",
        //     technologies: ["Next.js", "Shadcn UI", "Sign Protocol", "Polygon", "Synaps", "Privado ID", "React"],
        //     bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        //     link: "https://ethglobal.com/showcase/notarix-hyb0a",
        //     image: "/notarix.jpg"

        // },
          {
            "title": "Semantic Video Search (Local TwelveLabs Clone)",
            "description": "1st place winner in AMD / Liquid AI's SF Hackathon. Given a search query, the system will find relevant clips in your video catalog.",
            "technologies": ["Streamlit", "LiquidAI LFM2-VL", "Sentence Transformers", "PyTorch", "OpenCV", "yt-dlp", "FFmpeg", "Python",  "Recommendation Systems"],
            "bgColor": "bg-violet-50 dark:bg-violet-900/20",
            "link": "https://github.com/angelotc/lfm2-vl-video-search",
            "image": "/video-search.png"
        },
        // {
        //     title: "Stream Pal AI",
        //     description: "A streamer companion tool that listens to both the streamer's voice and chat, providing interactive responses. The application integrates real-time speech-to-text processing with chat interaction and AI-powered responses.",
        //     technologies: ["Next.js", "Deepgram", "Twitch EventSub API", "OpenAI", "Supabase", "PostgreSQL"],
        //     bgColor: "bg-purple-50 dark:bg-purple-900/20",
        //     link: "https://github.com/angelotc/stream-pal-ai/blob/main/public/stream-pal-architecture.png",
        //     image: "/stream-pal-architecture.png"
        // },
        {
            title: "Materials Application Domain",
            description: "Maintainer and contributor for an uncertainty quantification tool for materials machine learning datasets. Implemented isolation forests, Mahalanobis distances, nested cross validation, and regressions for small datasets.",
            technologies: ["Machine Learning", "Python", "Isolation Forests", "Cross Validation", "Supervised Learning", "Unsupervised Learning", "Clustering"],
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            link: "https://github.com/leschultz/materials_application_domain_machine_learning"

        },
                // {
        //   title: "Short-term Rental / Mid-term Rental Knowledge Bot",
        //   description: "A solo project leveraging OpenAI API, Langchain, and Pinecone for retrieval-augmented generation (RAG) models. Trained on 3 real-estate ebooks specific to the STR / MTR domains.",
        //   technologies: ["OpenAI API", "Langchain", "Pinecone", "RAG"],
        // bgColor: "bg-purple-50 dark:bg-purple-900/20",
        //   link: "https://github.com/yourusername/project2"
        // },
    ];

    return (
        <section className="container mx-auto px-4 py-8 fade-in-section">
            <h2 className="text-2xl font-bold mb-6 font-geist-sans">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <Link
                        href={project.link}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group font-geist-sans"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg 
                             transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full
                             hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400">
                            <div className={`h-40 relative overflow-hidden ${project.bgColor}`}>
                                {project.image ? (
                                    <>
                                        {/* Default title with black background */}
                                        <div className="absolute inset-0 bg-white dark:bg-gray-800 flex items-center justify-center 
                                                      group-hover:opacity-0 transition-all duration-300 z-10">
                                            <h3 className="text-xl font-semibold px-4 text-center text-gray-900 dark:text-white">
                                                {project.title}
                                            </h3>
                                        </div>
                                        
                                        {/* Image and hover state */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <h3 className="text-xl font-semibold px-4 text-center text-white">
                                                    View Project →
                                                </h3>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <h3 className="text-xl font-semibold px-4 text-center">{project.title}</h3>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default ProjectsSection; 