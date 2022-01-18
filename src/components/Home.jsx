import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { updatePortfolio } from '../features/auth/authSlice';


const HomeContainer = styled.div`
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

const HeaderRow = styled.tr`
    background-color: grey;
`;

const Th = styled.th`
    border-bottom: 2px solid ${borderColor};
    border-top: 2px solid ${borderColor};
    padding: 0.8rem;
    font-size: 1.4rem;
    cursor: pointer;
    transition: 0.4s ease all;
    user-select: none;
    &:nth-child(2), :nth-child(1), :nth-child(4), :nth-child(5){
        text-align: left;
    }
    &:hover{
        color: black;
        transition: 0.4s ease all;
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


const Home = () => {
    const token = localStorage.getItem('authToken');

    const [coinList, setCoinList] = useState([]);
    const [unchangedCoinList, setUnchangedCoinList] = useState([]);
    const [rankOrder, setRankOrder] = useState(0);
    const [nameOrder, setNameOrder] = useState(0);
    const [priceOrder, setPriceOrder] = useState(0);
    const [change24Order, setChange24Order] = useState(0);
    const [volume24Order, setVolume24Order] = useState(0);
    const [mktCapOrder, setMktCapOrder] = useState(0);

    const userInfo = useSelector(state => state.auth);
    
    const dispatch = useDispatch();

    const fetchCoinData = async () => {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        const result = await response.json();
        console.log(result);
        setCoinList(result);
        setUnchangedCoinList(result);
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

    const orderBy = (e) => {
        console.log(e.target.dataset.header)
        const orderHeader = e.target.dataset.header;
        let coinListCopy = [...coinList];

        switch (orderHeader) {
            case 'rank':
                switch (rankOrder) {
                    case 0:
                        coinListCopy = coinListCopy.sort((a,b) => a.market_cap_rank - b.market_cap_rank);
                        setCoinList(coinListCopy);
                        setRankOrder(1);
                        setNameOrder(0);
                        setPriceOrder(0);
                        setChange24Order(0);
                        setVolume24Order(0);
                        setMktCapOrder(0);
                        break;
                    case 1:
                        coinListCopy = coinListCopy.sort((a,b) => b.market_cap_rank - a.market_cap_rank);
                        setCoinList(coinListCopy);
                        setRankOrder(2);
                        break;
                    case 2:
                        setCoinList(unchangedCoinList);
                        setRankOrder(0);
                        break;
                    default:
                        break;
                }
                break;
            case 'name':
                switch (nameOrder) {
                    case 0:
                        coinListCopy = coinListCopy.sort((a,b) => a.name.localeCompare(b.name));
                        setCoinList(coinListCopy);
                        setNameOrder(1);
                        setRankOrder(0);
                        setPriceOrder(0);
                        setChange24Order(0);
                        setVolume24Order(0);
                        setMktCapOrder(0);
                        break;
                    case 1:
                        coinListCopy = coinListCopy.sort((a,b) => b.name.localeCompare(a.name));
                        setCoinList(coinListCopy);
                        setNameOrder(2);
                        break;
                    case 2:
                        setCoinList(unchangedCoinList);
                        setNameOrder(0);
                        break;
                    default:
                        break;
                }
                break;
            case 'price':
                switch (priceOrder) {
                    case 0:
                        coinListCopy = coinListCopy.sort((a,b) => a.current_price - b.current_price);
                        setCoinList(coinListCopy);
                        setPriceOrder(1);
                        setNameOrder(0);
                        setRankOrder(0);
                        setChange24Order(0);
                        setVolume24Order(0);
                        setMktCapOrder(0);
                        break;
                    case 1:
                        coinListCopy = coinListCopy.sort((a,b) => b.current_price - a.current_price);
                        setCoinList(coinListCopy);
                        setPriceOrder(2);
                        break;
                    case 2:
                        setCoinList(unchangedCoinList);
                        setPriceOrder(0);
                        break;
                    default:
                        break;
                }
                break;
            case '24h-change':
                switch (change24Order) {
                    case 0:
                        coinListCopy = coinListCopy.sort((a,b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
                        setCoinList(coinListCopy);
                        setChange24Order(1);
                        setPriceOrder(0);
                        setNameOrder(0);
                        setRankOrder(0);
                        setVolume24Order(0);
                        setMktCapOrder(0);
                        break;
                    case 1:
                        coinListCopy = coinListCopy.sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
                        setCoinList(coinListCopy);
                        setChange24Order(2);
                        break;
                    case 2:
                        setCoinList(unchangedCoinList);
                        setChange24Order(0);
                        break;
                    default:
                        break;
                }
                break;
            case '24h-volume':
                switch (volume24Order) {
                    case 0:
                        coinListCopy = coinListCopy.sort((a,b) => a.total_volume - b.total_volume);
                        setCoinList(coinListCopy);
                        setChange24Order(0);
                        setPriceOrder(0);
                        setNameOrder(0);
                        setRankOrder(0);
                        setVolume24Order(1);
                        setMktCapOrder(0);
                        break;
                    case 1:
                        coinListCopy = coinListCopy.sort((a,b) => b.total_volume - a.total_volume);
                        setCoinList(coinListCopy);
                        setPriceOrder(2);
                        break;
                    case 2:
                        setCoinList(unchangedCoinList);
                        setPriceOrder(0);
                        break;
                    default:
                        break;
                }
                break;
            case 'mkt-cap':
                switch (mktCapOrder) {
                    case 0:
                        coinListCopy = coinListCopy.sort((a,b) => a.market_cap - b.market_cap);
                        setCoinList(coinListCopy);
                        setMktCapOrder(1);
                        setChange24Order(0);
                        setPriceOrder(0);
                        setNameOrder(0);
                        setRankOrder(0);
                        setVolume24Order(0);
                        break;
                    case 1:
                        coinListCopy = coinListCopy.sort((a,b) => b.market_cap - a.market_cap);
                        setCoinList(coinListCopy);
                        setMktCapOrder(2);
                        break;
                    case 2:
                        setCoinList(unchangedCoinList);
                        setMktCapOrder(0);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    return (
        <HomeContainer>
            <h2>Welcome, {userInfo.name} {userInfo.lastName}</h2>

            {coinList && 
            <TableWrapper>
            <Table>
                <thead>
                    <HeaderRow>
                        <Th data-header='rank' onClick={orderBy}># {rankOrder === 1 ? '↑' : rankOrder === 2 ? '↓' : ''}</Th>
                        <Th data-header='name' onClick={orderBy}>Name {nameOrder === 1 ? '↑' : nameOrder === 2 ? '↓' : ''}</Th>
                        <Th>Symbol</Th>
                        <Th data-header='price' onClick={orderBy}>Price {priceOrder === 1 ? '↑' : priceOrder === 2 ? '↓' : ''}</Th>
                        <Th data-header='24h-change' onClick={orderBy}>24h {change24Order === 1 ? '↑' : change24Order === 2 ? '↓' : ''}</Th>
                        <Th data-header='24h-volume' onClick={orderBy}>24h Volume {volume24Order === 1 ? '↑' : volume24Order === 2 ? '↓' : ''}</Th>
                        <Th data-header='mkt-cap' onClick={orderBy}>Market Cap {mktCapOrder === 1 ? '↑' : mktCapOrder === 2 ? '↓' : ''}</Th>
                    </HeaderRow>
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
                                            <CoinImg src={coin.image}/>  {coin.name}
                                        </StyledLink>
                                    </CoinNameTd>
                                    <SymbolTd>{coin.symbol.toUpperCase()}</SymbolTd>
                                    <Td>${(Math.floor(coin.current_price * 100) / 100).toLocaleString()}</Td>
                                    <PriceChangeTd priceChange={coin.price_change_percentage_24h}>{Math.floor(coin.price_change_percentage_24h * 10) / 10}%</PriceChangeTd>
                                    <Td volume={coin.total_volume} >${coin.total_volume.toLocaleString()}</Td>
                                    <Td mktCap={coin.market_cap} >${coin.market_cap.toLocaleString()}</Td>
                                </Tr>
                            ))
                        }
                </tbody>
            </Table>
            </TableWrapper>
            }
        </HomeContainer>
    )
}

export default Home
