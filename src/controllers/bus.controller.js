import { getConnection } from "../db/index.js";
import {asyncHandler} from "../utils/asynchandler.js";

console.log("Connection starting in route controller...")
const conn = await getConnection();

const fetchStops = asyncHandler (async (req, res) => {
          
    const [stops] = await conn.execute('SELECT DISTINCT stopName FROM routestop');
    
    if (stops.length ==0){
        throw new Error ("Buses unavailable!")
    }

    const stopNames = stops.map(({ stopName }) => stopName);
    console.log(stopNames)
    return res.json(stopNames);
})

const findBus = asyncHandler (async (req, res) => {
  const {start, stop} = req.body
    //validation - not empty
    if (
        [start, stop].some((field) => field?.trim() === "")
    ){
        throw new Error ("All fields are required");
    }
        
    const [buses] = await conn.execute('SELECT * FROM buses INNER JOIN routes ON buses.routeId = routes.routeId WHERE routes.start=? and routes.stop=?',[start, stop]);
    console.log(buses)
    if (buses.length ==0){
        throw new Error ("Buses unavailable!")
    }
    return res.json(
        buses.map((bus) => ({
            busId: bus.id,
            busNumber: bus.busNumber,
            busName: bus.busName,
            busPrice: bus.price,
            busCapacity: bus.capacity,
            busDepart: bus.departure,
            busDuration: bus.duration,
            busDistance: bus.distance,
            start: start,
            stop: stop
        }))
        );
})

const bookSeat = asyncHandler (async (req, res) => {
  const {seatNumber, busId, userId, journeyDate} = req.body
    //validation - not empty
    if (
        [seatNumber, busId, userId, journeyDate].some((field) => String(field)?.trim() === "")
    ){
        throw new Error ("All fields are required");
    }  
    const [booking] = await conn.execute('SELECT bookingId,status FROM bookings WHERE busId=? AND userId=? AND journeyDate=? AND seatNumber=?',[busId, userId, journeyDate, seatNumber]);
    if (booking.length>0){
        throw new Error ("Seat already booked!")
    }
    const [bookingDone] = await conn.execute('INSERT INTO bookings(userId, busId, journeyDate, seatNumber ) values(?,?,?,?)', [userId, busId, journeyDate, seatNumber])
    console.log('Inserted ID:', bookingDone.insertId);
    return res.json({message:"Booked!"});
})

//await conn.end();
export {findBus, bookSeat, fetchStops}