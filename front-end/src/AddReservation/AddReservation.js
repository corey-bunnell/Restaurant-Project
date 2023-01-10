import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function AddReservation() {
  const initialReservationState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const [reservation, setReservation] = useState({
    ...initialReservationState,
  });
  const [hasError, setHasError] = useState("");
  const history = useHistory();

  const changeHandler = (event) => {
    setReservation({ ...reservation, [event.target.name]: event.target.value });
  };

  const changeToNumber = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: parseInt(target.value),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await createReservation({
      ...reservation,
      status: "booked",
    });
    if (response.error) {
      return setHasError(response.error);
    }
    history.push(`/dashboard?date=${reservation.reservation_date}`);
  };

  return (
    <div>
      <h1>New Reservation</h1>
      <ReservationForm
        changeHandler={changeHandler}
        changeToNumber={changeToNumber}
        handleSubmit={handleSubmit}
        reservation={reservation}
      />
      {hasError && <p className="alert alert-danger">{hasError}</p>}
    </div>
  );
}

export default AddReservation;
