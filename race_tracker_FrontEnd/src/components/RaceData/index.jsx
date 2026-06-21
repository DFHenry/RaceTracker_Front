import { useState, useEffect } from "react";
import RaceData from "../props/RaceData/raceData";
import RacerReg from "../props/RacerReg/racerReg";
import Laps from "../props/Laps/laps";

//import images
import cart1 from "../../assets/img/cart1.jpg";
import cart2 from "../../assets/img/cart2.jpg";
import cart3 from "../../assets/img/cart3.jpg";
import cart4 from "../../assets/img/cart4.jpg";
import chevron from "../../assets/img/chevronMask.svg";

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
                <div class="standbyImages">
                    <img src={cart1} alt="alt text here" />
                    <img src={cart2} alt="alt text here" />
                    <img src={cart3} alt="alt text here" />
                    <img src={cart4} alt="alt text here" />
                </div>
            </div>
        );
    }

    else if(racingData.raceState == "registration")
    {    
        return(
            <>
                <div class="regTitle">
                    <h2>A New Race Is Beginning! See Attendant To Register!</h2>
                </div>

                <table class="regTable">
                    <thead>
                        <tr>
                            <td>Vehicle</td>
                            <td>Racer Name</td>
                        </tr>
                    </thead>
                    <tbody>
                        {racers.map((m, i) =>
                            <tr className="racerData" key={i}>
                                <td class="vehicleDot">
                                    <img src={chevron} alt="chevron" />
                                    <p>{m.vehicleNumber}</p>
                                </td>
                                <td class="regRacerName">
                                    <p>{m.racerName}</p>
                                </td>
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
            <div class="raceStart">
                <h2>Race Is Beginning! All Racers To Their Vehicles!</h2>
            </div>
        )
    }

    else if(racingData.raceState == "running")
    {
        return(
            <>
                <p class="stopwatch">{watchMinutes.toString().padStart(2, "0")}:
                   {watchSeconds.toString().padStart(2, "0")}:
                   {watchMilliseconds.toString().padStart(2, "0")} 
                </p>
                <p class="goMessage">{goMessage}</p>
                <table class="raceTable">
                    <thead>
                        <tr class="raceTableHeadings">
                            <th>PolePosition</th>
                            <th>Racer name</th>
                            <th>Lap Time</th>
                        </tr>
                    </thead>
                    <tbody class="allLapData">
                        {lapDisplay.map((m, i) => 
                            <tr class="lapData" key={i}>
                                <td class="polePosition">
                                    <img src={chevron} alt="chevron" />
                                    <p>{m.polePosition}</p></td>
                                <td class="runRacerName">
                                    <p>{m.lapRacer}</p>
                                </td>
                                <td class="lapTime">
                                    <p>{m.lapTime}</p>
                                </td>
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
                <div class="raceFinishedTitle">
                    <h2>Race Is Finished!</h2>
                    <h3>Final Positions</h3>
                </div>

                <table class="finalTable">
                    <thead>
                        {/* <tr>
                            <th>Final Position</th>
                            <th>Name</th>
                        </tr> */}
                    </thead>
                    <tbody class="finalLapBody">
                        {finalPositions.map((m, i) =>
                            <tr class="finalLapData" key={i}>
                                <td class="finalPolePosition">
                                    <img src={chevron} alt="" />
                                    <p>{m.polePosition}</p></td>
                                <td class="finalRacerName"><p>{m.lapRacer}</p></td>                            </tr>
                        )}
                        {/* <tr class="finalLapData">
                            <td class="finalPolePosition">
                                <img src={chevron} alt="" />
                                <p>1st</p>
                            </td>
                            <td class="finalRacerName"><p>David</p></td>
                        </tr> */}
                    </tbody>
                </table>
                <p class="finalMessage">Congratulations!</p>
            </>
        )
    }
}
