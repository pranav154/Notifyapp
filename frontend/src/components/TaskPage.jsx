import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const { token, updateToken } = useContext(AuthContext);
  
  
  useEffect(() =>{
    

    
    axios.get('https://notify-backend-1nnf.onrender.com/api/tasks',{
        headers: {
            'x-token' : token
        }
    }).then(res =>{
      const updatedTasks = res.data.map(task => ({
        id: task.id,
        title: task.title,
        targetDate: task.targetDate
      }));
    
      setTasks(updatedTasks);
      
    }).catch((err) => console.log(err))
},[])

  if(!token){
    window.location.href = '/';
}

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (
      newTask.trim() !== '' &&
      selectedYear !== '' &&
      selectedMonth !== '' &&
      selectedDay !== '' &&
      selectedHour !== '' &&
      selectedMinute !== ''
    ){
      const targetDate = new Date(
        parseInt(selectedYear),
        parseInt(selectedMonth),
        parseInt(selectedDay),
        parseInt(selectedHour),
        parseInt(selectedMinute)
      );
        
      const newTaskObj = {
        id: Date.now(),
        title: newTask,
        targetDate: targetDate.toISOString(),
        
      };
    //   setTasks([...tasks, newTaskObj]);
      console.log("hii");
        const headers = {
            'x-token' : token,
          };
        axios
      .post('https://notify-backend-1nnf.onrender.com/api/tasks', newTaskObj,{ headers })
      .then((response) => {
       
        console.log(response.data);
        newTaskObj.id=response.data;
         setTasks([...tasks, newTaskObj]);
         setNewTask('');
         setSelectedYear('');
         setSelectedMonth('');
         setSelectedDay('');
         setSelectedHour('');
         setSelectedMinute(''); 
      })
      .catch((error) => {
        
        console.error(error);
      });
      
    
      
    

      
    }
  };

  const handleDeleteTask = (taskId) => {
    const headers = {
        'x-token' : token,
      };
    axios
      .delete(`https://notify-backend-1nnf.onrender.com/api/tasks/${taskId}`, {headers})
      .then((response) => {
        
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
    
  };

  const handleLogout = () => {
    
    updateToken(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
            
          const remainingTime =
            Math.max(0, Math.floor((new Date(task.targetDate) - currentTime) / 1000)) || 0;
          const days = Math.floor(remainingTime / (3600 * 24));
          const hours = Math.floor((remainingTime % (3600 * 24)) / 3600);
          const minutes = Math.floor((remainingTime % 3600) / 60);
          const seconds = remainingTime % 60;

          return {
            ...task,
            remainingTime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          };
        })
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="task-page-container">
      <h1>Tasks Page</h1>
      <div className="top-right">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={handleNewTaskChange}
          placeholder="Enter task"
        />
        <select
          value={selectedYear}
          onChange={(event) => setSelectedYear(event.target.value)}
        >
          <option value="">Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          {}
        </select>
        <select
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
        >
          <option value="">Month</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>
        <select
          value={selectedDay}
          onChange={(event) => setSelectedDay(event.target.value)}
        >
          <option value="">Day</option>
          {Array.from({ length: new Date(selectedYear, selectedMonth + 1, 0).getDate() }, (_, index) => (
            <option key={index + 1} value={index + 1}>{index + 1}</option>
          ))}
        </select>
        <select
          value={selectedHour}
          onChange={(event) => setSelectedHour(event.target.value)}
        >
          <option value="">Hour</option>
          {Array.from({ length: 24 }, (_, index) => (
            <option key={index} value={index}>{index}</option>
          ))}
        </select>
        <select
          value={selectedMinute}
          onChange={(event) => setSelectedMinute(event.target.value)}
        >
          <option value="">Minute</option>
          {Array.from({ length: 60 }, (_, index) => (
            <option key={index} value={index}>{index}</option>
          ))}
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div>{task.title}</div>
            <div>Remaining Time: {task.remainingTime}</div>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;


