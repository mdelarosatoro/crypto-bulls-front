import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Container = styled.main`
    background: rgb(10,20,69);
    min-height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    `;
    
const RegisterContainer = styled.div`
    width: 650px;
    height: fit-content;
    border: 1px solid white;
    padding: 40px;
    margin-top: 120px;
    margin-bottom: 120px;
    background-color: rgba(60,20,120, 0.6);
    border-radius: 40px;
    transition: 0.3s ease all;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &:hover{
        background-color: rgba(60,20,120, 0.9);
        transition: 0.3s ease all;
    }
`;

const RegisterTitle = styled.span`
    font-size: 3rem;
    margin-top: -1rem;
    margin-bottom: 1rem;
    color: rgb(180,180,180);
`;

const FieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    justify-content: space-between;
    margin-bottom: 2rem;
`;

const FieldName = styled.span`
    color: rgb(180,180,180);
    margin-bottom: 1rem;
    font-size: 1.2rem;
`;

const Input = styled.input`
    border-radius: 0.3rem;
    padding: 0.6rem;
    background-color: rgb(180,180,180);
`;

const ButtonContainer = styled.div`
    width: 40%;
    display: flex;
    justify-content: space-between;
`

const Button = styled.button`
    padding: 0.8rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 0.3rem;
    color: rgba(60,20,120, 0.9);
    background-color: rgb(180,180,180);
`;

function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [country, setCountry] = useState('');


    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userInfo = useSelector(state => state.auth);

    useEffect(() => {
        console.log(userInfo);
        if (userInfo.email !== '') {
            navigate('/');
        }
    },[userInfo])

    const handleRegister = async () => {
        const payload = {
            userId,
            password,
            email,
            name,
            lastName,
            dateOfBirth,
            country
        }

        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(payload),
        };

        const response = await fetch('/users/create', options);
        const result = await response.json();
        
        console.log(response);
        console.log(result);

        loginNewUser(payload.email, payload.password)
    }

    const loginNewUser = async (email, password) => {
        const payload = {
            email,
            password,
        }

        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(payload),
        };

        const response = await fetch('/login', options);
        const result = await response.json();

        if (result.token) {
            const token = result.token;
            localStorage.setItem('authToken', token);

            const options2 = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                method: 'GET',
            }

            const myInfoResponse = await fetch('/users/my-info', options2);
            const myInfoResult = await myInfoResponse.json();
            console.log(myInfoResult);
            if (myInfoResult) {
                dispatch(login(myInfoResult));
            }
        }
    }

    return (
        <Container>
            <RegisterContainer>

                <RegisterTitle>Register</RegisterTitle>

                <FieldContainer>
                    <FieldName>User ID</FieldName>
                    <Input type='text' onChange={(e) => setUserId(e.target.value)} value={userId} />
                </FieldContainer>

                <FieldContainer>
                    <FieldName>Password</FieldName>
                    <Input type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
                </FieldContainer>

                <FieldContainer>
                    <FieldName>Email</FieldName>
                    <Input type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                </FieldContainer>

                <FieldContainer>
                    <FieldName>Name</FieldName>
                    <Input type='text' onChange={(e) => setName(e.target.value)} value={name} />
                </FieldContainer>

                <FieldContainer>
                    <FieldName>Last Name</FieldName>
                    <Input type='text' onChange={(e) => setLastName(e.target.value)} value={lastName} />
                </FieldContainer>

                <FieldContainer>
                    <FieldName>Date Of Birth</FieldName>
                    <Input type='text' onChange={(e) => setDateOfBirth(e.target.value)} value={dateOfBirth} />                </FieldContainer>

                <FieldContainer>
                    <FieldName>Country</FieldName>
                    <Input type='text' onChange={(e) => setCountry(e.target.value)} value={country} />
                </FieldContainer>

                <ButtonContainer>
                    <Link to='/login'>
                        <Button>Login</Button>
                    </Link>
                    <Button onClick={handleRegister}>Register</Button>
                </ButtonContainer>

            </RegisterContainer>
        </Container>
    )
}

export default Login