import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.inputName || 'user_query');
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  useEffect(() => {
    updateNodeField(id, 'inputName', currName);
  }, [currName, id, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'inputType', inputType);
  }, [id, inputType, updateNodeField]);

  return (
    <BaseNode
      title="Input"
      subtitle="Entry point for the pipeline"
      handles={[{ id: `${id}-value`, type: 'source', position: 'right' }]}
    >
      <div className="node-form">
        <label>
          Name:
          <input className="nodrag" type="text" value={currName} onChange={(e) => setCurrName(e.target.value)} />
        </label>
        <label>
          Type:
          <select className="nodrag" value={inputType} onChange={(e) => setInputType(e.target.value)}>
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
