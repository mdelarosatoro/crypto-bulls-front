import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { login, updatePortfolio } from './features/auth/authSlice';
import Register from './components/Register';
import Coin from './components/Coin';
import styled from 'styled-components';
import Portfolio from './components/Portfolio';
import MobileMenu from './components/Navbar/MobileMenu';

const AppContainer = styled.div`
  max-width: 100vw;
  overflow: hidden;
  position: relative;
`;

function App() {
  const [mobileMenuToggle, setMobileMenuToggle] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false)

  const token = localStorage.getItem('authToken');
  const userData = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  
  const getUserData = async () => {
    try {
      const options = {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
          method: 'GET',
      }

      const myInfoResponse = await fetch('/users/my-info', options);
      const myInfoResult = await myInfoResponse.json();

      if (myInfoResult) {
          dispatch(login(myInfoResult));

          const responsePortfolio = await fetch (`/users/portfolio`, options);
          const resultPortfolio = await responsePortfolio.json();
          dispatch(updatePortfolio(resultPortfolio))
      }
    } catch (error) {
      console.log(error.message);
      navigate('/login');
    }
  }

  useEffect(() => {
    getUserData();
  },[userData.email])

  const toggleMobileMenu = () => {
    setMobileMenuToggle(!mobileMenuToggle);
    setCheckboxState(!checkboxState);
  }

  return (
    <AppContainer>
      {mobileMenuToggle && <MobileMenu toggleMobileMenu={toggleMobileMenu} />}
      <Navbar checkboxState={checkboxState} toggleMobileMenu={toggleMobileMenu} />
      <Routes>
        <Route path='/login' exact element={<Login />} />
        <Route path='/' exact element={<Home />} />
        <Route path='/register' exact element={<Register />} />
        <Route path='/portfolio' exact element={<Portfolio />} />
        <Route path='/coins/:coinId' element={<Coin />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
