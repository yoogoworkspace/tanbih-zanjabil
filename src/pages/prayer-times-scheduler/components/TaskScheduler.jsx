import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskScheduler = ({ tasks, onTaskUpdate, onTaskReorder }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'personal',
    priority: 'medium',
    duration: 30,
    requiresWudu: false
  });

  const categories = [
    { value: 'personal', label: 'Personal', icon: 'User', color: 'bg-accent' },
    { value: 'work', label: 'Work', icon: 'Briefcase', color: 'bg-secondary' },
    { value: 'family', label: 'Family', icon: 'Heart', color: 'bg-success' },
    { value: 'islamic', label: 'Islamic', icon: 'BookOpen', color: 'bg-primary' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-muted-foreground' },
    { value: 'medium', label: 'Medium', color: 'text-warning' },
    { value: 'high', label: 'High', color: 'text-error' }
  ];

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e?.preventDefault();
    if (draggedTask) {
      onTaskReorder(draggedTask?.id, targetIndex);
      setDraggedTask(null);
    }
  };

  const handleAddTask = () => {
    const task = {
      id: Date.now(),
      ...newTask,
      scheduledTime: null,
      completed: false,
      createdAt: new Date()?.toISOString()
    };
    onTaskUpdate('add', task);
    setNewTask({
      title: '',
      category: 'personal',
      priority: 'medium',
      duration: 30,
      requiresWudu: false
    });
    setShowAddTask(false);
  };

  const getCategoryConfig = (category) => {
    return categories?.find(cat => cat?.value === category) || categories?.[0];
  };

  const getPriorityConfig = (priority) => {
    return priorities?.find(pri => pri?.value === priority) || priorities?.[1];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-foreground">Task Scheduler</h2>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowAddTask(true)}
        >
          Add Task
        </Button>
      </div>
      {showAddTask && (
        <div className="p-6 bg-card border border-border rounded-xl shadow-islamic-subtle">
          <h3 className="font-medium text-foreground mb-4">Add New Task</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Task Title</label>
              <input
                type="text"
                value={newTask?.title}
                onChange={(e) => setNewTask({...newTask, title: e?.target?.value})}
                placeholder="Enter task title"
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={newTask?.category}
                  onChange={(e) => setNewTask({...newTask, category: e?.target?.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories?.map(cat => (
                    <option key={cat?.value} value={cat?.value}>{cat?.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                <select
                  value={newTask?.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e?.target?.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {priorities?.map(pri => (
                    <option key={pri?.value} value={pri?.value}>{pri?.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={newTask?.duration}
                  onChange={(e) => setNewTask({...newTask, duration: parseInt(e?.target?.value)})}
                  min="5"
                  max="480"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="requiresWudu"
                  checked={newTask?.requiresWudu}
                  onChange={(e) => setNewTask({...newTask, requiresWudu: e?.target?.checked})}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                />
                <label htmlFor="requiresWudu" className="text-sm text-foreground">Requires Wudu</label>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button variant="default" size="sm" onClick={handleAddTask}>
                Add Task
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAddTask(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {tasks?.map((task, index) => (
          <div
            key={task?.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`p-4 bg-card border border-border rounded-lg cursor-move hover:shadow-islamic-subtle transition-all duration-200 ${
              task?.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                  <input
                    type="checkbox"
                    checked={task?.completed}
                    onChange={(e) => onTaskUpdate('toggle', {...task, completed: e?.target?.checked})}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
                  />
                </div>
                
                <div className={`w-3 h-3 rounded-full ${getCategoryConfig(task?.category)?.color}`}></div>
                
                <div>
                  <h4 className={`font-medium ${task?.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task?.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{getCategoryConfig(task?.category)?.label}</span>
                    <span className={getPriorityConfig(task?.priority)?.color}>
                      {getPriorityConfig(task?.priority)?.label}
                    </span>
                    <span>{task?.duration}min</span>
                    {task?.requiresWudu && (
                      <span className="flex items-center space-x-1">
                        <Icon name="Droplets" size={12} />
                        <span>Wudu</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {task?.scheduledTime && (
                  <span className="font-data text-sm text-foreground">{task?.scheduledTime}</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTaskUpdate('delete', task)}
                  className="text-muted-foreground hover:text-error"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {tasks?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No tasks scheduled</p>
            <p className="text-sm">Add your first task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskScheduler;