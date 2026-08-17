"""Tiny SQLite layer — no external DB needed. Creates app.db next to this file."""

import sqlite3
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent / "app.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                pickup TEXT NOT NULL,
                drop_location TEXT NOT NULL,
                vehicle TEXT,
                travel_date TEXT,
                message TEXT,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                subject TEXT,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def save_booking(data: dict) -> tuple[int, str]:
    created_at = datetime.utcnow().isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO bookings (name, phone, pickup, drop_location, vehicle, travel_date, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data["name"],
                data["phone"],
                data["pickup"],
                data["drop"],
                data.get("vehicle", ""),
                data.get("travel_date", ""),
                data.get("message", ""),
                created_at,
            ),
        )
        conn.commit()
        return cursor.lastrowid, created_at


def save_contact(data: dict) -> tuple[int, str]:
    created_at = datetime.utcnow().isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO contacts (name, phone, email, subject, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                data["name"],
                data["phone"],
                data.get("email", ""),
                data.get("subject", ""),
                data["message"],
                created_at,
            ),
        )
        conn.commit()
        return cursor.lastrowid, created_at


def list_bookings() -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM bookings ORDER BY id DESC").fetchall()
        return [dict(row) for row in rows]


def list_contacts() -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM contacts ORDER BY id DESC").fetchall()
        return [dict(row) for row in rows]
