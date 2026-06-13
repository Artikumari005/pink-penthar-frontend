import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.outputName || 'bot_response');
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  useEffect(() => {
    updateNodeField(id, 'outputName', currName);
  }, [currName, id, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'outputType', outputType);
  }, [id, outputType, updateNodeField]);

  return (
    <BaseNode
      title="Output"
      subtitle="Returns the final response"
      handles={[{ id: `${id}-value`, type: 'target', position: 'left' }]}
    >
      <div className="node-form">
        <label>
          Name:
          <input className="nodrag" type="text" value={currName} onChange={(e) => setCurrName(e.target.value)} />
        </label>
        <label>
          Type:
          <select className="nodrag" value={outputType} onChange={(e) => setOutputType(e.target.value)}>
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
