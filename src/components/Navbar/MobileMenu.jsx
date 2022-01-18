import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logout } from '../../features/auth/authSlice';

const MobileMenuContainer = styled.div`
    position: absolute;
    top: 80px;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: blue;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 2rem;
`;

const StyledMenuLink = styled(Link)`
    color: white;
    text-decoration: none;
    font-size: 2rem;
    border-bottom: 2px solid navy;
    display: block;
    width: 100%;
    text-align: center;
    padding: 2rem;
`;

const MobileMenu = ({toggleMobileMenu}) => {
    const userData = useSelector(state => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem('authToken');
        navigate('/login');
    }

    return (
        <>
            {userData.email && (
            <MobileMenuContainer>
                <StyledMenuLink onClick={toggleMobileMenu} to='/'>Home</StyledMenuLink>
                <StyledMenuLink onClick={toggleMobileMenu} to='/portfolio'>Portfolio</StyledMenuLink>
                {userData.email && <StyledMenuLink onClick={handleLogout} to='/login'>Logout</StyledMenuLink>}
            </MobileMenuContainer>)}
        </>
    )
}

export default MobileMenu
