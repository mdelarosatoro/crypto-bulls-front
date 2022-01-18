import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const Container = styled.div`
    background: rgb(2,0,36);
    background: linear-gradient(174deg, rgba(2,0,36,1) 0%, rgba(26,26,136,1) 44%, rgba(19,88,174,1) 68%, rgba(15,119,193,1) 85%, rgba(11,152,213,1) 93%, rgba(5,204,245,1) 100%);
    color: #f6f6f6;
    min-height: 91vh;
    padding: 2rem;
    margin-top: 80px;
`;

const RankTag = styled.span`
background-color: grey;
border-radius: 6px;
padding: 0.3rem;
font-size: 0.8rem;
`;

const TitleContainer = styled.div`
display: flex;
margin-top: 1rem;
column-gap: 1rem;
`;

const CoinImg = styled.img`
width: 30px;
height: 30px;
`;

const CoinTitle = styled.h1`
font-size: 1.5rem;
`;

const OneHrPriceChange = styled.span`
    color: ${({priceChange}) => (priceChange > 0 ? 'lightgreen' : 'red')};
    font-weight: bold;
    font-size: 1.2rem;
`;

const PriceTag = styled.span`
font-size: 2.5rem;
font-weight: bold;
`;

const MiniInfoGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 1rem;
    margin-top: 1rem;
    column-gap: 1rem;
    max-width: 750px;
`;

const Column = styled.div`
    display: flex;
    row-gap: 1rem;
    flex-direction: column;
`;

const MiniBlock = styled.div`
    display: flex;
    column-gap: 1rem;
    border-bottom: 1px solid grey;
    justify-content: space-between;
    padding-bottom: 0.5rem;
`;

const MiniBlockTitle = styled.p`
    font-size: 0.9rem;
    color: #f6f6f6;
`;

const MiniBlockData = styled.span`

`;

const Coin = () => {
    const [coinData, setCoinData] = useState({});

    const {coinId} = useParams();

    useEffect(() => {
        fetchCoinData();
    },[]);

    const fetchCoinData = async () => {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const result = await response.json();
        console.log(result)
        setCoinData(result);
        console.log(coinData)
    }

    return (
        <Container>
            {coinData.image && 
            <>
                <RankTag>Rank #{coinData.market_cap_rank}</RankTag>
                <TitleContainer>
                    <CoinImg src={coinData.image.small} />
                    <CoinTitle>{coinData.name} ({coinData.symbol.toUpperCase()})</CoinTitle>
                    <OneHrPriceChange priceChange={Math.floor(coinData.market_data.market_cap_change_percentage_24h_in_currency.usd * 100) / 100}>{Math.floor(coinData.market_data.market_cap_change_percentage_24h_in_currency.usd * 100) / 100}%</OneHrPriceChange>
                </TitleContainer>
                <PriceTag>${coinData.market_data.current_price.usd.toLocaleString()}</PriceTag>

                <MiniInfoGrid>
                    <Column>
                        <MiniBlock>
                            <MiniBlockTitle>Market Cap</MiniBlockTitle>
                            <MiniBlockData>${coinData.market_data.market_cap.usd.toLocaleString()}</MiniBlockData>
                        </MiniBlock>
                        <MiniBlock>
                            <MiniBlockTitle>24h Trading Volume</MiniBlockTitle>
                            <MiniBlockData>${coinData.market_data.total_volume.usd.toLocaleString()}</MiniBlockData>
                        </MiniBlock>
                        {coinData.market_data.fully_diluted_valuation.usd &&
                        <MiniBlock>
                            <MiniBlockTitle>Fully Diluted Valuation</MiniBlockTitle>
                            <MiniBlockData>${coinData.market_data.fully_diluted_valuation.usd.toLocaleString()}</MiniBlockData>
                        </MiniBlock>}
                    </Column>
                    <Column>
                        <MiniBlock>
                            <MiniBlockTitle>Circulating Supply</MiniBlockTitle>
                            <MiniBlockData>{coinData.market_data.circulating_supply.toLocaleString()}</MiniBlockData>
                        </MiniBlock>
                        {coinData.market_data.total_supply &&
                        <MiniBlock>
                            <MiniBlockTitle>Total Supply</MiniBlockTitle>
                            <MiniBlockData>{coinData.market_data.total_supply.toLocaleString()}</MiniBlockData>
                        </MiniBlock>}
                        {coinData.market_data.max_supply &&
                        <MiniBlock>
                            <MiniBlockTitle>Max Supply</MiniBlockTitle>
                            <MiniBlockData>{coinData.market_data.max_supply.toLocaleString()}</MiniBlockData>
                        </MiniBlock>}
                    </Column>
                </MiniInfoGrid>
            </>
            }
        </Container>
    )
}

export default Coin
