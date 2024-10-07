import React, { useState } from 'react';
import { Input, Button, Modal, Form, notification } from 'antd';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api';
import { addTodo } from '../redux/actions';

const AddTodo = ({ fetchTasks }) => {
	const [value, setValue] = useState('');
	const [description, setDescription] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();


	const onSubmit = async (event) => {
		event.preventDefault();

		if (value.trim().length === 0 || description.trim().length === 0) {
			notification.error({
				message: 'Input Error',
				description: 'Please enter both task and description!',
			});
			return;
		}

		try {
			const response = await axiosInstance.post('/task/createTask', {
				task: value,
				description: description,
			});
			if (response.status === 200) {
        const newTodo = response.data;
				notification.success({
					message: 'Task Created',
					description: 'Your task has been created successfully!',
				});
        dispatch(addTodo(newTodo));
				setIsModalVisible(true);
				setValue('');
				setDescription('');
				fetchTasks(); 
			} else {
				notification.error({
					message: 'Creation Error',
					description: 'There was an error creating the task.',
				});
			}
		} catch (error) {
			notification.error({
				message: 'API Error',
				description: 'Failed to create task. Please try again later.',
			});
		}
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<div className="add-todo" style={{ margin: '20px 0' }}>
			<Form layout="vertical">
				<Form.Item label="Task Name" required>
					<Input
						type="text"
						className="task-input"
						placeholder="Add task"
						value={value}
						onChange={(event) => setValue(event.target.value)}
						style={{ width: '500px' }}
					/>
				</Form.Item>
				<Form.Item label="Description" required>
					<Input
						type="text"
						className="task-input"
						placeholder="Add description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						style={{ width: '300px' }}
					/>
				</Form.Item>

				<Button type="primary" className="task-button" onClick={onSubmit}>
					Add Task
				</Button>
			</Form>

			<Modal
				title="Task Added"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="OK"
				cancelButtonProps={{ style: { display: 'none' } }}
			>
				<p>Your task has been added successfully!</p>
			</Modal>
		</div>
	);
};

export default AddTodo;
