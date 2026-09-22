import os
from typing import Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://app_admin:AdminPass123@hyperlocal-cluster.ev0xaer.mongodb.net/?appName=hyperlocal-cluster")
DB_NAME = os.getenv("DB_NAME", "hyperlocal_db")

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
workers_col = db["workers"]

app = FastAPI(title="Hyperlocal Marketplace API")

# Enable CORS so React frontend (port 5173) can talk to FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hyperlocal Marketplace Backend API is active!"}

@app.get("/api/workers")
def get_workers(
    category: Optional[str] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    max_distance_km: float = Query(20.0, ge=1.0, le=100.0)
):
    """
    Retrieves worker profiles filtered by category and 2dsphere location proximity.
    """
    query = {}
    
    # Category Filter
    if category and category.strip().lower() != "all":
        query["category"] = {"$regex": f"^{category.strip()}$", "$options": "i"}

    # GeoJSON Spatial Search using $near operator
    if lat is not None and lon is not None:
        max_meters = max_distance_km * 1000.0
        query["location"] = {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "$maxDistance": max_meters
            }
        }

    workers = list(workers_col.find(query, {"_id": 0}))
    return {"count": len(workers), "workers": workers}