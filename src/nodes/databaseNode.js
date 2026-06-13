import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const DatabaseNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [tableName, setTableName] = useState(data?.tableName || 'pipeline_runs');

  useEffect(() => {
    updateNodeField(id, 'tableName', tableName);
  }, [id, tableName, updateNodeField]);

  return (
    <BaseNode
      title="Database"
      subtitle="Read from or write to storage"
      handles={[
        { id: `${id}-input`, type: 'target', position: 'left' },
        { id: `${id}-output`, type: 'source', position: 'right' },
      ]}
    >
      <div className="node-form">
        <label>
          Table:
          <input
            className="nodrag"
            type="text"
            value={tableName}
            onChange={(event) => setTableName(event.target.value)}
          />
        </label>
      </div>
    </BaseNode>
  );
};