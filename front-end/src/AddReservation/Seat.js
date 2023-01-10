import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { seatReservation, listTables, updateStatus } from "../utils/api";

function Seat() {
  const [tableId, setTableId] = useState({});
  const [hasError, setHasError] = useState("");
  const [tablesList, setTablesList] = useState([]);
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const getTables = async () => {
      try {
        const response = await listTables(signal);
        setTablesList(response);
        if (response[0] && response[0].id) {
          setTableId(response[0].id);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getTables();
    return () => {
      controller.abort();
    };
  }, [params]);

  const changeHandler = (event) => {
    setTableId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await seatReservation(params.reservation_id, tableId);
    if (response.error) {
      return setHasError(response.error);
    }
    await updateStatus(params.reservation_id, "seated");
    history.push("/");
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div className="container">
      <h1>Seat Reservation</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <label htmlFor="table_id">
              <select
                className="form-control"
                id="table_id"
                type="text"
                name="table_id"
                required={true}
                onChange={changeHandler}
                value={tableId}
              >
                <option value="">-- Select an Option --</option>
                {tablesList.map((entry) => {
                  return (
                    <option
                      key={`option_${entry.table_id}`}
                      value={entry.table_id}
                    >
                      {entry.table_name} - {entry.capacity}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </div>
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
      </form>
      {hasError && <p className="alert alert-danger">{hasError}</p>}
    </div>
  );
}

export default Seat;
