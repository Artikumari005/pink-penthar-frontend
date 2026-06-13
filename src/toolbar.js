import { DraggableNode } from './draggableNode';

const NODES = [
  { type: 'customInput', label: 'Input' },
  { type: 'llm', label: 'LLM' },
  { type: 'customOutput', label: 'Output' },
  { type: 'text', label: 'Text' },
  { type: 'api', label: 'API' },
  { type: 'email', label: 'Email' },
  { type: 'filter', label: 'Filter' },
  { type: 'database', label: 'Database' },
  { type: 'delay', label: 'Delay' },
];

export const PipelineToolbar = () => (
  <div className="toolbar-panel">
    <div className="toolbar-grid">
      {NODES.map(({ type, label }) => (
        <DraggableNode key={type} type={type} label={label} />
      ))}
    </div>
  </div>
);
