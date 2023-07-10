import React,{ useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axios from 'axios';


function Login() {
  const { token,updateToken } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); 
  
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };


  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    
    axios.post('http://localhost:4040/login',{
      username,
      password,
    }).then(
      res => {
        
        console.log(res.data.token);
        const t = res.data.token;
       updateToken(t);
       console.log(token);
       window.location.href = '/tasks';
        
       
      }
    ).catch(err =>{
      setLoginError('Invalid credentials');
    });

      
    
    setUsername('');
    setPassword('');
  };

  return (
    <div className='login-container'>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button  type="submit">Login</button>
      </form>
      {loginError && <p className="error-message">{loginError}</p>}
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
