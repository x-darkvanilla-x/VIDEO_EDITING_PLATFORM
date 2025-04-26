'use client';

import { useState } from 'react';
import { Play, Star, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import SideNav from '@/components/SideNav';

interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: string;
  uses: number;
  rating: number;
}

const templates: Template[] = [
  {
    id: 'social-story',
    title: 'Social Media Story',
    description: 'Perfect for Instagram and Facebook stories with dynamic transitions',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%23553C9A"/><text x="160" y="90" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Social Story Template</text></svg>',
    category: 'Social Media',
    duration: '30s',
    uses: 12500,
    rating: 4.8
  },
  {
    id: 'business-presentation',
    title: 'Business Presentation',
    description: 'Professional template for corporate presentations and pitches',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%234A5568"/><text x="160" y="90" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Business Template</text></svg>',
    category: 'Business',
    duration: '2m',
    uses: 8300,
    rating: 4.6
  },
  {
    id: 'tutorial',
    title: 'Educational Tutorial',
    description: 'Step-by-step tutorial template with annotation features',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%232D3748"/><text x="160" y="90" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Tutorial Template</text></svg>',
    category: 'Education',
    duration: '5m',
    uses: 6200,
    rating: 4.7
  },
  {
    id: 'product-showcase',
    title: 'Product Showcase',
    description: 'Highlight your products with this elegant showcase template',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%23718096"/><text x="160" y="90" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">Product Template</text></svg>',
    category: 'Marketing',
    duration: '1m',
    uses: 9100,
    rating: 4.5
  }
];

const categories = ['All', 'Social Media', 'Business', 'Education', 'Marketing'];

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">Video Templates</h1>
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search templates..."
              className="flex-1 px-4 py-2 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video relative group">
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      href={`/editor/edit?template=${template.id}`}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      <Play size={18} />
                      Use Template
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
                  <p className="text-muted-foreground mb-4">{template.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {template.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {template.uses.toLocaleString()} uses
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500" />
                      {template.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}