"""
open-helplines — Python client for the global mental health hotline registry.

Data license: CC0 1.0 Universal (public domain)
Code license:  Apache-2.0

Usage:
    from open_helplines import HelplineRegistry

    registry = HelplineRegistry()
    results = registry.find(country="JP", category="suicide_prevention")
"""

from .registry import HelplineRegistry
from .models import HelplineRecord, HelplineContact, GlobalIndex

__version__ = "0.1.0"
__all__ = ["HelplineRegistry", "HelplineRecord", "HelplineContact", "GlobalIndex"]
