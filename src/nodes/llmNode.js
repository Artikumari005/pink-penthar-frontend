import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [model, setModel] = useState(data?.model || 'GPT-4o');
  const [temperature, setTemperature] = useState(data?.temperature || '0.7');

  useEffect(() => {
    updateNodeField(id, 'model', model);
  }, [model, id, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'temperature', temperature);
  }, [temperature, id, updateNodeField]);

  return (
    <BaseNode
      title="LLM"
      subtitle="Analyzes and generates response"
      handles={[
        { id: `${id}-system`, type: 'target', position: 'left', style: { top: '32%' } },
        { id: `${id}-prompt`, type: 'target', position: 'left', style: { top: '68%' } },
        { id: `${id}-response`, type: 'source', position: 'right' },
      ]}
    >
      <div className="node-form">
        <label>
          Model:
          <select className="nodrag" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="GPT-4o">GPT-4o</option>
            <option value="GPT-4">GPT-4</option>
            <option value="Claude 3.5">Claude 3.5</option>
            <option value="Gemini Pro">Gemini Pro</option>
          </select>
        </label>
        <label>
          Temperature:
          <select className="nodrag" value={temperature} onChange={(e) => setTemperature(e.target.value)}>
            <option value="0">0</option>
            <option value="0.3">0.3</option>
            <option value="0.7">0.7</option>
            <option value="1.0">1.0</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
