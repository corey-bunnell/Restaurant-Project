import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  const [reservation, setReservation] = useState([]);
  const [hasError, setHasError] = useState("");
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    const getReservation = async () => {
      const response = await readReservation(params.reservation_id);
      const formattedDate = response.reservation_date?.substring(0, 10);
      response.reservation_date = formattedDate;
      setReservation(response);
    };
    getReservation();
  }, [params]);

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
    const response = await updateReservation(reservation);
    if (response.error) {
      return setHasError(response.error);
    }
    history.push(`/dashboard?date=${reservation.reservation_date}`);
  };

  return (
    <div>
      <h1>Edit Reservation</h1>
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

export default EditReservation;
