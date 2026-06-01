"""
HelplineRegistry — stub for Task #11 (se-data / PyPI).

Full implementation (local file loading + optional remote fetch) to be added by se-data agent.
"""

from __future__ import annotations
from typing import Optional
from .models import HelplineRecord, ServiceCategory


class HelplineRegistry:
    """Query interface for the open-helplines data registry."""

    def find(
        self,
        country: Optional[str] = None,
        category: Optional[ServiceCategory] = None,
        language: Optional[str] = None,
        method: Optional[str] = None,
        free_only: bool = False,
    ) -> list[HelplineRecord]:
        """Find helplines matching the given filters.

        Args:
            country: ISO 3166-1 alpha-2 country code (e.g. "JP").
            category: Service category filter.
            language: BCP-47 language code filter.
            method: Contact method filter ("phone", "chat", etc.).
            free_only: If True, only return free-of-charge services.

        Returns:
            List of matching HelplineRecord objects.
        """
        raise NotImplementedError("Pending Task #11 (se-data)")

    def get(self, record_id: str) -> Optional[HelplineRecord]:
        """Fetch a single record by its ID.

        Args:
            record_id: Record slug, e.g. "jp-inochi-no-denwa".

        Returns:
            HelplineRecord or None if not found.
        """
        raise NotImplementedError("Pending Task #11 (se-data)")

    def list_countries(self) -> list[str]:
        """Return all ISO 3166-1 alpha-2 country codes in the registry."""
        raise NotImplementedError("Pending Task #11 (se-data)")
