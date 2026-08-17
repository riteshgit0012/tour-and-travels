"""
Admin auth + gallery-image management.
All endpoints here are imported and registered in main.py via app.include_router().

Auth strategy: JWT bearer token (HS256).
Admin credentials are hardcoded (single admin account).
Gallery images are stored in the SQLite gallery_images table.
Uploaded files are saved to backend/uploads/ and served at /uploads/<filename>.
"""

import os
import shutil
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import bcrypt
from jose import JWTError, jwt
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SECRET_KEY = "sanatan-tour-secret-key-change-in-production-2024"
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 480  # 8 hours

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Hardcoded admin credentials
# username: admin  |  password: admin@0025
# ---------------------------------------------------------------------------
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = bcrypt.hashpw(b"admin@0025", bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class GalleryImageOut(BaseModel):
    id: int
    title: str
    category: str
    src: str
    created_at: str


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


security = HTTPBearer()


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ---------------------------------------------------------------------------
# SQLite helpers for gallery_images (imported from database.py connection util)
# ---------------------------------------------------------------------------
def _get_conn():
    """Lazy import to avoid circular dependency."""
    from database import get_connection
    return get_connection()


def db_init_gallery_table() -> None:
    with _get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS gallery_images (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                title      TEXT NOT NULL,
                category   TEXT NOT NULL DEFAULT 'General',
                src        TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def db_list_gallery() -> list[dict]:
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT id, title, category, src, created_at FROM gallery_images ORDER BY id DESC"
        ).fetchall()
        return [dict(r) for r in rows]


def db_add_gallery(title: str, category: str, src: str) -> dict:
    created_at = datetime.utcnow().isoformat()
    with _get_conn() as conn:
        cursor = conn.execute(
            "INSERT INTO gallery_images (title, category, src, created_at) VALUES (?, ?, ?, ?)",
            (title, category, src, created_at),
        )
        conn.commit()
        return {"id": cursor.lastrowid, "title": title, "category": category, "src": src, "created_at": created_at}


def db_delete_gallery(image_id: int) -> bool:
    with _get_conn() as conn:
        cursor = conn.execute("DELETE FROM gallery_images WHERE id = ?", (image_id,))
        conn.commit()
        return cursor.rowcount > 0


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------
router = APIRouter()


@router.post("/api/auth/login", response_model=TokenResponse, tags=["auth"])
def admin_login(payload: LoginRequest):
    """Authenticate admin and return a JWT bearer token."""
    if payload.username != ADMIN_USERNAME or not verify_password(payload.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = create_access_token({"sub": payload.username})
    return TokenResponse(access_token=token)


@router.get("/api/gallery/images", tags=["gallery"])
def list_gallery_images():
    """Public endpoint — returns all gallery images from the database."""
    return {"gallery": db_list_gallery()}


@router.post("/api/gallery/images", tags=["gallery"])
def add_gallery_image(
    title: str = Form(...),
    category: str = Form("General"),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    _admin: str = Depends(get_current_admin),
):
    """Admin-only — add a gallery image (either by URL or file upload)."""
    if not image_url and not file:
        raise HTTPException(status_code=400, detail="Provide either image_url or a file.")

    if file:
        ext = Path(file.filename).suffix.lower() if file.filename else ".jpg"
        allowed = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
        if ext not in allowed:
            raise HTTPException(status_code=400, detail="Unsupported file type.")
        filename = f"{uuid.uuid4().hex}{ext}"
        dest = UPLOAD_DIR / filename
        with dest.open("wb") as f_out:
            shutil.copyfileobj(file.file, f_out)
        src = f"/uploads/{filename}"
    else:
        src = image_url.strip()

    image = db_add_gallery(title.strip(), category.strip(), src)
    return {"success": True, "image": image}


@router.delete("/api/gallery/images/{image_id}", tags=["gallery"])
def delete_gallery_image(image_id: int, _admin: str = Depends(get_current_admin)):
    """Admin-only — remove a gallery image by ID."""
    # Also delete the uploaded file if it exists.
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT src FROM gallery_images WHERE id = ?", (image_id,)
        ).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Image not found.")

    src = row["src"]
    if src.startswith("/uploads/"):
        file_path = UPLOAD_DIR / Path(src).name
        if file_path.exists():
            file_path.unlink()

    deleted = db_delete_gallery(image_id)
    return {"success": deleted}
