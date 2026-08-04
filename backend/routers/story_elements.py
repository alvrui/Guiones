"""
Router for Story Elements catalog
Provides API endpoints for accessing story elements data
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from typing import List, Optional
from pydantic import BaseModel
import os
import csv
import json
from pathlib import Path

router = APIRouter()

# Path to the story elements CSV file
CSV_PATH = Path(__file__).parent.parent / "public" / "data" / "story-elements.csv"


class StoryElementResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    tags: Optional[List[str]] = None
    archetype: Optional[str] = None


class StoryElementsCatalogResponse(BaseModel):
    elements: List[StoryElementResponse]
    categories: List[str]
    types: List[str]
    tags: List[str]
    archetypes: List[str]
    version: str
    lastUpdated: str


def parse_csv_to_elements(csv_path: Path) -> List[StoryElementResponse]:
    """Parse the CSV file and extract story elements"""
    elements = []
    
    if not csv_path.exists():
        return elements
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                element = StoryElementResponse(
                    id=row.get('id', ''),
                    name=row.get('spanish_name', row.get('english_name', '')),
                    description=row.get('dramatic_function', ''),
                    category=row.get('category', ''),
                    type=row.get('subtype', ''),
                    tags=[tag.strip() for tag in row.get('tags_engine', '').split(';') if tag.strip()] if row.get('tags_engine') else None,
                    archetype=row.get('role_in_story', '')
                )
                elements.append(element)
    except Exception as e:
        print(f"Error parsing CSV: {e}")
    
    return elements


@router.get("/story-elements", response_model=StoryElementsCatalogResponse)
async def get_story_elements():
    """
    Get all story elements from the catalog
    Returns the complete catalog of story elements with metadata
    """
    # Try to load from CSV
    elements = parse_csv_to_elements(CSV_PATH)
    
    if not elements:
        # Return a minimal default catalog if CSV is not available
        default_elements = [
            StoryElementResponse(
                id="se-001",
                name="Conflicto Central",
                description="El conflicto principal que impulsa la historia",
                category="Estructura",
                type="Conflicto",
                tags=["principal", "obligatorio"]
            ),
            StoryElementResponse(
                id="se-002",
                name="Revelación",
                description="Momento en que se revela información crucial",
                category="Estructura",
                type="Revelación",
                tags=["clave", "sorpresa"]
            ),
            StoryElementResponse(
                id="se-003",
                name="Clímax",
                description="El punto de mayor tensión en la historia",
                category="Estructura",
                type="Clímax",
                tags=["tensión", "cumulativo"]
            ),
        ]
        elements = default_elements
    
    # Extract unique values for metadata
    categories = list(set([e.category for e in elements if e.category]))
    types = list(set([e.type for e in elements if e.type]))
    all_tags = []
    for e in elements:
        if e.tags:
            all_tags.extend(e.tags)
    tags = list(set(all_tags))
    archetypes = list(set([e.archetype for e in elements if e.archetype]))
    
    return StoryElementsCatalogResponse(
        elements=elements,
        categories=categories,
        types=types,
        tags=tags,
        archetypes=archetypes,
        version="1.0",
        lastUpdated="2024-01-01T00:00:00Z"
    )


@router.get("/story-elements/csv")
async def get_story_elements_csv():
    """
    Get the raw CSV file for story elements
    """
    if CSV_PATH.exists():
        return FileResponse(CSV_PATH, filename="story-elements.csv")
    else:
        raise HTTPException(status_code=404, detail="CSV file not found")


@router.get("/story-elements/{element_id}", response_model=StoryElementResponse)
async def get_story_element(element_id: str):
    """
    Get a specific story element by ID
    """
    elements = parse_csv_to_elements(CSV_PATH)
    
    for element in elements:
        if element.id == element_id:
            return element
    
    raise HTTPException(status_code=404, detail="Story element not found")
