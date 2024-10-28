from typing import Optional, List
from pydantic import BaseModel
from fastapi import File, UploadFile

class UserCreate(BaseModel):
    username: str
    email: str
    password: str 
    first_name: str
    last_name: str
    user_role_id:int

class validLogin(BaseModel):
    username: str
    password : str

    
class UserUpdate(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    hashed_password: str

class CompanyUpdate(BaseModel):
    name: str
    email: str
    phone_number: str
    location: str
    description: str

class CompanyUpdateOwner(BaseModel):
    name: str
    email: str
    phone_number: str
    location: str
    description: str    
    user_id: str

class SportUpdate(BaseModel):
    name: str

class TerenUpdate(BaseModel):
    name: str
    description: str
    location_info: str
    grade: str

class TerenUpdateThree(BaseModel):
    name: str
    description: str
    location_info: str

class TerenUpdateTwo(BaseModel):
    name: str
    description: str
    location_info: str
    grade: str    
    area_type_id: int
    
class TeamUpdate(BaseModel):
    name:str
    foundation_date: str
    leader: str
    sport_id:str
    
class CreateRole(BaseModel):
    user_role_id: int
    role: str

class TeamPlayerUpdate(BaseModel):
    user_id:str
    team_id: str

class AppointmentCreate(BaseModel):
    area_id:str
    team_id: str
    time:str

class UpdateImage(BaseModel):
    username:str
    picture_id:str

class CompanyName(BaseModel):
    name:str

class PictureDeleteRequest(BaseModel):
    pictures: List[str]

class AddReview(BaseModel):
    review_taker: str
    grade: float
    review: str

class UsersWithName(BaseModel):
    users: List[str]
    name: str

class AppointmentUpdate(BaseModel):
    time: str
    area_name: str
    team_name: str
