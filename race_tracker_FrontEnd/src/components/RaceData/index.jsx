import { useState, useEffect } from "react";
import RaceData from "../props/RaceData/raceData";
import {Link} from "react-router";

export default function getRacingData()
{
    const [count, setCount] = useState(0);
    const [racingData, setRaceData] = useState("");

    useEffect(() =>
    {

        const getData = async () => 
        {
            console.log("ping");
            let response = await fetch("http://localhost:8888/api/sendApi");
            let data = await response.json();

            setRaceData(data);
        }
        getData();

        const timer = setInterval(() => 
        {
            setCount((prevCount) => prevCount + 1);
            getData();
        }, 1000);
        //getData();

        return () => clearInterval(timer);
    }, []);

    if(racingData.raceState == "standby")
    {
    return(
        <div>
            <p>Standby For A New Race</p>
            <p>{count}</p>
        </div>
    )}
    else
    {
    return(
        <div>
            <p>Registration Is Active!</p>
            <p>{count}</p>
        </div>
    )}        
}