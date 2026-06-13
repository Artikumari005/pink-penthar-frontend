import { useStore } from './store';
import { PlayIcon } from './icons';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const recordExecution = useStore((state) => state.recordExecution);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      window.alert('Add at least one node before running the pipeline.');
      return;
    }

    try {
      const response = await fetch('https://pink-penthar.onrender.com/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse pipeline');
      }

      const data = await response.json();
      recordExecution({
        success: true,
        numNodes: data.num_nodes,
        numEdges: data.num_edges,
        isDag: data.is_dag,
      });

      window.alert(
        `Pipeline parsed successfully.\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${data.is_dag ? 'Yes' : 'No'}`
      );
    } catch (error) {
      recordExecution({
        success: false,
        numNodes: nodes.length,
        numEdges: edges.length,
        isDag: false,
        errorMessage: error.message,
      });
      window.alert(`Unable to run pipeline: ${error.message}`);
    }
  };

  return (
    <div className="submit-bar">
      <div className="submit-bar__text">
        <span className="submit-bar__icon">⚡</span>
        Ready to run your pipeline? Validate and execute your workflow to see the results.
      </div>
      <button type="button" className="submit-button" onClick={handleSubmit}>
        <PlayIcon />
        Run Pipeline
      </button>
    </div>
  );
};
