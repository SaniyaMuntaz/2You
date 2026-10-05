import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
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

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------
# Pydantic Schemas for Freelancers
# ----------------------------------
class FreelancerRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    skills: List[str] = []
    experience: str = ""
    working_evidence: str = ""

class FreelancerLoginSchema(BaseModel):
    email: EmailStr
    password: str

class FreelancerProfileUpdateSchema(BaseModel):
    name: str
    phone: str
    skills: List[str]
    experience: str
    working_evidence: str


# ----------------------------------
# Routes
# ----------------------------------
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


# ----------------------------------
# Freelancer / Worker Authentication
# ----------------------------------
@app.post("/api/freelancer/register")
def register_freelancer(data: FreelancerRegisterSchema):
    """
    Registers a new freelancer/worker in the database.
    """
    if workers_col.find_one({"email": data.email.lower()}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email is already registered"
        )
    
    freelancer_doc = data.dict()
    freelancer_doc["email"] = freelancer_doc["email"].lower()
    freelancer_doc["role"] = "freelancer"
    
    workers_col.insert_one(freelancer_doc)
    freelancer_doc.pop("_id", None)
    
    return {
        "status": "success", 
        "message": "Freelancer registered successfully", 
        "freelancer": freelancer_doc
    }

@app.post("/api/freelancer/login")
def login_freelancer(credentials: FreelancerLoginSchema):
    """
    Authenticates a freelancer using email and password.
    """
    freelancer = workers_col.find_one({"email": credentials.email.lower()}, {"_id": 0})
    
    if not freelancer or freelancer.get("password") != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    return {
        "status": "success", 
        "message": "Login successful", 
        "freelancer": freelancer
    }

@app.put("/api/freelancer/profile/{email}")
def update_freelancer_profile(email: str, profile: FreelancerProfileUpdateSchema):
    """
    Updates the freelancer's profile details (skills, experience, evidence).
    """
    res = workers_col.update_one(
        {"email": email.lower()},
        {"$set": profile.dict()}
    )
    
    if res.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Freelancer profile not found"
        )
    
    return {
        "status": "success", 
        "message": "Profile updated successfully"
    }
