import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

const edgeStyle = {
  stroke: '#a3ff00',
  strokeWidth: 2,
};

const emptyState = {
  nodes: [],
  edges: [],
  nodeIDs: {},
};

const touchPipeline = (set) => {
  set({ lastModified: new Date(), isSaved: false });
};

export const useStore = create(
  persist((set, get) => ({
  
  ...emptyState,
  pipelineName: 'Untitled Pipeline',
  lastModified: null,
  isSaved: true,
  executions: [],
  executionCounter: 0,

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  newPipeline: (name) => {
    const pipelineName = name?.trim() || 'Untitled Pipeline';
    set({
      ...emptyState,
      pipelineName,
      lastModified: new Date(),
      isSaved: true,
    });
  },

  savePipeline: () => {
    set({ isSaved: true, lastModified: new Date() });
  },

  setPipelineName: (name) => {
    set({ pipelineName: name, isSaved: false, lastModified: new Date() });
  },

  addNode: (node) => {
    touchPipeline(set);
    set({ nodes: [...get().nodes, node] });
  },

  onNodesChange: (changes) => {
    const hasMeaningfulChange = changes.some(
      (change) => change.type !== 'select' && change.type !== 'dimensions'
    );
    if (hasMeaningfulChange) {
      touchPipeline(set);
    }
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    const hasMeaningfulChange = changes.some((change) => change.type !== 'select');
    if (hasMeaningfulChange) {
      touchPipeline(set);
    }
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    touchPipeline(set);
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          style: edgeStyle,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#a3ff00' },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    touchPipeline(set);
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue },
          };
        }
        return node;
      }),
    });
  },

  recordExecution: ({ success, numNodes, numEdges, isDag, errorMessage }) => {
    const nextId = get().executionCounter + 1;
    const entry = {
      id: nextId,
      ranAt: new Date(),
      status: success ? (isDag ? 'Completed' : 'Invalid DAG') : 'Failed',
      numNodes,
      numEdges,
      isDag,
      errorMessage,
    };
    set({
      executionCounter: nextId,
      executions: [entry, ...get().executions].slice(0, 10),
    });
  },

  getPipelineStatus: () => {
    const { nodes, isSaved } = get();
    if (nodes.length === 0) return 'Empty';
    return isSaved ? 'Saved' : 'Draft';
  },
 }),
    {
      name: 'pipeline-storage',
    }
  )
);
