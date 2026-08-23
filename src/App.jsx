import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register    from './assets/Register';
import Login       from './assets/Login';
import Home        from './assets/Home';
import CreateEvent from "./assets/CreateEvent";
import FindEvents  from "./assets/FindEvents";
import Myevent     from './assets/Myevent';
import EditEvent   from './assets/EditEvent';
import EventDetail from './assets/EventDetail';   // ← NEW
import AuthProvider from './context/Authcontext';
import PaymentPage from './assets/PaymentPage';
import PaymentSuccess from './assets/PaymentSuccess';
import MyBookings from './assets/Mybookings';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/"                    element={<Home />}        />
          <Route path="/login"               element={<Login />}       />
          <Route path="/register"            element={<Register />}    />
          <Route path="/create-event"        element={<CreateEvent />} />
          <Route path="/events"              element={<FindEvents />}  />
          <Route path="/events/:id"          element={<EventDetail />} /> {/* ← NEW */}
          <Route path="/my-events"           element={<Myevent />}     />
          <Route path="/events/edit/:id"     element={<EditEvent />}   />
          <Route path="/payment/:id"         element={<PaymentPage />} />
          <Route path="/payment-success"     element={<PaymentSuccess />} />
          <Route path="/my-bookings"         element={<MyBookings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;