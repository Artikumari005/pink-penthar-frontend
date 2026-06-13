import { BaseNode } from './BaseNode';

export const ApiNode = ({ id }) => {
  return (
    <BaseNode
      title="API"
      subtitle="Trigger external requests"
      handles={[
        { id: `${id}-input`, type: 'target', position: 'left' },
        { id: `${id}-output`, type: 'source', position: 'right' },
      ]}
    >
      <p className="node-copy">Connect a request payload to a service call and pass the response downstream.</p>
    </BaseNode>
  );
};