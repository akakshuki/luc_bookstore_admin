const GENDER = [
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Other" },
];

const ORDER_STATUS = [
  { id: 1, value: 0, label: "Pending", color: "purple" },
  { id: 2, value: 1, label: "Delivery", color: "magenta" },
  { id: 3, value: 2, label: "Reject", color: "red" },
  { id: 4, value: 3, label: "Received", color: "green" },
];

const DATE_FORMAT = "DD/MM/YYYY";

export { GENDER, DATE_FORMAT, ORDER_STATUS };
