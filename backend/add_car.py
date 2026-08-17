"""
Fleet / car management for admin panel.
Cars added here appear dynamically on the Home page fleet grid.
Uploaded images are saved to backend/uploads/ and served at /uploads/<filename>.
"""

import shutil
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from login import UPLOAD_DIR, get_current_admin

# ---------------------------------------------------------------------------
# SQLite helpers
# ---------------------------------------------------------------------------

CREATE_FLEET_SQL = (
    "CREATE TABLE IF NOT EXISTS fleet_vehicles ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT,"
    "name TEXT NOT NULL,"
    "vtype TEXT NOT NULL,"
    "seats INTEGER NOT NULL DEFAULT 4,"
    "price_per_km INTEGER NOT NULL DEFAULT 10,"
    "icon TEXT NOT NULL DEFAULT 'car',"
    "tag TEXT DEFAULT '',"
    "description TEXT DEFAULT '',"
    "features TEXT DEFAULT '',"
    "image_url TEXT DEFAULT '',"
    "created_at TEXT NOT NULL"
    ")"
)

ALLOWED_CATEGORIES = [
    "Popular Sedan",
    "Luxury SUV",
    "Group Travel",
    "Premium",
    "Most Affordable",
    "Family Favourite",
    "Budget Pick",
]


def _get_conn():
    from database import get_connection
    return get_connection()


def db_init_fleet_table() -> None:
    with _get_conn() as conn:
        conn.execute(CREATE_FLEET_SQL)
        conn.commit()


def db_list_fleet() -> list:
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM fleet_vehicles ORDER BY id ASC"
        ).fetchall()
        result = []
        for r in rows:
            d = dict(r)
            d["type"] = d.pop("vtype")
            d["features"] = [
                f.strip() for f in d["features"].split(",") if f.strip()
            ]
            result.append(d)
        return result


def db_add_fleet(data: dict) -> dict:
    created_at = datetime.utcnow().isoformat()
    features_str = ",".join(data.get("features", []))
    with _get_conn() as conn:
        cursor = conn.execute(
            "INSERT INTO fleet_vehicles "
            "(name,vtype,seats,price_per_km,icon,tag,description,features,image_url,created_at) "
            "VALUES (?,?,?,?,?,?,?,?,?,?)",
            (
                data["name"],
                data["type"],
                int(data.get("seats", 4)),
                int(data.get("price_per_km", 10)),
                data.get("icon", "car"),
                data.get("tag", ""),
                data.get("description", ""),
                features_str,
                data.get("image_url", ""),
                created_at,
            ),
        )
        conn.commit()
        d = dict(data)
        d["id"] = cursor.lastrowid
        d["created_at"] = created_at
        d["features"] = data.get("features", [])
        return d


def db_delete_fleet(vehicle_id: int) -> Optional[str]:
    """Delete vehicle and return image path if it was an uploaded file."""
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT image_url FROM fleet_vehicles WHERE id = ?", (vehicle_id,)
        ).fetchone()
        if not row:
            return None
        image_url = row["image_url"]
        cursor = conn.execute(
            "DELETE FROM fleet_vehicles WHERE id = ?", (vehicle_id,)
        )
        conn.commit()
        if cursor.rowcount == 0:
            return None
        return image_url


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter()


@router.get("/api/fleet/categories", tags=["fleet"])
def list_fleet_categories():
    """Public — available category options for the admin dropdown."""
    return {"categories": ALLOWED_CATEGORIES}


@router.get("/api/fleet/vehicles", tags=["fleet"])
def list_fleet_vehicles():
    """Public — all cars added by admin (shown on Home page)."""
    return {"fleet": db_list_fleet()}


@router.post("/api/fleet/vehicles", tags=["fleet"])
def add_fleet_vehicle(
    name: str = Form(...),
    vtype: str = Form(...),
    seats: int = Form(4),
    price_per_km: int = Form(...),
    tag: str = Form("Popular Sedan"),
    description: str = Form(""),
    features: str = Form(""),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    _admin: str = Depends(get_current_admin),
):
    """Admin-only — add a new car with image upload or URL."""
    if not name.strip():
        raise HTTPException(status_code=400, detail="Car name is required.")
    if price_per_km <= 0:
        raise HTTPException(status_code=400, detail="Price per km must be greater than 0.")

    src = ""
    if file and file.filename:
        ext = Path(file.filename).suffix.lower()
        if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
            raise HTTPException(status_code=400, detail="Unsupported file type. Use JPG, PNG or WEBP.")
        filename = uuid.uuid4().hex + ext
        dest = UPLOAD_DIR / filename
        with dest.open("wb") as f_out:
            shutil.copyfileobj(file.file, f_out)
        src = f"/uploads/{filename}"
    elif image_url and image_url.strip():
        src = image_url.strip()
    else:
        raise HTTPException(status_code=400, detail="Car image is required (upload file or provide URL).")

    feature_list = [f.strip() for f in features.split(",") if f.strip()]
    data = {
        "name": name.strip(),
        "type": vtype.strip(),
        "seats": seats,
        "price_per_km": price_per_km,
        "icon": "car",
        "tag": tag.strip(),
        "description": description.strip(),
        "features": feature_list,
        "image_url": src,
    }
    vehicle = db_add_fleet(data)
    return {"success": True, "vehicle": vehicle}


@router.delete("/api/fleet/vehicles/{vehicle_id}", tags=["fleet"])
def delete_fleet_vehicle(
    vehicle_id: int,
    _admin: str = Depends(get_current_admin),
):
    """Admin-only — remove a car by ID."""
    image_url = db_delete_fleet(vehicle_id)
    if image_url is None:
        raise HTTPException(status_code=404, detail="Vehicle not found.")

    if image_url.startswith("/uploads/"):
        file_path = UPLOAD_DIR / Path(image_url).name
        if file_path.exists():
            file_path.unlink()

    return {"success": True}
