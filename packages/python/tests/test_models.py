# SPDX-License-Identifier: Apache-2.0
"""Unit tests for open_helplines.models."""

import pytest
from pydantic import ValidationError
from open_helplines.models import (
    HelplineContact,
    HelplineRecord,
    CountryIndex,
    GlobalIndex,
)

VALID_CONTACT = {
    "method": "phone",
    "number": "+819012345678",
    "languages": ["ja"],
    "hours": "24/7",
    "free": True,
    "anonymous": True,
}

VALID_RECORD = {
    "id": "jp-test-helpline",
    "country": "JP",
    "name": "Test Helpline",
    "category": "mental_health",
    "contacts": [VALID_CONTACT],
    "description": "A test helpline for unit testing purposes.",
    "website": "https://example.com/",
    "verified_at": "2026-01-01",
    "source": "https://example.com/source",
    "government_backed": False,
}


class TestHelplineContact:
    def test_valid_phone_contact(self) -> None:
        contact = HelplineContact(**VALID_CONTACT)
        assert contact.method == "phone"
        assert contact.number == "+819012345678"

    def test_invalid_e164_number(self) -> None:
        with pytest.raises(ValidationError, match="E.164"):
            HelplineContact(**{**VALID_CONTACT, "number": "09012345678"})

    def test_chat_method_no_number(self) -> None:
        contact = HelplineContact(
            method="chat",
            url="https://chat.example.com/",
            languages=["en"],
            hours="Mon-Fri 09:00-17:00",
            free=True,
        )
        assert contact.number is None

    def test_extra_fields_rejected(self) -> None:
        with pytest.raises(ValidationError):
            HelplineContact(**{**VALID_CONTACT, "unexpected_field": "value"})


class TestHelplineRecord:
    def test_valid_record(self) -> None:
        record = HelplineRecord(**VALID_RECORD)
        assert record.id == "jp-test-helpline"
        assert record.country == "JP"

    def test_invalid_verified_at_format(self) -> None:
        with pytest.raises(ValidationError, match="YYYY-MM-DD"):
            HelplineRecord(**{**VALID_RECORD, "verified_at": "01-01-2026"})

    def test_optional_tags(self) -> None:
        record = HelplineRecord(**{**VALID_RECORD, "tags": ["government", "free"]})
        assert record.tags == ["government", "free"]

    def test_secondary_categories(self) -> None:
        record = HelplineRecord(
            **{**VALID_RECORD, "secondary_categories": ["suicide_prevention"]}
        )
        assert record.secondary_categories == ["suicide_prevention"]

    def test_extra_fields_rejected(self) -> None:
        with pytest.raises(ValidationError):
            HelplineRecord(**{**VALID_RECORD, "unknown_key": "x"})


class TestCountryIndex:
    def test_valid_index(self) -> None:
        index = CountryIndex(
            country="JP",
            name="Japan",
            data_files=["helplines.json"],
            record_count=3,
            updated_at="2026-01-01T00:00:00Z",
        )
        assert index.record_count == 3

    def test_negative_record_count_rejected(self) -> None:
        with pytest.raises(ValidationError):
            CountryIndex(
                country="JP",
                name="Japan",
                data_files=[],
                record_count=-1,
                updated_at="2026-01-01T00:00:00Z",
            )


class TestGlobalIndex:
    def test_valid_global_index(self) -> None:
        gi = GlobalIndex(
            schema_version="1.0.0",
            generated_at="2026-01-01T00:00:00Z",
            countries=[],
            total_records=0,
        )
        assert gi.total_records == 0
