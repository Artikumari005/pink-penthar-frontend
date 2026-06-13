import { Handle, Position } from 'reactflow';

const positionMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

export const BaseNode = ({ title, subtitle, children, handles = [], style }) => {
  return (
    <div className="pipeline-node" style={style}>
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={positionMap[handle.position] || Position.Left}
          id={handle.id}
          style={handle.style}
        />
      ))}
      <div className="pipeline-node__header">
        <div>
          <div className="pipeline-node__title">{title}</div>
          {subtitle ? <div className="pipeline-node__subtitle">{subtitle}</div> : null}
        </div>
      </div>
      <div className="pipeline-node__body">{children}</div>
    </div>
  );
};