import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [regError, setregError] = useState(''); 
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try{
        axios.post('https://notifyapp-2vld.onrender.com/api/register',{
            username:username,
            password:password,
            email: email
        }).then((res)=>{
            console.log(res.message);
            setregError('successfully registered');
        }).catch(err =>{
          setregError('username or email already exists');
        });
    }catch(err){
        console.log(err);
    }
        
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);
    
    setUsername('');
    setPassword('');
    setEmail('');
  };

  return (
    <div className="registration-container">
      <h1>Registration Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {regError && <p className="error-message">{regError}</p>}
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default RegistrationPage;
