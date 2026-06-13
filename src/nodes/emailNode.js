import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const EmailNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [recipient, setRecipient] = useState(data?.recipient || 'team@vectorshift.ai');

  useEffect(() => {
    updateNodeField(id, 'recipient', recipient);
  }, [id, recipient, updateNodeField]);

  return (
    <BaseNode
      title="Email"
      subtitle="Send a message to a recipient"
      handles={[
        { id: `${id}-input`, type: 'target', position: 'left' },
        { id: `${id}-output`, type: 'source', position: 'right' },
      ]}
    >
      <div className="node-form">
        <label>
          Recipient:
          <input
            className="nodrag"
            type="email"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </label>
      </div>
    </BaseNode>
  );
};