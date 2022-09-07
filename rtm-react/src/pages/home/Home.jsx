import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { io } from 'socket.io-client';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';


export default function Home() {
  const { user } = useContext(AuthContext);
  const [activeUser,setActiveUser] = useState([])
  const [cord,setCord] = useState({})
  const [activeDriver,setActiveDriver] = useState([])
  let socket = io("ws://127.0.0.1:8900")
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit("new user", { userId: user._id, role: user.role, username: user.username, latitude: position.coords.latitude, longitude: position.coords.longitude,hotelId: user.hotelId,room:"room-"+user.hotelId});
      var c= {longitude: position.coords.longitude, latitude: position.coords.latitude}
      setCord(c)
    });
  },[user])

  
  useEffect(() => {
    if (user.role === "admin") {
      socket.on("activeUser", (users) => {
        setActiveUser(users)
      })
    }

    if (user.role === "guest") {
      socket.on("active guest", (users) => {
        setActiveUser(users)
      })
    }

    if (user.role === "driver"){
      function setLoc(){
        var c= {longitude: Math.random(), latitude: Math.random()}
        setCord(c)
        navigator.geolocation.getCurrentPosition(function (position) {
          socket.emit("active driver", { userId: user._id, role: user.role, username: user.username, latitude: cord.latitude, longitude: cord.longitude,hotelId: user.hotelId,room:"room-"+user.hotelId});
        });
      }
      const interval = setInterval(()=>setLoc(),10000)
      return () => {
          clearInterval(interval);
        }
    }
  }, [cord]);
  
  useEffect(() =>{
    function setRole(){
      if(user.role === "admin"){
        socket.emit("activeDriver",{"room":"room-"+user.hotelId,"hotelId":user.hotelId})
        socket.off("msg").once("msg", (u) => {
          setActiveDriver(u)
        });
        }
    
        if(user.role === "guest"){
          socket.emit("guest",{"hotelId":1,"driverId":"63172db6a88b858015fd09d3"})
          socket.off("booked driver").once("booked driver", (u) => {
            setActiveDriver([u])
          });
        }
    }
    const interval = setInterval(()=>setRole(),10000)
    return () => {
        clearInterval(interval);
      }
    
  },[activeUser])

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Real Time Location</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">

            </Nav>
            <Nav>
              <Nav.Link eventKey={2} href="#memes" disabled>
                {user.role}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Table striped bordered hover>
          <thead>
            <tr className="dark">
              <th>User ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {activeDriver.map((user)=>(
              <tr key={user?.userId}>
                <td>{user?.userId}</td>
                <td>{user?.username}</td>
                <td>{user?.role}</td>
                <td>{user?.latitude}</td>
                <td>{user?.longitude}</td>
              </tr>
            ))}
            
            
          </tbody>
        </Table>
      </Container>
    </>
  )
}
