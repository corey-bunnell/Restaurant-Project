import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({
  changeHandler,
  changeToNumber,
  handleSubmit,
  reservation,
}) {
  const history = useHistory();
  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-4">
            <label htmlFor="first_name">
              First Name
              <input
                className="form-control"
                id="first_name"
                type="text"
                name="first_name"
                required={true}
                onChange={changeHandler}
                value={reservation.first_name}
              />
            </label>
          </div>
          <div className="col-4">
            <label htmlFor="last_name">
              Last Name
              <input
                className="form-control"
                id="last_name"
                type="text"
                name="last_name"
                required={true}
                onChange={changeHandler}
                value={reservation.last_name}
              />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <label htmlFor="mobile_number">
              Mobile Number
              <input
                className="form-control"
                id="mobile_number"
                type="text"
                placeholder="831-469-5968"
                pattern="^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$"
                name="mobile_number"
                required={true}
                onChange={changeHandler}
                value={reservation.mobile_number}
              />
            </label>
          </div>
          <div className="col-4">
            <label htmlFor="reservation_date">
              Reservation Date
              <input
                className="form-control"
                id="reservation_date"
                type="date"
                name="reservation_date"
                required={true}
                onChange={changeHandler}
                value={reservation.reservation_date}
              />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <label htmlFor="reservation_time">
              Reservation Time
              <input
                className="form-control"
                id="reservation_time"
                type="time"
                name="reservation_time"
                required={true}
                onChange={changeHandler}
                value={reservation.reservation_time}
              />
            </label>
          </div>
          <div className="col-4">
            <label htmlFor="people">
              People in Party
              <input
                className="form-control"
                id="people"
                type="number"
                name="people"
                required={true}
                onChange={changeToNumber}
                value={reservation.people}
                min="1"
              />
            </label>
          </div>
        </div>
        <div className="row mx-auto">
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default ReservationForm;
