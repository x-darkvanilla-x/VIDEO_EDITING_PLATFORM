'use client';

import { useState } from 'react';
import { Play, Trash, Copy, Clock, Edit } from 'lucide-react';
import Link from 'next/link';
import SideNav from '@/components/SideNav';

interface Project {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  createdAt: string;
  lastModified: string;
}

// Sample projects data (replace with actual data from your backend)
const sampleProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Marketing Campaign Video',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%23553C9A"/><text x="160" y="90" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Marketing Campaign</text></svg>',
    duration: '2:30',
    createdAt: '2024-02-15',
    lastModified: '2024-02-16'
  },
  {
    id: 'project-2',
    title: 'Product Demo',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%234A5568"/><text x="160" y="90" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Product Demo</text></svg>',
    duration: '1:45',
    createdAt: '2024-02-14',
    lastModified: '2024-02-14'
  }
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>(sampleProjects);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const handleDuplicateProject = (project: Project) => {
    const newProject = {
      ...project,
      id: `project-${Date.now()}`,
      title: `${project.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="flex h-screen bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Projects</h1>
            <Link
              href="/editor"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Play size={18} />
              New Project
            </Link>
          </div>
          
          {/* Search bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video relative group">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Link
                      href={`/editor?project=${project.id}`}
                      className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors"
                      title="Edit project"
                    >
                      <Edit size={20} />
                    </Link>
                    <button
                      onClick={() => handleDuplicateProject(project)}
                      className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors"
                      title="Duplicate project"
                    >
                      <Copy size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="bg-destructive text-destructive-foreground p-3 rounded-full hover:bg-destructive/90 transition-colors"
                      title="Delete project"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {project.duration}
                    </div>
                    <div>
                      Created: {project.createdAt}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}