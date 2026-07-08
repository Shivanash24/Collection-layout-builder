import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <TopHeader />
        <main style={{ flex: 1, marginTop: '64px', padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
