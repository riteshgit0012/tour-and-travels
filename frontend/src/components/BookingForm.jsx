import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";
import { submitBooking } from "../api";

const EMPTY = {
  name: "",
  phone: "",
  travel_date: "",
  email: "",
  pickup: "",
};

export default function BookingForm({ compact = false }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null); // { ok, message }
  const [loading, setLoading] = useState(false);

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.travel_date ||
      !form.pickup.trim()
    ) {
      setStatus({
        ok: false,
        message:
          "Please fill in your name, phone, travel date, and pickup location.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    const res = await submitBooking(form);

    setStatus(res);
    setLoading(false);

    if (res.ok) {
      setForm(EMPTY);
    }
  };

  return (
    <div className="form-card">
      <div className="form-card-head">
        {/* <h3>Book Your Ride</h3> */}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="field">
          <label htmlFor="bk-name">Full Name</label>
          <input
            id="bk-name"
            className="field-input"
            name="name"
            value={form.name}
            onChange={update}
            placeholder="e.g. Rohan Gupta"
          />
        </div>

        {/* Phone + Travel Date */}
        <div className="field-row">
          <div className="field">
            <label htmlFor="bk-phone">Phone Number</label>
            <input
              id="bk-phone"
              className="field-input"
              name="phone"
              value={form.phone}
              onChange={update}
              placeholder="10-digit mobile"
              inputMode="numeric"
            />
          </div>

          <div className="field">
            <label htmlFor="bk-date">Travel Date</label>
            <input
              id="bk-date"
              className="field-input"
              name="travel_date"
              value={form.travel_date}
              onChange={update}
              type="date"
            />
          </div>
        </div>

        {/* Email */}
        {/* <div className="field">
          <label htmlFor="bk-email">Email</label>
          <input
            id="bk-email"
            className="field-input"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="example@gmail.com"
          />
        </div> */}

        {/* Pickup Location */}
        <div className="field">
          <label htmlFor="bk-pickup">Pickup Location</label>
          <input
            id="bk-pickup"
            className="field-input"
            name="pickup"
            value={form.pickup}
            onChange={update}
            placeholder="Enter pickup location"
          />
        </div>

        {/* Submit Button */}
        <button
          className="btn btn-primary btn-block btn-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending…" : "Request Booking"} <FaArrowRight />
        </button>

        {/* Status Message */}
        {status && (
          <div className={`form-note ${status.ok ? "success" : "error"}`}>
            {status.ok ? <FaCheckCircle /> : <FaExclamationCircle />}
            <span>{status.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}