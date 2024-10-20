import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useSensor, useSensors, MouseSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskBoard.css'; 

interface Task {
  id: string;
  name: string;
  status: 'todo' | 'inProgress' | 'done';
  comments: string[];
}

const initialTasks: Task[] = [
  { id: '1', name: 'Design homepage', status: 'todo', comments: [] },
  { id: '2', name: 'Set up database', status: 'inProgress', comments: ["This needs attention."] },
  { id: '3', name: 'Create API endpoints', status: 'inProgress', comments: [] },
  { id: '4', name: 'Write documentation', status: 'done', comments: ["Documentation is almost finished."] },
];

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editing, setEditing] = useState(false); 
  const [newComment, setNewComment] = useState<string>('');
  const [editedTaskName, setEditedTaskName] = useState<string>(''); // State for edited task name

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedTaskId = active.id;
    const newStatus = over.id as Task['status'];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === draggedTaskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditedTaskName(task.name); // Set initial value for editing
  };

  const handleTaskEdit = () => {
    setEditing(true); 
  };

  const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskName(event.target.value); // Update edited task name state
  };

  const handleSaveTaskName = () => {
    if (selectedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? { ...task, name: editedTaskName } : task
        )
      );
      setEditing(false); // Exit editing mode
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask && newComment.trim()) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id
            ? { ...task, comments: [...task.comments, newComment] }
            : task
        )
      );
      setNewComment('');
    }
  };

  const closeModal = () => {
    setSelectedTask(null);
    setEditing(false);
    setEditedTaskName(''); // Reset edited task name
  };

  return (
    <div className="task-board">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="kanban-columns">
          <DroppableColumn title="To Do" id="todo" tasks={tasks.filter(task => task.status === 'todo')} onTaskClick={handleTaskClick} />
          <DroppableColumn title="In Progress" id="inProgress" tasks={tasks.filter(task => task.status === 'inProgress')} onTaskClick={handleTaskClick} />
          <DroppableColumn title="Done" id="done" tasks={tasks.filter(task => task.status === 'done')} onTaskClick={handleTaskClick} />
        </div>
      </DndContext>

      {/* Task Modal */}
      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Task Details</h4>
            <span className="close-modal" onClick={closeModal}>✖</span>

            {!editing ? (
              <h2 onClick={handleTaskEdit} className="task-title">
                {selectedTask.name}
              </h2>
            ) : (
              <>
                <input
                  type="text"
                  value={editedTaskName} // Use editedTaskName state
                  onChange={handleTaskNameChange}
                  className="task-input"
                  autoFocus
                />
                <button onClick={handleSaveTaskName}>Save</button> {/* Button to save changes */}
              </>
            )}

            <ul className="comment-list">
              {selectedTask.comments.map((comment, index) => (
                <li key={index}>
                  {comment}
                </li>
              ))}
            </ul>

            {/* Add Comment */}
            <form onSubmit={handleAddComment}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="comment-input"
              />
              <button type="submit" className="add-comment-btn">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface ColumnProps {
  title: string;
  id: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const DroppableColumn = ({ title, id, tasks, onTaskClick }: ColumnProps) => (
  <div className="kanban-column" id={id}>
    <h3>{title}</h3>
    <SortableContext items={tasks.map(task => task.id)}>
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
        ))}
      </ul>
    </SortableContext>
  </div>
);

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const TaskCard = ({ task, onTaskClick }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="task-card" onClick={() => onTaskClick(task)}>
      {task.name}
      {task.comments.length > 0 && <span className="comment-icon">💬</span>}
    </li>
  );
};

export default TaskBoard;
