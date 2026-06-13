import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [delayMs, setDelayMs] = useState(data?.delayMs || 1000);

  useEffect(() => {
    updateNodeField(id, 'delayMs', delayMs);
  }, [delayMs, id, updateNodeField]);

  return (
    <BaseNode
      title="Delay"
      subtitle="Pause execution for a moment"
      handles={[
        { id: `${id}-input`, type: 'target', position: 'left' },
        { id: `${id}-output`, type: 'source', position: 'right' },
      ]}
    >
      <div className="node-form">
        <label>
          Milliseconds:
          <input
            className="nodrag"
            type="number"
            min="0"
            value={delayMs}
            onChange={(event) => setDelayMs(Number(event.target.value))}
          />
        </label>
      </div>
    </BaseNode>
  );
};