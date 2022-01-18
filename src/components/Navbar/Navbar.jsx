import React from 'react'
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { logout } from '../../features/auth/authSlice';

const Nav = styled.nav`
    width: 100vw;
    height: 80px;
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(26,26,136,1) 35%, rgba(0,212,255,1) 100%);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0px;
`;

const NavTitle = styled.h2`
    color: #f6f6f6;
    font-size: 2rem;
    margin-left: 50px;
`;

const LogoutBtn = styled.button`
    background-color: blue;
    color: white;
    border-radius: 0.3rem;
    padding: 0.5rem;
    transition: 0.3s ease all;
    cursor: pointer;
    &:hover{
        background-color: lightblue;
        transition: 0.3s ease all;
        color: black;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
`;

const DesktopMenuLinkContainer = styled.div`
    width: 20%;
    display: flex;
    justify-content: space-between;
    margin-right: 10rem;
`;

const DesktopMenuLink = styled(StyledLink)`
    color: white;
    cursor: pointer;
    display: block;
    transition: 0.3s ease all;
    &:hover{
        color: blue;
        transition: 0.3s ease all;
    }
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

const HamburgerContainer = styled.label`
    display: flex;
    flex-direction: column;
    row-gap: 0.2rem;
    cursor: pointer;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const HamburgerLine = styled.span`
    width: 20px;
    height: 3px;
    display: block;
    background-color: black;
`;

function Navbar({toggleMobileMenu, checkboxState}) {
    const userData = useSelector(state => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem('authToken');
        navigate('/login');
    }

    return (
        <Nav>
            <StyledLink to='/'>
                <NavTitle>Coin</NavTitle>
            </StyledLink>

            {userData.email && (
            <>
                <DesktopMenuLinkContainer>
                    <DesktopMenuLink to='/portfolio'>Portfolio</DesktopMenuLink>
                    <DesktopMenuLink onClick={handleLogout} to='/login'>Logout</DesktopMenuLink>
                </DesktopMenuLinkContainer>

                <input checked={checkboxState} type="checkbox" id="hamburger-checkbox" className="hamburger-checkbox" />
                <HamburgerContainer onClick={toggleMobileMenu} htmlFor="hamburger-checkbox" >
                    <HamburgerLine className='h1'></HamburgerLine>
                    <HamburgerLine className='h2'></HamburgerLine>
                    <HamburgerLine className='h3'></HamburgerLine>
                </HamburgerContainer>
            </>)}
        </Nav>
    )
}

export default Navbar
