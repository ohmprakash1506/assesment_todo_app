import AddTodo from './components/addTask';
import TodoList from './components/taskList';
import { Layout } from 'antd';
import "./App.css"

const { Content } = Layout;
function App() {

  return (
    <div className="app">
			<Layout style={{ minHeight: '30vh' }}>
			<h1 className="app-title">My Tasks</h1>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AddTodo />
            </Content>
        </Layout>
			<TodoList />
		</div>
  );
}

export default App;
