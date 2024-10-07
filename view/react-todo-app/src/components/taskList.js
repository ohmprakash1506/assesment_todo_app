import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Radio, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../api';
import { setTodos, updateTodo, deleteTodo } from '../redux/actions';

const TodoList = () => {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch(); 
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [completedStatus, setCompletedStatus] = useState(false); 

  const fetchTasks = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/task/listAllUsers`, {
        params: {
          page: page - 1,
          limit: pageSize,
        },
      });
      
      const { data } = response.data.response;

      dispatch(setTodos(data)); 
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.response.totalTask,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const columns = [
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      render: (completed) => (completed ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const showEditModal = (task) => {
    setCurrentTask(task);
    setTaskName(task.task);
    setTaskDescription(task.description);
    setCompletedStatus(task.completed); 
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const response = await axiosInstance.put(`/task/updateTask?taskId=${currentTask._id}`, {
        task: taskName,
        description: taskDescription,
        completed: completedStatus, 
      });
      dispatch(updateTodo(response.data)); 
      message.success('Task updated successfully');
      setIsModalVisible(false);
      fetchTasks(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axiosInstance.delete(`/task/deleteTask?id=${taskId}`);
          dispatch(deleteTodo(taskId)); 
          message.success('Task deleted successfully');
          fetchTasks(pagination.current, pagination.pageSize); 
        } catch (error) {
          message.error('Failed to delete task');
        }
      },
    });
  };

  const handleTableChange = (pagination) => {
    fetchTasks(pagination.current, pagination.pageSize);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={todos}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="_id"
      />
      <Modal
        title="Edit Task"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task"
        />
        <Input
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Description"
        />
        <div style={{ marginTop: 10 }}>
          <span>Completed: </span>
          <Radio.Group 
            onChange={(e) => setCompletedStatus(e.target.value)} 
            value={completedStatus}
          >
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </>
  );
};

export default TodoList;
