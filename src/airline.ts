import { airlineData } from './airlineData';

export const icaoToIata = (icao: string) => {
    const match = airlineData.find(val => val['3char_code'] == icao);
    return match?.['2char_code'];
};

export const iataToIcao = (iata: string) => {
    const match = airlineData.find(val => val['2char_code'] == iata);
    return match?.['3char_code'];
};