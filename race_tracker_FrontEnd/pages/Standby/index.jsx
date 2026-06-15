import { useEffect } from "react";
import RaceData from "../../src/components/RaceData";

export default function Standby()
{
    useEffect(() => 
    {
        document.title = "Standby - Dave's RFID Race Tracking System";
    }, []);

    return(
        <>
            <h1>Dave's RFID Race Tracking System</h1>
            <RaceData />
            <p></p>
        </>
    )
}