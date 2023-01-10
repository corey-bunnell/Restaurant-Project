import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import TableTile from "../AddTable/TableTile";
import ReservationTile from "../AddReservation/ReservationTile";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ defaultDate }) {
  const params = new URLSearchParams(window.location.search);
  let startDate = params?.get("date") || defaultDate;
  const [date, setDate] = useState(startDate);

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesList, setTablesList] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const getTables = async () => {
      try {
        const response = await listTables(signal);
        setTablesList(response);
      } catch (e) {
        console.log(e);
      }
    };
    getTables();
    return () => {
      controller.abort();
    };
  }, []);

  const tables =
    tablesList &&
    tablesList.map((table, i) => {
      return <TableTile key={i} table={table} />;
    });

  const list =
    reservations &&
    reservations.map((reservation, i) => {
      return <ReservationTile key={i} reservation={reservation} />;
    });

  const nextHandle = (event) => {
    event.preventDefault();
    setDate(next(date));
  };

  const previousHandle = (event) => {
    event.preventDefault();
    setDate(previous(date));
  };

  const todayHandle = (event) => {
    event.preventDefault();
    setDate(today());
  };

  return (
    <main class="container-fluid">
      <div className="row">
        <h1 className="mx-auto display-3">
          Dashboard
          <small className="text-muted ml-2">{date}</small>
        </h1>
      </div>

      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          type="button"
          className="btn btn-secondary mr-4 my-2"
          onClick={previousHandle}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-primary mr-4 my-2"
          onClick={todayHandle}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-secondary my-2"
          onClick={nextHandle}
        >
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="row">
        <div className="col mr-2">
          <div className="row d-flex justify-content-center">
            <h3>Reservations</h3>
          </div>
          <div className="row align-items-start">
            <div className="container">
              <div className="row">{list}</div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="row d-flex justify-content-center">
            <h3>Tables</h3>
          </div>
          <div className="row align-items-start">
            <div className="container">
              <div className="row">{tables}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
