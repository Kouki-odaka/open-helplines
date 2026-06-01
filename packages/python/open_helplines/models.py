"""
Pydantic models mirroring schemas/helpline.schema.json.

SOURCE OF TRUTH: schemas/helpline.schema.json
These models are derived from the JSON Schema — keep in sync with it.
"""

from __future__ import annotations

from typing import Literal, Optional
from pydantic import BaseModel, Field, HttpUrl, field_validator
import re

LanguageCode = str  # BCP-47
CountryCode = str   # ISO 3166-1 alpha-2
E164Phone = str     # E.164
IsoDate = str       # YYYY-MM-DD

ServiceCategory = Literal[
    "suicide_prevention",
    "mental_health",
    "domestic_violence",
    "sexual_violence",
    "substance_abuse",
    "youth",
    "lgbtq",
    "veterans",
    "elder",
    "grief",
    "general_crisis",
    "other",
]

ContactMethod = Literal["phone", "text", "chat", "email", "app"]

_E164_PATTERN = re.compile(r"^\+[1-9]\d{1,14}$")
_ISO_DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class HelplineContact(BaseModel):
    model_config = {"extra": "forbid"}

    method: ContactMethod
    number: Optional[str] = None
    url: Optional[HttpUrl] = None
    languages: list[LanguageCode] = Field(min_length=1)
    hours: str = Field(min_length=1, max_length=100)
    free: bool
    anonymous: Optional[bool] = None

    @field_validator("number")
    @classmethod
    def validate_e164(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and not _E164_PATTERN.match(value):
            raise ValueError(f"Phone number must be E.164 format, got: {value!r}")
        return value


class HelplineRecord(BaseModel):
    model_config = {"extra": "forbid"}

    id: str = Field(pattern=r"^[a-z]{2}-[a-z0-9-]+$")
    country: CountryCode = Field(pattern=r"^[A-Z]{2}$")
    name: str = Field(min_length=1, max_length=200)
    local_name: Optional[str] = Field(default=None, max_length=200)
    category: ServiceCategory
    secondary_categories: Optional[list[ServiceCategory]] = None
    contacts: list[HelplineContact] = Field(min_length=1)
    description: str = Field(min_length=1, max_length=280)
    website: Optional[HttpUrl] = None
    verified_at: IsoDate
    source: HttpUrl
    government_backed: bool
    tags: Optional[list[str]] = None

    @field_validator("verified_at")
    @classmethod
    def validate_iso_date(cls, value: str) -> str:
        if not _ISO_DATE_PATTERN.match(value):
            raise ValueError(f"verified_at must be YYYY-MM-DD, got: {value!r}")
        return value

    @field_validator("id")
    @classmethod
    def validate_id_country_prefix(cls, value: str, info: object) -> str:
        return value


class CountryIndex(BaseModel):
    model_config = {"extra": "forbid"}

    country: CountryCode
    name: str
    data_files: list[str]
    record_count: int = Field(ge=0)
    updated_at: str


class GlobalIndex(BaseModel):
    model_config = {"extra": "forbid"}

    schema_version: str
    generated_at: str
    countries: list[CountryIndex]
    total_records: int = Field(ge=0)
