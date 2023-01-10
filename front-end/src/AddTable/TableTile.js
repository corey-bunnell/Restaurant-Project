import React from "react";
import { useHistory } from "react-router-dom";
import { deleteTable, updateStatus } from "../utils/api";

function TableTile({ table }) {
  const history = useHistory();

  const deleteButton = async (event) => {
    if (
      window.confirm(
        `Is this table ready to seat new guests? This cannot be undone.`
      )
    ) {
      await deleteTable(table.table_id);
      await updateStatus(table.reservation_id, "finished");
      history.go(0);
    }
  };

  return (
    <div className="col-12 col-lg-5 py-3 mb-2 mr-2 bg-dark text-white rounded">
      <p>Table Name: {table.table_name}</p>
      <p>{`Capacity: ${table.capacity}`}</p>
      <p data-table-id-status={table.table_id}>
        Status: {table.reservation_id === null ? "Free" : `Occupied`}
      </p>
      {table.reservation_id && (
        <button
          type="button"
          data-table-id-finish={table.table_id}
          className="btn btn-danger"
          onClick={deleteButton}
          key={table.Id}
        >
          Finish
        </button>
      )}
    </div>
  );
}

export default TableTile;
