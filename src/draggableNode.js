import { nodeIcons } from './icons';

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.currentTarget.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => { event.currentTarget.style.cursor = 'grab'; }}
      draggable
    >
      <span className="draggable-node__icon">{nodeIcons[type]}</span>
      <span className="draggable-node__label">{label}</span>
      <span className="draggable-node__hint">Drag to canvas</span>
    </div>
  );
};
