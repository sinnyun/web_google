import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Grid, Maximize2 } from 'lucide-react';
import { PROJECTS } from '../data';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const projectIndex = PROJECTS.findIndex(p => p.id === id);
  const project = PROJECTS[projectIndex];
  
  // Handle case where project not found
  useEffect(() => {
    if (!project) {
      navigate('/work');
    }
  }, [project, navigate]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) return null;

  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(projectIndex - 1 + PROJECTS.length) % PROJECTS.length];

  return (
    <motion.div 
      className="bg-stone-950 min-h-screen text-stone-50 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Full Screen Hero */}
      <div className="relative w-full h-[80vh] md:h-screen">
        <motion.div 
          className="absolute inset-0"
          layoutId={`cover-${project.id}`}
        >
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-950 z-10" />
             <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 lg:p-24">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif leading-none mb-4">{project.title}</h1>
                    <div className="flex gap-6 text-sm md:text-base tracking-widest text-stone-400">
                        <span>{project.category}</span>
                        <span>—</span>
                        <span>{project.year}</span>
                    </div>
                </div>
                <div className="max-w-md text-stone-300 leading-relaxed">
                    <p>{project.description}</p>
                </div>
              </div>
          </motion.div>
        </div>
      </div>

      {/* Project Meta Grid */}
      <div className="px-6 md:px-12 lg:px-24 py-16 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
                <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Role</h3>
                <p className="text-lg">Lead Designer</p>
            </div>
            <div>
                <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Tools</h3>
                <p className="text-lg">Blender, React, Figma</p>
            </div>
            <div>
                <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Client</h3>
                <p className="text-lg">Internal Project</p>
            </div>
            <div>
                <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => <span key={tag} className="text-sm opacity-70">#{tag}</span>)}
                </div>
            </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="px-4 md:px-12 lg:px-24 py-24 space-y-12 md:space-y-24">
        {project.images.map((img, index) => (
            <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, viewport: { margin: "-100px" } }}
                className={`relative w-full ${index % 3 === 0 ? 'aspect-[16/9]' : index % 2 === 0 ? 'aspect-[4/5] md:w-2/3 mx-auto' : 'aspect-[3/2] ml-auto md:w-4/5'}`}
            >
                <img src={img} alt={`Detail ${index}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute bottom-4 right-4 text-xs text-white/50 tracking-widest">
                    IMAGE 0{index + 1}
                </div>
            </motion.div>
        ))}
      </div>

      {/* Thumbnail Navigation / Next Project */}
      <div className="mt-24 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[40vh] md:h-[50vh]">
            <Link to={`/project/${prevProject.id}`} className="relative group border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-stone-900 group-hover:bg-stone-800 transition-colors" />
                <img src={prevProject.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm group-hover:blur-0" />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
                    <span className="text-xs tracking-widest uppercase mb-4 opacity-70 group-hover:translate-y-2 transition-transform">Previous</span>
                    <h2 className="text-3xl md:text-5xl font-serif group-hover:-translate-y-2 transition-transform duration-300">{prevProject.title}</h2>
                </div>
            </Link>
            <Link to={`/project/${nextProject.id}`} className="relative group overflow-hidden">
                <div className="absolute inset-0 bg-stone-900 group-hover:bg-stone-800 transition-colors" />
                <img src={nextProject.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm group-hover:blur-0" />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
                    <span className="text-xs tracking-widest uppercase mb-4 opacity-70 group-hover:translate-y-2 transition-transform">Next Project</span>
                    <h2 className="text-3xl md:text-5xl font-serif group-hover:-translate-y-2 transition-transform duration-300">{nextProject.title}</h2>
                </div>
            </Link>
        </div>
      </div>
      
      {/* Quick Back to Work */}
      <div className="flex justify-center py-12">
         <Link to="/work" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-stone-400 transition-colors">
            <Grid size={16} /> Back to Index
         </Link>
      </div>

    </motion.div>
  );
};

export default ProjectDetail;
