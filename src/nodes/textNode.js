import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

const variablePattern = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currText, setCurrText] = useState(
    data?.text || 'You are a helpful assistant. Answer the following question: {{user_query}}'
  );

  useEffect(() => {
    updateNodeField(id, 'text', currText);
  }, [currText, id, updateNodeField]);

  const variables = useMemo(() => {
    const matches = [...currText.matchAll(variablePattern)].map((match) => match[1]);
    return [...new Set(matches)];
  }, [currText]);

  const lines = currText.split('\n');
  const longestLine = lines.reduce((max, line) => Math.max(max, line.length), 1);
  const width = Math.min(Math.max(longestLine * 9 + 120, 280), 480);
  const height = Math.min(Math.max(lines.length * 28 + 116, 180), 420);

  const handles = variables.map((variable, index) => ({
    id: `${id}-${variable}`,
    type: 'target',
    position: 'left',
    style: { top: `${((index + 1) / (variables.length + 1)) * 100}%` },
  }));

  return (
    <BaseNode
      title="Text"
      subtitle="Prompt template"
      handles={[
        ...handles,
        { id: `${id}-output`, type: 'source', position: 'right' },
      ]}
      style={{ width, minHeight: height }}
    >
      <div className="node-form node-form--text">
        <label>
          Template:
          <textarea
            className="nodrag"
            rows={Math.min(Math.max(lines.length, 3), 8)}
            value={currText}
            onChange={(e) => setCurrText(e.target.value)}
          />
        </label>
      </div>
    </BaseNode>
  );
};
