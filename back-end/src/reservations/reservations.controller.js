/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

// Check that the form has submited all the needed properties.
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

async function read(req, res, next) {
  const reservation = res.locals.reservation;
  const data = await reservationsService.read(reservation.reservation_id);
  res.json({ data });
}

function isDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const testDate = new Date(date);
  if (testDate instanceof Date && !isNaN(testDate)) {
    return next();
  }
  return next({
    status: 400,
    message: `reservation_date`,
  });
}

function isTime(req, res, next) {
  const time = req.body.data.reservation_time;

  const hour = parseInt(time.substring(0, 2));
  const min = parseInt(time.substring(3));

  if (!isNaN(hour) && !isNaN(min) && 0 <= hour <= 24 && 0 <= min < 60) {
    return next();
  }
  return next({
    status: 400,
    message: "reservation_time",
  });
}

function peopleIsNumber(req, res, next) {
  const people = req.body.data.people;
  if (typeof people === "number") {
    return next();
  }
  return next({
    status: 400,
    message: `people is not a number`,
  });
}

function newStatus(req, res, next) {
  const data = req.body.data;
  if (data.status === "booked" || !data.status) {
    return next();
  }
  return next({
    status: 400,
    message: `Reservation status should not be seated or finished`,
  });
}

async function list(req, res) {
  const { mobile_number } = req.query;
  const { date } = req.query;
  let data;

  if (date) {
    data = await reservationsService.list(date);
  } else if (mobile_number) {
    data = await reservationsService.search(mobile_number);
  }

  res.json({ data });
}

async function create(req, res, next) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

function validDate(req, res, next) {
  // Start by adding the reservation date and then the reservation time.
  const date = new Date(req.body.data.reservation_date);
  const time = req.body.data.reservation_time;

  const hour = parseInt(time.substring(0, 2));
  const min = parseInt(time.substring(3));

  //  Add the reservation time to see if it is later than the current time
  date.setMinutes(min + hour * 60);

  // Correct the timezone for the day of the week
  const timeZoneDate = new Date(date);
  timeZoneDate.setHours(timeZoneDate.getHours() + 7);

  const currentDate = new Date();
  const reservationWeekDay = timeZoneDate.getDay();
  currentDate.setHours(currentDate.getHours() - 7);

  // Check to see if the reservation day is on a tuesday or if the date is in the past.

  if (reservationWeekDay === 2) {
    return next({
      status: 400,
      message: `Invalid date. We are closed on tuesdays. Please choose another date`,
    }) 
  } else if (date - currentDate >= 0) {
    next();
  } else {
    return next({
      status: 400,
      message: `Invalid date. Enter future date or later time`,
    });
  }
}

function validTime(req, res, next) {
  // Check to see if the reservation time is between 1030am and 930pm
  const time = req.body.data.reservation_time;
  const hour = parseInt(time.substring(0, 2));
  const min = parseInt(time.substring(3));

  if ((hour === 10 && min >= 30) || hour > 10) {
    if ((hour === 21 && min <= 30) || hour < 21) {
      return next();
    }
  }
  return next({
    status: 400,
    message: `Invalid time. Enter a time between 10:30am and 9:30pm`,
  });
}

async function reservationExists(req, res, next) {
  if (!req.params || !req.params.reservation_id) {
    return next({
      status: 404,
      message: `Reservation cannot be found`,
    });
  }
  const reservation = await reservationsService.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation cannot be found ${req.params.reservation_id}`,
  });
}

async function updateStatus(req, res, next) {
  const reservation = res.locals.reservation;
  const status = req.body.data.status;
  try {
    const data = await reservationsService.updateStatus(
      reservation.reservation_id,
      status
    );
    res.json({ data: data[0] });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong." });
  }
}

function validStatus(req, res, next) {
  const status = req.body.data.status;
  const valid = ["booked", "seated", "finished", "cancelled"];
  if (valid.includes(status)) {
    return next();
  }
  next({
    status: 400,
    message: `Unknown Status: ${status}`,
  });
}

function isFinished(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: `A finished reservation cannot be updated`,
    });
  }
  return next();
}

async function search(req, res, next) {
  const data = await reservationsService.search(req.body.data.mobile_number);
  res.json({ data });
}

async function update(req, res, next) {
  const reservation_id = res.locals.reservation.reservation_id;
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const data = await reservationsService.update(updatedReservation);
  res.json({ data: data[0] });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    isDate,
    isTime,
    newStatus,
    peopleIsNumber,
    validDate,
    validTime,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    isFinished,
    asyncErrorBoundary(updateStatus),
  ],
  search: [asyncErrorBoundary(search)],
  update: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    isDate,
    isTime,
    newStatus,
    peopleIsNumber,
    validDate,
    validTime,
    asyncErrorBoundary(update),
  ],
};
