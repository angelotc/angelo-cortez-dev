'use client';

import React from 'react';

const ExperienceSection = () => {
  const experiences = [
    {
      company: "8x8",
      role: "Senior Software Engineer",
      period: "Present",
      description: "Building UCaaS and CCaaS automations for SMBs and enterprises",
      highlights: [
        "Custom integrations, IVR's, and voice agents  for contact centers",
        "Collaborated on custom routing configurations for enterprise customers",
        "Improved customer experience through automation"
      ]
    },
    {
      company: "Epic",
      role: "Solutions Engineer",
      period: "3 years",
      description: "Development on risk of sepsis model for hospitals",
      highlights: [
        "Worked on healthcare analytics",
        "Wrote MUMPS code to solve healthcare use-cases",
        "Developed data quality checks for risk prediction models",
        "Collaborated with healthcare providers"
      ]
    }
  ];

  return (
    <section className="container mx-auto px-4 py-8 fade-in-section">
      <h2 className="text-2xl font-bold mb-6">Experience</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{exp.company}</h3>
                <span className="text-sm text-gray-500">{exp.period}</span>
              </div>
              <h4 className="text-gray-600 dark:text-gray-400 mb-2">{exp.role}</h4>
              <p className="mb-4">{exp.description}</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {exp.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection; 