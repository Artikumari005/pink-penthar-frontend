import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [condition, setCondition] = useState(data?.condition || 'score > 0.8');

  useEffect(() => {
    updateNodeField(id, 'condition', condition);
  }, [condition, id, updateNodeField]);

  return (
    <BaseNode
      title="Filter"
      subtitle="Keep only matching items"
      handles={[
        { id: `${id}-input`, type: 'target', position: 'left' },
        { id: `${id}-output`, type: 'source', position: 'right' },
      ]}
    >
      <div className="node-form">
        <label>
          Condition:
          <input
            className="nodrag"
            type="text"
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
          />
        </label>
      </div>
    </BaseNode>
  );
};