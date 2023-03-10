import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import AddReservation from "../AddReservation/AddReservation";
import AddTable from "../AddTable/AddTable";
import Seat from "../AddReservation/Seat";
import SearchForm from "../Search/Search";
import EditReservation from "../AddReservation/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard defaultDate={today()} />
      </Route>
      <Route exact path="/reservations/new">
        <AddReservation />
      </Route>
      <Route exact path="/tables/new">
        <AddTable />
      </Route>
      <Route exact path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route exact path="/search">
        <SearchForm />
      </Route>
      <Route exact path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
