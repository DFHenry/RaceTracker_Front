import { useState, useEffect } from "react";
import RaceData from "../props/RaceData/raceData";
import RacerReg from "../props/RacerReg/racerReg";

export default function getRacingData()
{
    const [count, setCount] = useState(0);
    const [racingData, setRaceData] = useState("");
    const [racers, setRacers] = useState([]);

    const racerArray = [];

    useEffect(() =>
    {

        const getData = async () => 
        {
            console.log("ping");
            let response = await fetch("http://localhost:8888/api/sendApi");
            let data = await response.json();

            setRaceData(data);
            setRacers(data.racers);
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
            
        </div>
    )}
    else if(racingData.raceState == "registration")
    {
        console.log(racerArray.racers);
        if(racerArray.length > racingData.racers.length)
        {
            racerArray.push(racingData.racers.length - 1);
        }
    
        return(
            <>
                <p>Registration is Active!</p>
                <table>
                    <thead>
                        <th>Racer Name</th>
                        <th>Vehicle Number</th>
                    </thead>
                    <tbody>
                        {racers.map((m, i) =>
                        <tr key={i}>
                            <td>{m.racerName}</td>
                            <td>{m.vehicleNumber}</td>
                        </tr>
                )}
                    </tbody>
                </table>

            </>
        );
    }

    else if(racingData.raceState == "starting")
    {
        return(
            <>
                <p>Get Ready To Race!</p>
            </>
        )
    }
}
