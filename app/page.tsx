import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import ScrollToTop from './components/ScrollToTop';
import HeaderSection from './components/HeaderSection';
import AboutSection from './components/AboutSection';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ScrollToTop />
      {/* Header Section */}
      <HeaderSection />

      {/* About Section */}
      <AboutSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Experience Section */}
      <ExperienceSection />

    </div>
  );
}