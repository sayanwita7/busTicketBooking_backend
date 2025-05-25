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
  const {seatNumber, busId, userId, journeyDate, start, stop, price} = req.body
    //validation - not empty
    if (
        [seatNumber, busId, userId, journeyDate,start,stop,price].some((field) => String(field)?.trim() === "")
    ){
        throw new Error ("All fields are required");
    }  
    const [booking] = await conn.execute('SELECT bookingId,status FROM bookings WHERE busId=? AND userId=? AND journeyDate=? AND seatNumber=?',[busId, userId, journeyDate, seatNumber]);
    if (booking.length>0){
        throw new Error ("Seat already booked!")
    }
    const [bookingDone] = await conn.execute('INSERT INTO bookings(userId, busId, journeyDate, seatNumber) values(?,?,?,?)', [userId, busId, journeyDate, seatNumber])
    const bookingId = bookingDone.insertId
    const [busDetails]= await conn.execute('SELECT busName, busNumber FROM buses WHERE Id=?',[busId])
    const [ticketDone] = await conn.execute('INSERT INTO tickets(bookingId, journeyDate, start, stop, seatNumber, price ) values(?,?,?,?,?,?)', [bookingId, journeyDate, start, stop,seatNumber,  price])
    //console.log('Inserted ID:', bookingDone.insertId);
    return res.json({message:"Booking Done!", 
        bookingDetails:{
            busName:busDetails[0].busName,
            busNumber: busDetails[0].busNumber,
            bookingId: bookingId, 
            ticketId: ticketDone.insertId, 
            start:start,
            stop:stop,
            journeyDate:journeyDate,
            seatNumber: seatNumber,
            price:price,
        }
    });
})

const findSeat = asyncHandler (async (req, res) => {
    const busIdString= req.body.busId
    const journeyDateString= req.body.journeyDate
    //validation - not empty
    if ([busIdString,journeyDateString].some((field) => String(field)?.trim() === "")){
        throw new Error ("All fields are required");
    }  
    const busId=Number(busIdString)
    const journeyDateObj = new Date(journeyDateString)
    const journeyDate = journeyDateObj.toISOString().split("T")[0];
    const [seats] = await conn.execute('SELECT seatNumber FROM bookings WHERE busId=? AND journeyDate=?',[busId, journeyDate]);
    const seatNumbers = seats.map(({ seatNumber }) => seatNumber);
    return res.json(seatNumbers);
})

const fetchTicket = asyncHandler (async (req, res) => {
    const ticketIdString= req.body.ticketId
    //validation - not empty
    if ([ticketIdString].some((field) => String(field)?.trim() === "")){
        throw new Error ("All fields are required");
    }  
    const ticketId=Number(ticketIdString)
    const [seats] = await conn.execute('SELECT tickets.journeyDate, buses.busName, buses.busNumber, tickets.seatNumber, buses.departure, tickets.start, tickets.stop, tickets.price FROM tickets INNER JOIN bookings ON tickets.bookingId = bookings.bookingId INNER JOIN buses ON bookings.busId = buses.Id');
})

//await conn.end();
export {fetchStops, findBus, bookSeat, findSeat, fetchTicket }