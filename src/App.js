import { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import useWeatherAPI from './hook/useWeatherAPI';
import WeatherCard from './components/WeatherCard';
import { getMoment,findLocation } from './utils/helpers';
import WeatherSetting from './components/WeatherSetting';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = 'CWB-507B37E0-0383-4D8C-878D-628B54EC3536';



const App = () => {
  const storyCity = localStorage.getItem('cityName') || '臺北市'
  const [currentTheme, setCurrentTheme] = useState('light');
  const [curPage, setCurPage] = useState('WeatherCard')
  const [curcity, setcurcity] = useState(storyCity)
  const curLocation = useMemo(() => findLocation(curcity), [curcity])
  const {cityName, locationName, sunriseCityName} = curLocation
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  
  const handleCurCityChange = (city) => {
    setcurcity(city)
  }
  const handleCurPageChang = (page) => {
    setCurPage(page)
  }

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {curPage === 'WeatherCard' && 
          (<WeatherCard
            cityName = {cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurPageChang = {handleCurPageChang}/>)
        }
        {curPage === 'WeatherSetting' && 
        (<WeatherSetting
          cityName = {cityName}
          handleCurPageChang = {handleCurPageChang}
          handleCurCityChange = {handleCurCityChange}/>)}
      </Container>
    </ThemeProvider>
  );
};

export default App;