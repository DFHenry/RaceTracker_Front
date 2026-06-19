export default function Laps(props)
{
    return(
        <div>
            <p>{props.polePosition}</p>
            <p>{props.lapRacer}</p>
            <p>{props.lapTime}</p>
        </div>
    )
}