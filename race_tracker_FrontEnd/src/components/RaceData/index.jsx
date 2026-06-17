import { useState, useEffect } from "react";
import RaceData from "../props/RaceData/raceData";
import RacerReg from "../props/RacerReg/racerReg";

export default function getRacingData()
{
    //api variables
    const [count, setCount] = useState(0);
    const [racingData, setRaceData] = useState("");
    const [racers, setRacers] = useState([]);

    //countdown variables
    const [countdown, setCountdown] = useState(10);
    const [countdownOn, setCountDownOn] = useState(false);

    //stopwatch variables
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const racerArray = [];

    useEffect(() =>
    {
        const getData = async () => 
        {
            let response = await fetch("http://localhost:8888/api/sendApi");
            let data = await response.json();

            setRaceData(data);
            setRacers(data.racers);

            // if(getRacingData.raceState != "running")
            // {
            //     setCountDownOn(false);
            //     setCountdown(10);
            //     setIsRunning(false);
            //     setTime(0);
            // }
        }
        getData();

        const timer = setInterval(() => 
        {
            setCount((prevCount) => prevCount + 1);
            getData();

        }, 750);

        let countdownId;

        let intervalId;

        if(countdownOn)
        {
            countdownId = setInterval(() => setTime(countdown - 1), 1000);
            console.log(countdown);
        }

        if(isRunning)
        {
            intervalId = setInterval(() => setTime(time + 1), 10);
        }

        return () => 
            {
                clearInterval(countdownId);
                clearInterval(intervalId);
                clearInterval(timer); 
            }

    }, [countdownOn, countdown, isRunning, time]);

    const countdownTimer = Math.floor(countdown);
    let goMessage = "";

    const watchMinutes = Math.floor((time % 360000) / 6000);

    const watchSeconds = Math.floor((time % 6000) / 100);

    const watchMilliseconds = time % 100;

    setTimeout(countDownGoDown, 1000);

    function countDownGoDown()
    {
        setCountdown(countdown - 1);
        if(countdown <= 1 && isRunning == false)
        {
            setIsRunning(true);
        }
    }

    if(countdownTimer > 0)
    {
        goMessage = countdownTimer;
        if(setCountDownOn == false)
        {
            countDownGoDown;
        }
    }
    else if(countdownTimer <= 0 && countdownTimer >=-29)
    {
        // console.log("Stop Watch Started: " + countdownTimer.toString());
        goMessage = "GO!";
    }
    else
    {
        goMessage = "";
    }

    if(racingData.raceState == "standby")
    {
        return(
            <div>
                <p>Standby For A New Race</p>
            </div>
        );
    }

    else if(racingData.raceState == "registration")
    {
        //console.log(racerArray.racers);
        if(racerArray.length > racingData.racers.length)
        {
            racerArray.push(racingData.racers.length - 1);
        }
    
        return(
            <>
                <p>Registration is Active!</p>
                <table>
                    <thead>
                        <tr>
                            <td>Racer Name</td>
                            <td>Vehicle Number</td>
                        </tr>

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

    else if(racingData.raceState == "running")
    {
        return(
            <>
                <p>Race Is Running</p>
                <p>{goMessage}</p>
                <p>{watchMinutes.toString().padStart(2, "0")}:
                   {watchSeconds.toString().padStart(2, "0")}:
                   {watchMilliseconds.toString().padStart(2, "0")} 
                </p>
            </>
        );
    }

    else if (racingData.raceState == "finishing")
    {
        return(
            <>
                <p>Race Has Concluded</p>
            </>
        )
    }
}
