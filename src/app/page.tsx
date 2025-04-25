import Image from "next/image";
import SideNav from "@/components/SideNav";

export default function Home() {

  const projects = [
    {
      id: 1,
      name: "Finance Dashboard",
      image: "https://marketplace.canva.com/EAFSv6o6beQ/2/0/1600w/canva-red-bold-finance-youtube-thumbnail-vGSnQGShz3c.jpg",
    },
    {
      id: 2,
      name: "Marketing Strategy",
      image: "https://i.ytimg.com/vi/AiF5JNrRSUI/maxresdefault.jpg",
    },
    {
      id: 3,
      name: "Sales Analytics",
      image: "https://marketplace.canva.com/EAEqfS4X0Xw/1/0/1600w/canva-most-attractive-youtube-thumbnail-wK95f3XNRaM.jpg",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-10">
          {/* Hero Section */}
          <section className="mb-16">
          
            <div className="flex flex-col items-center text-center mb-20 mt-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Video Editing Made Simple</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">Create stunning videos with our powerful yet easy-to-use editing tools. Perfect for beginners and professionals alike.</p>
              <div className="flex gap-4">
                <a
                  className="rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
                  href="/editor"
                >
                  Start Editing
                </a>
                <a
                  className="rounded-full border border-border px-6 py-3 font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                  href="/templates"
                >
                  Browse Templates
                </a>
              </div>
            </div>

            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl mb-20">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 z-10" style={{
                backgroundImage: `url('https://static.clideo.com/assets/images/editor/preview-desktop@2x.avif')`,
                backgroundSize: 'cover',
              }} ></div>
            </div>
            
          </section>

          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Powerful Editing Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="m22 8-6 4 6 4V8Z"/>
                    <rect x="2" y="6" width="14" height="12" rx="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Video Trimming</h3>
                <p className="text-muted-foreground">Precisely trim and cut your videos with frame-by-frame accuracy.</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8"/>
                    <path d="M8 12h8"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Effects Library</h3>
                <p className="text-muted-foreground">Add stunning visual effects and transitions from our extensive library.</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Audio Editing</h3>
                <p className="text-muted-foreground">Fine-tune your audio with our advanced sound editing capabilities.</p>
              </div>
            </div>
          </section>

          {/* Recent Projects Section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Recent Projects</h2>
              <a href="/projects" className="text-primary hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
  <div
    key={project.id}
    className="group relative rounded-xl overflow-hidden aspect-video bg-muted"
    style={{
      backgroundImage: `url('${project.image}')`,
      backgroundSize: 'cover',
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
      <div className="p-4 w-full">
        <h3 className="text-white font-medium truncate">{project.name}</h3>
        <p className="text-white/80 text-sm">Last edited 2 days ago</p>
      </div>
    </div>
  </div>
))}
            </div>
          </section>

          {/* Testimonials */}
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Content Creator</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"This video editor has completely transformed my workflow. The intuitive interface and powerful features make editing a breeze."</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">Filmmaker</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"I've used many video editors, but this one stands out for its performance and feature set. It's become an essential tool in my creative process."</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
    // </div>
  );
}
