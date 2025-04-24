import Link from 'next/link';
import { Home, Video, FolderOpen, Settings, LogOut, HomeIcon } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon, label, href, active = false }: NavItemProps) => {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function SideNav() {
  return (
    <div className="h-screen w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">VideoEdit</h1>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem 
          icon={<Home size={20} />} 
          label="Dashboard" 
          href="/" 
          active={true} 
        />
        <NavItem 
          icon={<Video size={20} />} 
          label="Editor" 
          href="/editor" 
        />
        <NavItem 
          icon={<FolderOpen size={20} />} 
          label="Projects" 
          href="/projects" 
        />
        <NavItem 
          icon={<HomeIcon size={20} />} 
          label="Templates" 
          href="/templates" 
        />
        <NavItem 
          icon={<Settings size={20} />} 
          label="Settings" 
          href="/settings" 
        />
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <NavItem 
          icon={<LogOut size={20} />} 
          label="Sign Out" 
          href="/signout" 
        />
      </div>
    </div>
  );
}