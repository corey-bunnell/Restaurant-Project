import React from "react";
import { updateStatus } from "../utils/api";
import { useHistory } from "react-router";

function ReservationTile({ reservation }) {
  const history = useHistory();
  const cancelButton = async (event) => {
    if (
      window.confirm(
        `Do you want to cancel this reservation? This cannot be undone.`
      )
    ) {
      await updateStatus(reservation.reservation_id, "cancelled");
      history.go(0);
    }
  };

  return (
    <div className="col-12 col-lg-4 bg-dark text-white py-3 mb-2 mr-2 rounded">
      <p>First Name: {reservation.first_name}</p>
      <p>Last Name: {reservation.last_name}</p>
      <p>Phone Number: {reservation.mobile_number}</p>
      <p>Party Size : {reservation.people} </p>
      <p>Reservation Time: {reservation.reservation_time.substring(0, 5)}</p>
      <p data-reservation-id-status={reservation.reservation_id}>
        Status: {reservation.status}
      </p>
      {reservation.status === "booked" && (
        <div>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button" className="btn btn-success btn-sm mr-2">
              Seat
            </button>
          </a>
          <a href={`/reservations/${reservation.reservation_id}/edit`}>
            <button type="button" className="btn btn-primary btn-sm mr-2">
              Edit
            </button>
          </a>
        </div>
      )}
      <button
        type="button"
        className="btn btn-danger btn-sm my-2"
        onClick={cancelButton}
        data-reservation-id-cancel={reservation.reservation_id}
      >
        Cancel
      </button>
    </div>
  );
}

export default ReservationTile;
