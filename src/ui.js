import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, useReactFlow, ReactFlowProvider } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ApiNode } from './nodes/apiNode';
import { EmailNode } from './nodes/emailNode';
import { FilterNode } from './nodes/filterNode';
import { DatabaseNode } from './nodes/databaseNode';
import { DelayNode } from './nodes/delayNode';
import { SubmitButton } from './submit';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: ApiNode,
  email: EmailNode,
  filter: FilterNode,
  database: DatabaseNode,
  delay: DelayNode,
};

const headerSelector = (state) => ({
  pipelineName: state.pipelineName,
  isSaved: state.isSaved,
  savePipeline: state.savePipeline,
});

const CanvasHeader = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [zoom, setZoom] = useState(100);
  const { pipelineName, isSaved, savePipeline } = useStore(headerSelector, shallow);

  const handleZoomIn = () => {
    zoomIn();
    setZoom((z) => Math.min(z + 10, 200));
  };

  const handleZoomOut = () => {
    zoomOut();
    setZoom((z) => Math.max(z - 10, 50));
  };

  const handleFit = () => {
    fitView({ padding: 0.2 });
    setZoom(100);
  };

  const handleSave = () => {
    savePipeline();
  };

  return (
    <div className="canvas-header">
      <div className="canvas-header__left">
        <h2 className="canvas-header__title">{pipelineName}</h2>
        <span className={`saved-badge${isSaved ? '' : ' saved-badge--unsaved'}`}>
          <span className="saved-badge__dot" />
          {isSaved ? 'Saved' : 'Unsaved'}
        </span>
      </div>
      <div className="canvas-header__controls">
        <button className="canvas-ctrl-btn" type="button" title="Undo">↩</button>
        <button className="canvas-ctrl-btn" type="button" title="Redo">↪</button>
        <button className="canvas-ctrl-btn" type="button" title="Zoom out" onClick={handleZoomOut}>−</button>
        <span className="canvas-zoom-label">{zoom}%</span>
        <button className="canvas-ctrl-btn" type="button" title="Zoom in" onClick={handleZoomIn}>+</button>
        <button className="canvas-ctrl-btn" type="button" title="Fit view" onClick={handleFit}>⛶</button>
        <button className="btn-primary" type="button" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={handleSave}>
          Save Pipeline
        </button>
      </div>
    </div>
  );
};

const flowSelector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const FlowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(flowSelector, shallow);

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: `${type}` });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;
        if (typeof type === 'undefined' || !type) return;

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        addNode({
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        });
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="canvas-wrapper">
      <CanvasHeader />
      <div className="canvas-shell" ref={reactFlowWrapper}>
        {nodes.length === 0 && (
          <div className="canvas-empty">
            Drag nodes from the toolbar above onto this canvas to build your pipeline.
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#a3ff00', strokeWidth: 2 },
          }}
        >
          <Background color="rgba(163, 255, 0, 0.08)" gap={gridSize} size={1} />
          <Controls position="bottom-left" showInteractive={false} />
          <MiniMap
            position="bottom-right"
            nodeColor="#a3ff00"
            maskColor="rgba(10, 10, 10, 0.75)"
            style={{ width: 140, height: 90 }}
          />
        </ReactFlow>
      </div>
      <SubmitButton />
    </div>
  );
};

export const PipelineUI = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);
