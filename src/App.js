import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { useStore } from './store';
import { formatDate, formatRelativeTime } from './utils/time';

import {
  PantherIcon,
  HomeIcon,
  PipelineIcon,
  TemplateIcon,
  ExecutionIcon,
  ConnectionIcon,
  VariableIcon,
  AnalyticsIcon,
  SettingsIcon,
  SearchIcon,
  SunIcon,
  BellIcon,
  CheckIcon,
} from './icons';

const NAV_ITEMS = [
  { label: 'Home', icon: HomeIcon, active: true },
  { label: 'Pipelines', icon: PipelineIcon },
  { label: 'Templates', icon: TemplateIcon },
  { label: 'Executions', icon: ExecutionIcon },
  { label: 'Connections', icon: ConnectionIcon },
  { label: 'Variables', icon: VariableIcon },
  { label: 'Analytics', icon: AnalyticsIcon },
  { label: 'Settings', icon: SettingsIcon },
];

function App() {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const lastModified = useStore((state) => state.lastModified);
  const executions = useStore((state) => state.executions);
  const newPipeline = useStore((state) => state.newPipeline);

  const status = useStore((state) => state.getPipelineStatus());

  const handleNewPipeline = () => {
    const hasWork = nodes.length > 0 || edges.length > 0;
    if (hasWork) {
      const confirmed = window.confirm(
        'Start a new pipeline? Unsaved changes on the current canvas will be lost.'
      );
      if (!confirmed) return;
    }

    const name = window.prompt('Pipeline name:', 'Untitled Pipeline');
    if (name === null) return;
    newPipeline(name);
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar-panel">
        <div className="brand-block">
          <div className="brand-mark">
            <PantherIcon size={22} />
          </div>
          <div>
            <p className="brand-name">PINK PANTHER</p>
            <p className="brand-subtitle">AI PIPELINE BUILDER</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              className={`sidebar-link${active ? ' is-active' : ''}`}
              href="#workspace"
            >
              <Icon />
              {label}
            </a>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="sidebar-card__eyebrow">Pro Plan</p>
          <h2>Unlock advanced features</h2>
          <p>Get unlimited pipelines, priority execution, and team collaboration.</p>
          <button className="sidebar-card__btn" type="button">Upgrade Now</button>
        </div>

        <div className="sidebar-footer">
          <a href="#workspace">Docs</a>
          <a href="#workspace">Help</a>
          <a href="#workspace">Logout</a>
        </div>
      </aside>

      <div className="app-shell" id="workspace">
        <div className="app-topbar">
          <div className="topbar-search">
            <SearchIcon />
            Search...
          </div>
          <button className="topbar-icon-btn" type="button" aria-label="Toggle theme">
            <SunIcon />
          </button>
          <button className="topbar-icon-btn" type="button" aria-label="Notifications">
            <BellIcon />
            <span className="topbar-badge">3</span>
          </button>
          <div className="topbar-user">
            <div className="topbar-user__info">
              <p className="topbar-user__name">Developer Intern</p>
              <p className="topbar-user__plan">Basic Plan</p>
            </div>
            <div className="topbar-user__avatar">DI</div>
          </div>
        </div>

        <header className="app-hero">
          <p className="app-kicker">Welcome back, Developer! 👋</p>
          <h1>Pink Panther AI Pipeline Builder</h1>
          <p className="app-summary">
            Design, connect, and automate intelligent workflows.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" type="button" onClick={handleNewPipeline}>
              + New Pipeline
            </button>
            <button className="btn-outline" type="button">Browse Templates</button>
          </div>
        </header>

        <PipelineToolbar />
       
        <div className="workspace-layout">
          <div className="workspace-main">
            <PipelineUI />
          </div>

          <aside className="workspace-rail" aria-label="Pipeline overview">
            <div className="rail-card">
              <p className="rail-card__title">Pipeline Overview</p>
              <div className="rail-stat"><span>Total Nodes</span><strong>{nodes.length}</strong></div>
              <div className="rail-stat"><span>Connections</span><strong>{edges.length}</strong></div>
              <div className="rail-stat">
                <span>Last Modified</span>
                <strong>{formatDate(lastModified)}</strong>
              </div>
              <div className="rail-stat">
                <span>Status</span>
                <strong className="rail-badge">{status}</strong>
              </div>
            </div>

            <div className="rail-card">
              <p className="rail-card__title">Recent Executions</p>
              {executions.length === 0 ? (
                <p className="rail-empty">No runs yet. Click Run Pipeline to execute.</p>
              ) : (
                <div className="rail-list">
                  {executions.map(({ id, ranAt, status: execStatus }) => (
                    <div className="rail-list__item" key={id}>
                      <span>Execution #{id}</span>
                      <div className={`rail-list__status${execStatus === 'Completed' ? '' : ' rail-list__status--warn'}`}>
                        {execStatus === 'Completed' && <CheckIcon />}
                        {execStatus}
                        <span className="rail-list__time">{formatRelativeTime(ranAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
            </div>
            
          </aside>
        </div>
      </div>
    </div>
    
  );
  
}

export default App;
