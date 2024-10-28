from fastapi import Depends, FastAPI, HTTPException, status, Response, Request, File, UploadFile, Form

from .database import Base, SessionLocal, engine
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from sqlalchemy import asc, func


from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from .models import *
from .schemas import * 


import bcrypt
from fastapi import HTTPException
import json

from PIL import Image
from io import BytesIO
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()
#popravi registraciju i probaj pozvati registration funkciju

origins = [
    "http://localhost:3000",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def getUsers(db: Session = Depends(get_db)) :
    users = db.query(User).all()
    return users

def getCompanies(db: Session = Depends(get_db)):
    companies = db.query(Company).all()
    return companies

def getSports(db: Session = Depends(get_db)):
    sports = db.query(Sport).all()
    return sports

def getTereni(db: Session = Depends(get_db)):
    tereni = db.query(Area).all()
    return tereni

def getReviews(db: Session = Depends(get_db)):
    reviews = db.query(UserReview).all()
    return reviews


def getTeams(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return teams

def getTeamss(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return teams

def getAppointments(db: Session = Depends(get_db)):
    results = db.query(Appointment.appointment_id ,Appointment.time, Area.name, Team.name).\
    join(Area, Appointment.area_id == Area.area_id).\
    join(Team, Appointment.team_id == Team.team_id).all()

    results_list = [{"id": appointment_id, "time": time, "area_name": area_name, "team_name": team_name} for appointment_id, time, area_name, team_name in results]

    return results_list

def registration(req: UserUpdate, db: Session): 
    hashed = bcrypt.hashpw(req.hashed_password.encode('utf-8'), bcrypt.gensalt())

    new_user = User(username=req.username,
                    email=req.email,
                    user_role_id=req.user_role_id,
                    first_name=req.first_name,
                    last_name=req.last_name,
                    hashed_password=hashed.decode('utf-8'))  
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def createCompany(req: CompanyUpdate, db: Session):
    new_company = Company(
        name=req.name,
        email=req.email,
        phone_number=req.phone_number,
        location=req.location,
        description=req.description
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company

def createCompanyOwner(req: CompanyUpdateOwner, db: Session):
    new_company = Company(
        name=req.name,
        email=req.email,
        phone_number=req.phone_number,
        location=req.location,
        description=req.description,
        user_id=req.user_id
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company

def createSport(req: SportUpdate, db: Session):
    new_sport = Sport(
        name=req.name,
    )
    db.add(new_sport)
    db.commit()
    db.refresh(new_sport)
    return new_sport

def createTeren(req: TerenUpdate, db: Session):
    new_teren = Area(
        name=req.name,
        description = req.description,
        location_info = req.location_info,
        grade = req.grade
    )
    db.add(new_teren)
    db.commit()
    db.refresh(new_teren)
    return new_teren

def createTeam(req: TeamUpdate, db: Session):
    new_team = Team(
        name=req.name,
        foundation_date = req.foundation_date,
        leader = req.leader,
        sport_id = req.sport_id
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team

@app.post("/create-team")
def createNewTeam(req:TeamUpdate, db: Session = Depends(get_db)):
        return createTeam(req, db)

@app.get("/")
def start():
    return {"data": "it works!"}

@app.get("/probni_fk")
def probni(db: Session = Depends(get_db)):
    result = db.query(User, UserRole).filter(User.user_role_id == UserRole.user_role_id).all()
    
    
    data = []
    for user, user_roles in result:
        user_dict = user.__dict__
        user_roles_dict = user_roles.__dict__
        data.append({"user": user_dict, "user_roles": user_roles_dict})

    db.close()
    return data

@app.delete("/delete_user/{id}")
def removeUser(id:str,db: Session = Depends(get_db)):
    user = db.query(User).filter(id == User.user_id).first()
    if user:
        db.delete(user)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="User not found")
    
@app.delete("/delete_company/{id}")
def removeCompany(id:str,db: Session = Depends(get_db)):
    company = db.query(Company).filter(id == Company.company_id).first()
    if company:
        db.delete(company)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="User not found")   
    
@app.delete("/delete_sport/{id}")
def removeSport(id:int,db: Session = Depends(get_db)):
    sport = db.query(Sport).filter(id == Sport.sport_id).first()
    if sport:
        db.delete(sport)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Sport not found") 
    
@app.delete("/delete_teren/{id}")
def removeTeren(id:str,db: Session = Depends(get_db)):
    teren = db.query(Area).filter(id == Area.area_id).first()
    if teren:
        db.delete(teren)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Teren not found") 
    
@app.delete("/delete_team/{id}")
def removeTeam(id:str,db: Session = Depends(get_db)):
    team = db.query(Team).filter(id == Team.team_id).first()
    if team:
        db.delete(team)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Team not found")

@app.delete("/delete_termin/{id}")
def removeTermin(id: str, db: Session = Depends(get_db)):
    termin = db.query(Appointment).filter(id == Appointment.appointment_id).first()
    if termin:
        db.delete(termin)
        db.commit()
    else:
        raise HTTPException(status_code=404, detail="Termin not found")

@app.put("/admin/update_user/{id}")
def apdejt(id:str, req:UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == id).first()

    if not user:
        return registration(req, db)

    user.username = req.username
    user.email = req.email
    user.first_name = req.first_name
    user.last_name = req.last_name
    if req.hashed_password and str(user.hashed_password) != req.hashed_password:
        hashed = bcrypt.hashpw(req.hashed_password.encode('utf-8'), bcrypt.gensalt())  
        user.hashed_password = hashed.decode('utf-8')
    else: user.hashed_password = req.hashed_password

    db.commit()
    db.refresh(user)

    return user

@app.put("/admin/update_company/{id}")
def updateCompany(id:str, req:CompanyUpdate, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.company_id == id).first()

    if not company:
        return createCompany(req, db)

    company.name = req.name
    company.email = req.email
    company.phone_number = req.phone_number
    company.location = req.location
    company.description = req.description

    db.commit()
    db.refresh(company)

    return company

@app.put("/admin/update_sport/{id}")
def updateCompany(id:int, req:SportUpdate, db: Session = Depends(get_db)):
    sport = db.query(Sport).filter(Sport.sport_id == id).first()

    if not sport:
        return createSport(req, db)

    sport.name = req.name
    db.commit()
    db.refresh(sport)

    return sport

@app.put("/admin/update_teren/{id}")
def updateTeren(id:str, req:TerenUpdate, db: Session = Depends(get_db)):
    teren = db.query(Area).filter(Area.area_id == id).first()

    if not teren:
        return createTeren(req, db)

    teren.name = req.name
    teren.description = req.description
    teren.location_info = req.location_info
    teren.grade = req.grade
    db.commit()
    db.refresh(teren)

    return teren

@app.put("/update_teren/{id}")
def updateTeren(id:str, req:TerenUpdateThree, db: Session = Depends(get_db)):
    teren = db.query(Area).filter(Area.area_id == id).first()

    teren.name = req.name
    teren.description = req.description
    teren.location_info = req.location_info
    db.commit()
    db.refresh(teren)

    return teren

@app.post("/create-area/{id}")
def updateTeren(id:str, req:TerenUpdateTwo, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.user_id == id).first()
    new_teren = Area(
        name=req.name,
        description = req.description,
        location_info = req.location_info,
        grade = req.grade,
        area_type_id = req.area_type_id,
        owner_company_id = company.company_id
    )
    db.add(new_teren)
    db.commit()
    db.refresh(new_teren)
    return new_teren



@app.put("/admin/update_team{id}")
def updateTeam(id:str, req:TeamUpdate, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.team_id == id).first()

    if not team:
        return createTeam(req, db)

    team.name = req.name
    team.foundation_date = req.foundation_date
    team.leader = req.leader
    team.sport_id = req.sport_id
    db.commit()
    db.refresh(team)

    return team

@app.put("/admin/update_termin/{id}")
def updateTermin(id: str, req:AppointmentUpdate, db: Session = Depends(get_db)):
    team = db.query(Team.team_id).filter(Team.name == req.team_name).scalar()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    area = db.query(Area.area_id).filter(Area.name == req.area_name).scalar()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    
    termin = db.query(Appointment).filter(Appointment.appointment_id == id).first()

    if not termin:
        new_termin = AppointmentCreate(area_id = str(area), team_id= str(team), time = req.time)
        return createAppointment(new_termin,db)
    
    termin.time = req.time
    termin.area_id = area
    termin.team_id = team
    db.commit()
    db.refresh(termin)

    return termin

@app.get("/korisnici")
def get_all(db: Session = Depends(get_db)):
    return {"users": getUsers(db), 
            "companies": getCompanies(db),
            "sports": getSports(db),
            "tereni": getTereni(db),
            "reviews": getReviews(db),
            "teams": getTeamss(db),
            "roles": getRoles(db),
            "appointments": getAppointments(db)}

@app.post("/registration")
def index(req: UserCreate, db: Session = Depends(get_db)):
    hashed = bcrypt.hashpw(req.password.encode('utf-8'), bcrypt.gensalt())

    new_user = User(username=req.username,
                    email=req.email,
                    user_role_id=req.user_role_id,
                    first_name=req.first_name,
                    last_name=req.last_name,
                    hashed_password=hashed.decode('utf-8'))  
    db.add(new_user)
    db.commit()
    db.refresh(new_user)


import json
from urllib.parse import quote,unquote

@app.post("/login")
def authenticate_user(req: validLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not bcrypt.checkpw(req.password.encode('utf-8'), user.hashed_password.encode('utf-8')):  
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    user_role = user.user_role_id

    if user_role == 1:
        user_role = "Admin"
    elif user_role == 2:
        user_role = "Player"
    else:
        user_role = "Company"

    user_info = {"username": req.username, "user_role": user_role}
    user_info_json = json.dumps(user_info)
    user_info_encoded = quote(user_info_json)
    response.set_cookie(key="login-cookie", value=user_info_encoded) 
    
    return {'status': 'success'}

@app.post("/logout")
async def logout_user(response:Response):
    response.delete_cookie(key="login-cookie")
    return {"status":"success"}


from typing import List
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

@app.post("/upload_picture")
def upload(folder: str = Form(...), username: str = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    try:
        parent_folder = "../app/public/"  # Replace with the actual path to the parent folder

        if not os.path.exists(parent_folder):
            os.makedirs(parent_folder)

        folder_path = os.path.join(parent_folder, folder)

        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        final_path = ""
        new_images = []  # List to store new_image objects

        for file in files:
            _, file_extension = os.path.splitext(file.filename)
            file_extension = file_extension[1:]  # Remove the dot from the extension

            if file_extension.lower() not in ALLOWED_EXTENSIONS:
                return {"message": f"File extension '{file_extension}' is not allowed"}

            file_name = f"{username}_{uuid.uuid4().hex}.{file_extension}"
            file_path = os.path.join(folder_path, file_name)

            with open(file_path, "wb") as f:
                f.write(file.file.read())

            final_path = "/" + folder + "/" + file_name
            new_image = Picture(picture_link=final_path)
            db.add(new_image)
            new_images.append(new_image)  # Store new_image in the list

        db.commit()

        return {"picture_id": new_images[0].picture_id, "picture_link": final_path}
    except Exception as e:
        return {"message": f"There was an error uploading the files: {e}"}
    finally:
        for file in files:
            file.file.close()

@app.post("/upload_company_pictures")
def upload(folder: str = Form(...), company_id: str = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    try:
        final_company = db.query(Company).filter(Company.user_id == company_id).first()

        parent_folder = "../app/public/"   
        if not os.path.exists(parent_folder):
            os.makedirs(parent_folder)

        folder_path = os.path.join(parent_folder, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        new_images = []  

        for file in files:
            name, file_extension = os.path.splitext(file.filename)
            file_extension = file_extension[1:]  

            if file_extension.lower() not in ALLOWED_EXTENSIONS:
                return {"message": f"File extension '{file_extension}' is not allowed"}

            file_name = f"{file.filename}"
            full_name = f"{name}_{uuid.uuid4().hex}.{file_extension}"
            file_path = os.path.join(folder_path, full_name)
            print(file_path)
            final_path = f"/{folder}/{full_name}"

            with open(file_path, "wb") as f:
                f.write(file.file.read())

            new_image = Picture(picture_link=final_path)
            db.add(new_image)
            db.flush()  

            new_company_picture = CompanyPicture(picture_id=new_image.picture_id, company_id=final_company.company_id)
            db.add(new_company_picture)
            db.flush()  

            print("Company Picture Details:", new_company_picture.company_picture_id, new_company_picture.picture_id, new_company_picture.company_id)
            new_images.append(new_image)  

        db.commit()

        return {
            "pictures": [{"picture_id": image.picture_id, "picture_link": image.picture_link} for image in new_images]
        }
    except Exception as e:
        db.rollback()   
        print(f"There was an error uploading the files: {e}")
        return {"message": f"There was an error uploading the files: {e}"}
    finally:
        for file in files:
            file.file.close()

@app.post("/upload_area_pictures")
def upload(folder: str = Form(...), company_id: str = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    try:
        parent_folder = "../app/public/"   
        if not os.path.exists(parent_folder):
            os.makedirs(parent_folder)

        folder_path = os.path.join(parent_folder, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        new_images = []  

        for file in files:
            name, file_extension = os.path.splitext(file.filename)
            file_extension = file_extension[1:]  

            if file_extension.lower() not in ALLOWED_EXTENSIONS:
                return {"message": f"File extension '{file_extension}' is not allowed"}

            file_name = f"{file.filename}"
            full_name = f"{name}_{uuid.uuid4().hex}.{file_extension}"
            file_path = os.path.join(folder_path, full_name)
            print(file_path)
            final_path = f"/{folder}/{full_name}"

            with open(file_path, "wb") as f:
                f.write(file.file.read())

            new_image = Picture(picture_link=final_path)
            db.add(new_image)
            db.flush()  

            new_company_picture = AreaPicture(picture_id=new_image.picture_id, company_id=company_id)
            db.add(new_company_picture)
            db.flush()  

            print("Company Picture Details:", new_company_picture.area_picture_id, new_company_picture.picture_id, new_company_picture.company_id)
            new_images.append(new_image)  

        db.commit()

        return {
            "pictures": [{"picture_id": image.picture_id, "picture_link": image.picture_link} for image in new_images]
        }
    except Exception as e:
        db.rollback()   
        print(f"There was an error uploading the files: {e}")
        return {"message": f"There was an error uploading the files: {e}"}
    finally:
        for file in files:
            file.file.close()            

######CHAT#########
from fastapi_socketio import SocketManager

@app.get('/chats/{username}')
def get_chats(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    user_chats = db.query(ChatUser).filter(ChatUser.user_id == user.user_id).all()
    names = []
    for user in user_chats:
        name = db.query(Chat).filter(Chat.chat_id == user.chat_id).first().name
        names.append(name)
    return names

@app.get('/chats/{username}/{chatName}')
def get_messages(username: str, chatName: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    chat = db.query(Chat).filter(Chat.name == chatName).first()
    chat_user = db.query(ChatUser).filter(ChatUser.user_id == user.user_id and ChatUser.chat_id == chat.chat_id).first()
    if not chat_user:
       raise HTTPException(status_code=405, detail="Can't access that chat!")
    messagesN = (db.query(Message.content, User.username).join(User, Message.user_id == User.user_id).join(Chat, Message.chat_id == Chat.chat_id).filter(Chat.name == chatName).order_by(Message.time).all())
    messages = []
    for m in messagesN:
        messages.append({'content' : m[0], 'username': m[1]})
    return messages
       
#############ISPOD UPISUJ RUTE I FUNKCIJE############################
from sqlalchemy import desc
def addPlayerToTeam(req:TeamPlayerUpdate, db:Session):
      
    lastID = db.query(TeamPlayer).order_by(desc(TeamPlayer.team_player_id)).first()
    new_player = TeamPlayer(
        user_id = req.user_id,
        team_id = req.team_id,
        team_player_id = lastID.team_player_id+1
    )
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player

@app.post("/add_player_to_team")
def mainFunction(req:TeamPlayerUpdate, db: Session = Depends(get_db)):
    addPlayerToTeam(req, db)


import requests
@app.get("/test-api")
def test(city:str):
    unparsed = requests.get("http://api.openweathermap.org/data/2.5/forecast?q={city}}&cnt=5&units=metric&appid=2466aeef4338c10dfa3e1c837ab435d4")
    json_result = unparsed.json()
    forecast_list = json_result["list"]
    for forecast in forecast_list:
        temperature = forecast["main"]["temp"]
        weather = forecast["weather"][0]["main"]
def addRole(req: CreateRole, db: Session = Depends(get_db)):
    newRole = UserRole(user_role_id = req.user_role_id,
                        role = req.role)    
    db.add(newRole)
    db.commit()
    db.refresh(newRole)

    return {"status": "success"}


def getRoles(db: Session = Depends(get_db)):
    roles = db.query(UserRole).all()
    return roles

@app.post("/user-roles")
def user_roles(req: CreateRole, db: Session = Depends(get_db)):
    return addRole(req, db)

def getAreaLocation(location: str, db: Session = Depends(get_db)):
    areas = db.query(Area).filter(Area.location_info == location).all()
    if not areas:
        raise HTTPException(status_code = 404, detail = f"No areas found for sport: {location}")
    
    return areas

@app.get("/area_by_location/{location}")
def area_location(location: str, db: Session = Depends(get_db)):
    return getAreaLocation(location, db)



def getAreaSport(sport: str, db: Session = Depends(get_db)):
    areas = db.query(Area).join(AreaSport).join(Sport).filter(Sport.name == sport).all()
    if not areas:
        raise HTTPException(status_code = 404, detail = f"No areas found for sport: {sport}")
    return areas

@app.get("/area_by_sport/{sport}")
def area_sport(sport: str, db: Session = Depends(get_db)):
    return getAreaSport(sport,db)



def search_areas(name: Optional[str] = None, location: Optional[str] = None, sport_name: Optional[str] = None, type_name: Optional[str] = None, company_name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Area).options(
        joinedload(Area.area_types),
        joinedload(Area.companies),
        joinedload(Area.area_sports).joinedload(AreaSport.sports)
    )

    if name:
        query = query.filter(Area.name == name)

    if location:
        query = query.filter(Area.location_info.like(f"%{location.strip()}%"))
    
    if sport_name:
        query = query.join(AreaSport).join(Sport).filter(Sport.name == sport_name)
    
    if type_name:
        query = query.join(Area.area_types).filter(AreaType.name == type_name)

    if company_name:
        query = query.join(Area.companies).filter(Company.name == company_name)
    
    areas = query.all()

    results = []
    for area in areas:
        area_data = {
            "area_id": str(area.area_id),
            "name": area.name,
            "description": area.description,
            "location_info": area.location_info,
            "grade": area.grade,
            "area_type": area.area_types.name if area.area_type_id else None,
            "owner_company": area.companies.name if area.owner_company_id else None,
            "sports": ",".join([as_.sports.name for as_ in area.area_sports])
        }
        results.append(area_data)

    return results

@app.get("/search_areas")
def search_areas_route(name: Optional[str] = None, location: Optional[str] = None, sport: Optional[str] = None, type: Optional[str] = None, company: Optional[str] = None,  db: Session = Depends(get_db)):
    areas = search_areas(name, location, sport, type, company, db)
    if not areas:
        raise HTTPException(status_code = 404, detail = "No areas found")
    return areas


def getFilterData(db: Session = Depends(get_db)):
       
        locations = db.query(func.split_part(Area.location_info, ',', -1).label('location')).distinct()
        locations_list = [location.location for location in locations.all()]
        
        sports = db.query(Sport.name).distinct().all()
        sport_list = [sport[0] for sport in sports]
    
        types = db.query(AreaType.name).distinct().all()
        types_list =[type[0] for type in types]

        companies = db.query(Company.name).distinct().all()
        company_list = [company[0] for company in companies]

        return {
            "locations": locations_list,
            "sports": sport_list,
            "types": types_list,
            "companies": company_list
        }

@app.get("/filter_data")
def get_filter_data(db: Session = Depends(get_db)):
    data = getFilterData(db)
    return data


def getUserID(request: Request, db: Session = Depends(get_db)):
    login_cookie = request.cookies.get("login-cookie")
    if not login_cookie:
        raise HTTPException(status_code = 401, detail = "Not authenticated")

    try:
        cookie_data_json = unquote(login_cookie)
        cookie_data = json.loads(cookie_data_json)
    except (json.JSONDecodeError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid cookie format")

    user = db.query(User).filter(User.username == cookie_data.get("username")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

def addPreferences(sport: str, request: Request,db: Session = Depends(get_db)):
    user = getUserID(request,db)
    sport_id = db.query(Sport.sport_id).filter(Sport.name == sport).first()

    new_preferance = UserSportPreference(user_id = user.user_id, sport_id = sport_id.sport_id)
    db.add(new_preferance)
    db.commit()
    db.refresh(new_preferance)

    return {"status": "success"}


@app.post("/user/preferences")
def add_preferences(sport: str,request: Request, db: Session = Depends(get_db)):
    return addPreferences(sport,request, db)


def getUserInfo(request: Request, db: Session = Depends(get_db)):
    user = getUserID(request, db)
    return user

@app.get("/user_info")
def user_info(request: Request, db: Session = Depends(get_db)):
    return getUserInfo(request,db)


def getCompanyInfo(id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.company_id == id).first()
    if not company:
        raise HTTPException(status_code = 404, detail = "Company not found")
    return company

@app.get("/company/info/{id}")
def company_info(id: str, db: Session = Depends(get_db)):
    return getCompanyInfo(id,db)

def getCompanyInfoByName(user_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.user_id == user_id).first()
    if not company:
        0
    return company

@app.get("/company_info/{user_id}")
def company_info_by_name(user_id: str, db: Session = Depends(get_db)):
    return getCompanyInfoByName(user_id, db)

def getCountTeamMembers(team_name: str, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.name == team_name).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    members_count = db.query(TeamPlayer).filter(TeamPlayer.team_id == team.team_id).count()
    if members_count == 0:
        raise HTTPException(status_code=404, detail="Team has no members")
    
    return members_count

@app.get("/get_count_members/{team_name}")
def getCount(team_name: str, db: Session = Depends(get_db)):
    return getCountTeamMembers(team_name,db)

def getTeamMembers(team_name: str, request: Request, db: Session = Depends(get_db)):
    logged_in_user_id = getUserID(request,db)
    members = db.query(User.username).join(TeamPlayer).join(Team).filter(
        Team.name == team_name,
        User.user_id != logged_in_user_id.user_id
    ).all()
    if not members:
        raise HTTPException(status_code=404, detail="Team not found or no members in the team")
    return {member.username for member in members}

@app.get("/team_members/{team_name}")
def getMembers(team_name: str, request: Request, db: Session = Depends(get_db)):
    return getTeamMembers(team_name, request,db)


def getUserTeams(request: Request, db: Session = Depends(get_db)):
    user = getUserID(request, db)
    
    teams = db.query(Team).join(TeamPlayer).filter(TeamPlayer.user_id == user.user_id).all()
    if not teams:
        raise HTTPException(status_code = 404, detail = "Teams not found")
    return teams


@app.get("/user/teams")
def user_teams(request: Request, db: Session = Depends(get_db)):
    return getUserTeams(request, db)

def leaveTeam(request: Request, team_id: str, db: Session = Depends(get_db)):
    user = getUserID(request, db)

    teamMember = db.query(TeamPlayer).filter(TeamPlayer.user_id == user.user_id, 
                                            TeamPlayer.team_id == team_id).first()
    if teamMember:
        db.delete(teamMember)
        db.commit()
    else:
        raise HTTPException(status_code = 404, detail = "Not a team member") 

@app.delete("/user/teams/delete/{id}")
def leave_team(request: Request, team_id: str, db: Session = Depends(get_db)):
    return leaveTeam(request, team_id, db)

def createAppointment(req:AppointmentCreate, db: Session = Depends(get_db)):
    existing_appointment = db.query(Appointment).filter(
        Appointment.area_id == req.area_id,
        Appointment.time == req.time
    ).first()

    if existing_appointment:
        raise HTTPException(status_code=400, detail="Already reserved appointment")
    new_appointment = Appointment(
        time = req.time,
        team_id = req.team_id,
        area_id = req.area_id
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment

@app.post("/create_appointment")
def makeAppointment(req:AppointmentCreate, db: Session = Depends(get_db)):
    return createAppointment(req,db)

def getAreas(location: str, db: Session = Depends(get_db)):
    components = location.split(',')
    query = db.query(Area)
    for component in components:
        query = query.filter(Area.location_info.like(f"%{component.strip()}%"))
    areas = query.all()
    if not areas:
        raise HTTPException(status_code=404, detail="No areas found")
    return areas


@app.get("/areamap/{location}")
def area_map(location: str, db: Session = Depends(get_db)):
    return getAreas(location,db)

def get_all_cities(db: Session = Depends(get_db)) -> str:
    areas = db.query(Area.location_info).all()
    cities = [area.location_info.split(",")[-1].strip() for area in areas]
    unique_cities = list(set(cities))  
    return ", ".join(unique_cities)

@app.get("/cities")
def all_cities(db: Session = Depends(get_db)):
    cities = get_all_cities(db)
    if not cities:
        raise HTTPException(status_code=404, detail="No cities found")
    return {"cities": cities}

@app.get('/reviews/{username}')
def get_reviews_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()

    if user:
        reviews = db.query(UserReview).filter(UserReview.review_taker == user.user_id).all()
        review_obj = []
        for review in reviews:
            giver = db.query(User).filter(User.user_id == review.review_giver).first()
            review_obj.append({
                "user_review_id":review.user_review_id,
                "review_taker": username,  
                "review_giver": giver.username if giver else None ,
                "grade":review.grade,
                "review":review.review
            })
        return review_obj
    else:
        raise HTTPException(status_code=404, detail='Korisnik nije pronađen')

def addUserReview(req: AddReview,request: Request, db: Session = Depends(get_db)):
    user = getUserID(request,db)
    newReview = UserReview(
        review_giver = user.user_id,
        review_taker = db.query(User.user_id).filter(User.username == req.review_taker).first()[0],
        grade = req.grade,
        review = req.review)
    db.add(newReview)
    db.commit()
    db.refresh(newReview)

    return newReview    

@app.post("/add_user_review")
def addReview(req: AddReview,request: Request, db: Session = Depends(get_db)):
    return addUserReview(req,request,db)

def updateUserInfo(req: UserUpdate, request: Request, response: Response, db: Session = Depends(get_db)):
    user = getUserID(request,db)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.username = req.username
    user.email = req.email
    user.first_name = req.first_name
    user.last_name = req.last_name
    if req.hashed_password and str(user.hashed_password) != req.hashed_password:
        hashed = bcrypt.hashpw(req.hashed_password.encode('utf-8'), bcrypt.gensalt())  
        user.hashed_password = hashed.decode('utf-8')
    login_cookie = request.cookies.get("login-cookie")
    if not login_cookie:
        raise HTTPException(status_code = 401, detail = "Not authenticated")

    try:
        cookie_data_json = unquote(login_cookie)
        cookie_data = json.loads(cookie_data_json)
    except (json.JSONDecodeError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid cookie format")

    user_info = {"username": req.username, "user_role": cookie_data.get("user_role")}
    user_info_json = json.dumps(user_info)
    user_info_encoded = quote(user_info_json)
    response.set_cookie(key="login-cookie", value=user_info_encoded) 
    

    db.commit()
    db.refresh(user)

    return {"status": "success"}

@app.put("/user_info_update")
def user_info_update(req: UserUpdate, request: Request, response: Response,db: Session = Depends(get_db)):
    return updateUserInfo(req,request,response,db)

@app.put("/user_info_update_image")
def update_image(req: UpdateImage, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    user.picture_id = req.picture_id
    db.commit()
    

def playersBySport(sport_name:str):
    if(sport_name == "Football"): return 11
    elif(sport_name == "Basketball"): return 10

from datetime import datetime as dt
def searchAppointments(location: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Appointment)

    current_time = dt.now()
    query = query.filter(Appointment.time >= current_time)

    if location:
        query = query.join(Area).filter(Area.location_info.like(f"%{location.strip()}%"))
    
    appointments = query.all()
    print(appointments)
    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found")

    appointment_info = []
    for appointment in appointments:
        team_name = appointment.teams.name
        area_name = appointment.areas.name
        sport_id = appointment.teams.sport_id
        sportObj = db.query(Sport).filter(Sport.sport_id == sport_id).first()
        sport_name = sportObj.name
        teamPlayerCount = getCountTeamMembers(team_name, db)
        maxPlayerCount = playersBySport(sport_name)

        appointment_info.append({
            "appointment_id": appointment.appointment_id,
            "time": appointment.time,
            "team_name": team_name,
            "area_name": area_name,
            "sport_name": sport_name,
            "location": appointment.areas.name,
            "teamPlayerCount": teamPlayerCount,
            "maxPlayerCount": maxPlayerCount
        })
    
    return appointment_info

@app.get("/search_appointments")
def search_appointments(location: Optional[str] = None, db: Session = Depends(get_db)):
    return searchAppointments(location,db)

def getMapAppointments(idtima: str, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.team_id == idtima).first()
    if not team:
        raise HTTPException(status_code=404, detail="Tim nije pronađen")

    team_name = team.name
    appointments = db.query(Appointment).filter(Appointment.team_id == idtima).all()
    if not appointments:
        raise HTTPException(status_code=404, detail="Nijedan termin nije pronađen za ovaj tim")
    appointment_info = []
    for appointment in appointments:
        area_name = appointment.areas.name
        sport_id = appointment.teams.sport_id
        sportObj = db.query(Sport).filter(Sport.sport_id == sport_id).first()
        sport_name = sportObj.name
        teamPlayerCount = getCountTeamMembers(team_name,db)
        maxPlayerCount = playersBySport(sport_name)
        appointment_info.append({
            "appointment_id":appointment.appointment_id,
            "time": appointment.time,
            "team_name": team_name,
            "area_name": area_name,
            "sport_name": sport_name,
            "teamPlayerCount":teamPlayerCount,
            "maxPlayerCount": maxPlayerCount
        })
    return appointment_info

@app.get("/team_appointment/{idtima}")
def test(idtima: str, db: Session = Depends(get_db)):
    return getMapAppointments(idtima, db)

    

@app.get('/user_appointment/{username}') 
def getUserTermin(username: str,db: Session = Depends(get_db)):
    userID = db.query(User).filter(User.username == username).first()
    teams = db.query(TeamPlayer).filter(TeamPlayer.user_id == userID.user_id).all()
    appointments_info = []
    for team_player in teams:
        team_id = team_player.team_id
        appointments_info.extend(getMapAppointments(team_id, db))
    
    return appointments_info

@app.get('/get_areas_by_company_name/{username}') 
def getAreasByCompanyName(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    company = db.query(Company).filter(Company.user_id == user.user_id).first()
    areas = db.query(Area).filter(Area.owner_company_id == company.company_id).all()
    return areas

@app.get('/get_user_photo/{username}')
def getUserPhoto(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    
    if user and user.picture_id:
        picture = db.query(Picture).filter(Picture.picture_id == user.picture_id).first()
        if picture:
            return {"picture_link": picture.picture_link}
    return {"picture_link": ""}

@app.get("/get_user_id/{username}")
def getUserId(username: str, db: Session = Depends(get_db)):
    return db.query(User).filter(User.username == username).first().user_id

def updateCompanyInfo(req: CompanyUpdateOwner, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.user_id == req.user_id).first()

    if not company:
        return createCompanyOwner(req, db)

    company.name = req.name
    company.email = req.email
    company.phone_number = req.phone_number
    company.location = req.location
    company.description = req.description

    db.commit()
    db.refresh(company)

    return {"status": "success"}

@app.put("/company_info_update")
def companyInfoUpdate(req: CompanyUpdateOwner, db: Session = Depends(get_db)):
    return updateCompanyInfo(req,db)

@app.get('/get_company_photos/{username}')
def getCompanyPhotos(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    company = db.query(Company).filter(Company.user_id == user.user_id).first()
    pictures = db.query(CompanyPicture).filter(CompanyPicture.company_id == company.company_id).all()
    
    pictureArray = []
    for p in pictures:
        path = db.query(Picture).filter(Picture.picture_id == p.picture_id).filter().first().picture_link
        pictureArray.append(path)
    
    return pictureArray

@app.get('/get_area_photos/{id}')
def getCompanyPhotos(id: str, db: Session = Depends(get_db)):
    pictures = db.query(AreaPicture).filter(AreaPicture.company_id == id).all()
    
    pictureArray = []
    for p in pictures:
        path = db.query(Picture).filter(Picture.picture_id == p.picture_id).filter().first().picture_link
        pictureArray.append(path)
    
    return pictureArray

@app.delete('/delete_company_pictures/{username}')
def delete_photos(username: str, pictures: PictureDeleteRequest, db: Session = Depends(get_db)):
    try:
        print("TUUUUUUUUUUUUUUUUUUUUUUU", pictures)
        user = db.query(User).filter(User.username == username).first()
        company = db.query(Company).filter(Company.user_id == user.user_id).first()
        picture_ids = pictures.pictures

        company_pictures = db.query(CompanyPicture).filter(
            CompanyPicture.company_id == company.company_id,
            CompanyPicture.picture_id.in_(picture_ids)
        ).all()

        for cp in company_pictures:
            db.delete(cp)

        db.commit()

        pictures_to_delete = db.query(Picture).filter(Picture.picture_id.in_(picture_ids)).all()

        for ptd in pictures_to_delete:
            db.delete(ptd)
        
        db.commit()

        return {"message": "Pictures deleted successfully"}

    except Exception as e:
        db.rollback()
        print(f"Error deleting pictures: {e}")
        return {"error": "An error occurred while deleting pictures"}
    
@app.delete('/delete_area_pictures/{id}')
def delete_photos(id: str, pictures: PictureDeleteRequest, db: Session = Depends(get_db)):
    try:
        picture_ids = pictures.pictures

        area_pictures = db.query(AreaPicture).filter(
            AreaPicture.company_id == id,
            AreaPicture.picture_id.in_(picture_ids)
        ).all()

        for cp in area_pictures:
            db.delete(cp)

        db.commit()

        pictures_to_delete = db.query(Picture).filter(Picture.picture_id.in_(picture_ids)).all()

        for ptd in pictures_to_delete:
            db.delete(ptd)
        
        db.commit()

        return {"message": "Pictures deleted successfully"}

    except Exception as e:
        db.rollback()
        print(f"Error deleting pictures: {e}")
        return {"error": "An error occurred while deleting pictures"}    
    
@app.get('/get_area_types')
def areaTypes(db: Session = Depends(get_db)):
    return db.query(AreaType).all()

@app.get('/get_area_info/{area_id}')
def areaInfo(area_id: str, db: Session = Depends(get_db)):
    return db.query(Area).filter(Area.area_id == area_id).first()

@app.get('/get-teams')
def getTeams(req:Request,db: Session = Depends(get_db)):
    user = getUserID(req,db)
    teams = db.query(Team).filter(user.user_id == Team.leader).all()

    return teams

@app.get('/get-player-list/{team}')
def get_users_not_in_team(team:str,db: Session = Depends(get_db) ):
    
    all_users = db.query(User).all()

    users_in_team = db.query(User).join(User.team_players).filter(
        TeamPlayer.team_id == team
    ).all()
    users_not_in_team = [user for user in all_users if user not in users_in_team]
    return users_not_in_team

@app.post('/create-chat/{my_username}')
def createNewChat(my_username: str, usersWithName: UsersWithName, db: Session = Depends(get_db)):
    try:
        user_ids = []
        
        for username in usersWithName.users:
            user = db.query(User).filter(User.username == username).first()
            if user:
                user_ids.append(user.user_id)
            else:
                raise HTTPException(status_code=404, detail=f"User with username {username} not found")
        
        my_user = db.query(User).filter(User.username == my_username).first()
        if my_user:
            user_ids.append(my_user.user_id)
        else:
            raise HTTPException(status_code=404, detail=f"User with username {my_username} not found")
 
        new_chat = Chat(name=usersWithName.name)
        db.add(new_chat)
        db.flush()  
        
        for user_id in user_ids:
            new_user_chat = ChatUser(chat_id=new_chat.chat_id, user_id=user_id)
            db.add(new_user_chat)
        
        db.commit()
        
        return {"message": "Chat created successfully"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create chat: {str(e)}")
    
@app.get('/get-chat-participants/{name}')
def getPeople(name: str, db: Session = Depends(get_db)):   
    chat_id = db.query(Chat).filter(Chat.name == name).first().chat_id
    
    usernames = []
    users = db.query(ChatUser).filter(ChatUser.chat_id == chat_id).all()
    for user in users:
        new_user = db.query(User).filter(User.user_id == user.user_id).first()
        usernames.append(new_user.username)
    
    return usernames

@app.get('/users-not-in-chat/{name}')
def getUsersNotInChat(name: str, db: Session = Depends(get_db)):
    chat_id = db.query(Chat).filter(Chat.name == name).first().chat_id
    all_users = db.query(User).all()

    usernames = []
    users = db.query(ChatUser).filter(ChatUser.chat_id == chat_id).all()
    for user in users:
        new_user = db.query(User).filter(User.user_id == user.user_id).first()
        usernames.append(new_user.username)

    print("lol")

    selected_users = []
    for user in all_users:
        if not user.username in usernames:
            selected_users.append(user.username)

    return selected_users

@app.post('add-users-to-chat/{name}')
def insertUsersInChat(name: str, users: List[str], db: Session = Depends(get_db)):
    chat_id = db.query(Chat).filter(Chat.name == name).first().chat_id

    user_ids = []
    for username in users:
        user = db.query(User).filter(User.username == username).first()
        user_ids.append(user.user_id)

    for user in user_ids:
        new_user = ChatUser(chat_id = chat_id, user_id = user.user_id)
        db.add(new_user)

    db.commit()

@app.get('redom-poruke/{username}')
def redom(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()

    