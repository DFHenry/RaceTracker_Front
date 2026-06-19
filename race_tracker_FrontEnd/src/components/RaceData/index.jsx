import { useState, useEffect } from "react";
import RaceData from "../props/RaceData/raceData";
import RacerReg from "../props/RacerReg/racerReg";
import Laps from "../props/Laps/laps";

export default function getRacingData()
{
    //api variables
    const [count, setCount] = useState(0);
    const [racingData, setRaceData] = useState("");
    const [racers, setRacers] = useState([]);
    const [noOfLaps, setNoOfLaps] = useState(0);
    const [noOfRacers, setNoOfRacers] = useState(0);
    const [laps, setLaps] = useState([]);

    //countdown variables
    const [countdown, setCountdown] = useState(10);
    const [countdownOn, setCountDownOn] = useState(false);

    //stopwatch variables
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    
    //lap display variables
    const [lapDisplay, setNewLap] = useState([]);
    const [lapIndex, setLapIndex] = useState(0);

    //final positions variables
    const [finalPositions, setFinalPositions] = useState([]);
    const [lapCounter, setLapCounter] = useState(0);


    //useEffect for fetching API Data
    useEffect(() =>
    {
        const getData = async () => 
        {
            let response = await fetch("http://localhost:8888/api/sendApi/raceData");
            let data = await response.json();

            setRaceData(data);
            setRacers(data.racers);
            setNoOfLaps(data.noOfLaps);
            setLaps(data.laps);
            setNoOfRacers(data.racers.length);
        }
        getData();

        const timer = setInterval(() => 
        {
            setCount(prevCount => prevCount + 1);
            getData();
        }, 650);

        //countdown and stopwatch variables
        let countdownId;
        let intervalId;

        if(countdownOn)
        {
            countdownId = setInterval(() => setTime(prev => prev - 1), 1000);
        }

        if(isRunning)
        {
            intervalId = setInterval(() => setTime(prev => prev + 1), 10);
        }

        return () => 
            {
                clearInterval(countdownId);
                clearInterval(intervalId);
                clearInterval(timer); 
            }
    }, [countdownOn, isRunning]);

    //useEffect for displaying laps
    useEffect(() =>
    {
        //check for valid lap data
        if (!Array.isArray(racingData?.laps) || noOfRacers <= 0)
        {
            return;
        } 

        //check if all racers have completed a lap
        if (lapDisplay.length >= noOfRacers)
        {
            return;
        } 

        //check if lap index is out of bounds
        if (lapIndex >= racingData.laps.length)
        {
            return;
        }

        //update lapDisplay and lapIndex
        setNewLap(prev => [...prev, racingData.laps[lapIndex]]);
        setLapIndex(prev => prev + 1);

        //check of all racers have completed all laps
        // if(lapCounter == noOfLaps)
        // {
        //     console.log("race is concluding");
        //     setFinalPositions(lapDisplay);
        // }

    }, [racingData.laps, lapDisplay.length, lapIndex, noOfRacers]);

    //useEffect for clearing lap data once all racers have completed a lap, after 5 seconds
    useEffect(() => 
    {
        //check for valid lap data
        if (noOfRacers <= 0 || lapDisplay.length !== noOfRacers)
        {
            return;
        }

        //clear lap data after 5 seconds
        const clearTimer = window.setTimeout(() => 
        {
            setFinalPositions(lapDisplay);
            setNewLap([]);
        }, 5000);

        //cleanup timer
        return () => 
        {
            window.clearTimeout(clearTimer);
        };
    }, [lapDisplay.length, noOfRacers, finalPositions]);

    //countdown variables
    const countdownTimer = Math.floor(countdown);
    let goMessage = "";

    const watchMinutes = Math.floor((time % 360000) / 6000);

    const watchSeconds = Math.floor((time % 6000) / 100);

    const watchMilliseconds = time % 100;

    //let curNoOfracers = noOfRacers + 0;

    if(racingData.raceState == "running")
    {
        setTimeout(countDownGoDown, 1000);
    }

    if(racingData.raceState != "running")
    {
        setTimeout(countReset, 1000);
    }

    function countDownGoDown()
    {
        setCountdown(countdown - 1);
        if(countdown <= 1 && isRunning == false)
        {
            setIsRunning(true);
        }
    }

    //resets all lap information when race is not running
    function countReset()
    {
        setCountdown(9);
        setCountDownOn(false);
        setTime(0);
        setIsRunning(false);
        setLaps([]);
        setNewLap([]);
        setLapIndex(0);
        setLapCounter(0);
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

    //race states and rendering
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
                <table>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Racer</th>
                            <th>Lap Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lapDisplay.map((m, i) => 
                            <tr key={i}>
                                <td>{m.polePosition}</td>
                                <td>{m.lapRacer}</td>
                                <td>{m.lapTime}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>
        );
    }

    else if (racingData.raceState == "finishing")
    {
        return(
            <>
                <p>Race Has Concluded</p>
                <table>
                    <thead>
                        <tr>
                            <th>Final Position</th>
                            <th>Name</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalPositions.map((m, i) =>
                            <tr key={i}>
                                <td>{m.polePosition}</td>
                                <td>{m.lapRacer}</td>
                                <td>{m.lapTime}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </>
        )
    }
}
