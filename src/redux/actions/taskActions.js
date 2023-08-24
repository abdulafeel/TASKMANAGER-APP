export const addTask = (taskData) => {
    return {
      type: 'ADD_TASK',
      payload: taskData,
    };
  };
  
  export const deleteTask = (taskId) => {
    return {
      type: 'DELETE_TASK',
      payload: taskId,
    };
  };
  
  export const updateTask = (taskId, updatedTaskData) => {
    return {
      type: 'UPDATE_TASK',
      payload: { taskId, updatedTaskData },
    };
  };
  
  export const markTaskAsCompleted = (taskId) => {
    return {
      type: 'MARK_TASK_COMPLETED',
      payload: taskId,
    };
  };
  