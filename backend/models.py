"""Pydantic models used for request validation and responses."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class BookingRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    phone: str = Field(..., min_length=7, max_length=15)
    pickup: str = Field(..., min_length=2, max_length=120)
    drop: Optional[str] = Field(default="Ayodhya", max_length=120)
    vehicle: Optional[str] = Field(default="", max_length=60)
    travel_date: Optional[str] = Field(default="", max_length=40)
    message: Optional[str] = Field(default="", max_length=500)

    @field_validator("phone")
    @classmethod
    def phone_must_be_numeric(cls, value: str) -> str:
        cleaned = value.replace(" ", "").replace("-", "").replace("+", "")
        if not cleaned.isdigit():
            raise ValueError("Phone number should contain only digits")
        return value


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    phone: str = Field(..., min_length=7, max_length=15)
    email: Optional[str] = Field(default="", max_length=120)
    subject: Optional[str] = Field(default="", max_length=120)
    message: str = Field(..., min_length=5, max_length=800)

    @field_validator("phone")
    @classmethod
    def phone_must_be_numeric(cls, value: str) -> str:
        cleaned = value.replace(" ", "").replace("-", "").replace("+", "")
        if not cleaned.isdigit():
            raise ValueError("Phone number should contain only digits")
        return value


class SubmitResponse(BaseModel):
    success: bool
    message: str
    id: Optional[int] = None
    created_at: Optional[datetime] = None
