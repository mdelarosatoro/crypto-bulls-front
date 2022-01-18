import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { updatePortfolio } from '../features/auth/authSlice';


const PortfolioContainer = styled.div`
    background: rgb(2,0,36);
    background: linear-gradient(174deg, rgba(2,0,36,1) 0%, rgba(26,26,136,1) 44%, rgba(19,88,174,1) 68%, rgba(15,119,193,1) 85%, rgba(11,152,213,1) 93%, rgba(5,204,245,1) 100%);
    color: #f6f6f6;
    min-height: 92vh;
    padding: 2rem;
    max-width: 100vw;
    margin-top: 80px;
`;

const borderColor = '#bcbcbc'

const TableWrapper = styled.div`
    width: 80vw;
    overflow-x: scroll;
    margin: 0 auto;
`;

const Table = styled.table`
    border-collapse: collapse;
    margin: 40px auto 0px auto;
`;

const Th = styled.th`
    border-bottom: 2px solid ${borderColor};
    border-top: 2px solid ${borderColor};
    padding: 0.8rem;
    font-size: 1.4rem;
    // &:first-child{
    //     border-left: 2px solid ${borderColor};
    // }
    // &:last-child{
    //     border-right: 2px solid ${borderColor};
    // }
    &:nth-child(2), :nth-child(1), :nth-child(4), :nth-child(5){
        text-align: left;
    }
`;

const Tr = styled.tr`
    width: 95vw;
    overflow-x: auto;
`;

const Td = styled.td`
    border-bottom: 2px solid ${borderColor};
    padding: 0.8rem;
`;

const RankTd = styled(Td)`
    // display: flex;
    `;
    
    const RankDiv = styled.div`
    display: flex;
    align-items: center;
    column-gap: 1rem;
`;

const StyledStarBorder = styled(StarBorderIcon)`
    cursor: pointer;
`;

const StyledStarIcon = styled(StarIcon)`
    cursor: pointer;
`;

const CoinNameTd = styled(Td)`
    font-weight: bold;
`;

const SymbolTd = styled(Td)`
    width: 20px;
    text-align: center;
`;

const PriceChangeTd = styled(Td)`
    color: ${({priceChange}) => (priceChange > 0 ? 'lightgreen' : 'red')}
`;

const CoinImg = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 4px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #f6f6f6;
`;


const Portfolio = () => {
    const token = localStorage.getItem('authToken');

    const [coinList, setCoinList] = useState([]);

    const userInfo = useSelector(state => state.auth);
    
    const dispatch = useDispatch();

    const fetchCoinData = async () => {
        const options = {
            headers: {'Authorization': `Bearer ${token}`},
            method: 'GET',
        }
        const portfolioResponse = await fetch (`/users/portfolio`, options);
        const portfolioResult = await portfolioResponse.json();

        const coins = await Promise.all(portfolioResult.map(async (coin) => {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
            const result = await response.json();
            return result;
        }))
        console.log(coins);
        setCoinList(coins);
    }

    useEffect(() => {
        fetchCoinData();
    },[])

    const toggleAddPortfolio = async (e) => {
        console.log(e.target.dataset.coinId)
        const options = {
            headers: {'Authorization': `Bearer ${token}`},
            method: 'GET',
        }
        const response = await fetch (`/users/toggle-coin-portfolio/${e.target.dataset.coinId}`, options);
        const result = await response.json();
        console.log(result);

        const responsePortfolio = await fetch (`/users/portfolio`, options);
        const resultPortfolio = await responsePortfolio.json();
        console.log(resultPortfolio);
        dispatch(updatePortfolio(resultPortfolio))
    }

    return (
        <PortfolioContainer>
            <h2>Welcome, {userInfo.name} {userInfo.lastName}, to your portfolio.</h2>

            {coinList && 
            <TableWrapper>
            <Table>
                <thead>
                    <tr>
                        <Th>#</Th>
                        <Th>Name</Th>
                        <Th>Symbol</Th>
                        <Th>Price</Th>
                        <Th>24h</Th>
                        <Th>24h Volume</Th>
                        <Th>Market Cap</Th>
                    </tr>
                </thead>
                <tbody>
                        {
                            coinList.map(coin => (
                                <Tr key={coin.id} >
                                    <RankTd>
                                        <RankDiv>
                                            {userInfo.portfolio.some(item => item === coin.id) ? <StyledStarIcon data-coin-id={coin.id} onClick={toggleAddPortfolio} /> : <StyledStarBorder data-coin-id={coin.id} onClick={toggleAddPortfolio} />}
                                            {coin.market_cap_rank}
                                        </RankDiv>
                                    </RankTd>
                                    <CoinNameTd>
                                        <StyledLink to={`/coins/${coin.id}`} >
                                            <CoinImg src={coin.image.small}/>  {coin.name}
                                        </StyledLink>
                                    </CoinNameTd>
                                    <SymbolTd>{coin.symbol.toUpperCase()}</SymbolTd>
                                    <Td>${(Math.floor(coin.market_data.current_price.usd * 100) / 100).toLocaleString()}</Td>
                                    <PriceChangeTd priceChange={coin.market_data.market_cap_change_percentage_24h}>{Math.floor(coin.market_data.market_cap_change_percentage_24h * 10) / 10}%</PriceChangeTd>
                                    <Td volume={coin.market_data.total_volume.usd} >${coin.market_data.total_volume.usd.toLocaleString()}</Td>
                                    <Td mktCap={coin.market_data.market_cap.usd} >${coin.market_data.market_cap.usd.toLocaleString()}</Td>
                                </Tr>
                            ))
                        }
                </tbody>
            </Table>
            </TableWrapper>
            }
        </PortfolioContainer>
    )
}

export default Portfolio
