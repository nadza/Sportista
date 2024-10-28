from sqlalchemy import Column, ForeignKey, Integer, String, Text, Float, Date, DateTime, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from .database import Base

from pydantic import BaseModel

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(32), unique=True, index=True)
    email = Column(String(128), unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String(32))
    last_name = Column(String(32))
    picture_id = Column(UUID(as_uuid=True), ForeignKey('pictures.picture_id'))
    user_role_id = Column(Integer, ForeignKey('user_roles.user_role_id'))  

    pictures = relationship("Picture", back_populates="users")  
    user_roles = relationship("UserRole", back_populates="users") 
    
    given_reviews = relationship("UserReview", back_populates="givers", primaryjoin="User.user_id == UserReview.review_giver")
    received_reviews = relationship("UserReview", back_populates="takers", primaryjoin="User.user_id == UserReview.review_taker")
    user_sport_preferences = relationship("UserSportPreference", back_populates="users")
    teams = relationship("Team", back_populates="users")
    team_players = relationship("TeamPlayer", back_populates="users")
    companies = relationship("Company", back_populates="users")
    chat_users = relationship("ChatUser", back_populates="users")
    messages = relationship("Message", back_populates="users")
    notifications = relationship("Notification", back_populates="users")

class Company(Base):
    __tablename__ = "companies"

    company_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(64), unique=True, index=True)
    email = Column(String(128), unique=True)
    phone_number = Column(String(9), unique=True)
    location = Column(String(64), unique=True)
    description = Column(Text)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))

    users = relationship("User", back_populates="companies")
    company_pictures = relationship("CompanyPicture", back_populates="companies")
    areas = relationship("Area", back_populates="companies")

class Sport(Base):
    __tablename__ = "sports"

    sport_id = Column(Integer, primary_key=True)
    name = Column(String(16), unique=True, index=True)

    area_sports = relationship("AreaSport", back_populates="sports")
    user_sport_preferences = relationship("UserSportPreference", back_populates="sports")
    teams = relationship("Team", back_populates="sports")

class AreaType(Base):
    __tablename__= "area_types"

    area_type_id = Column(Integer, primary_key=True)
    name = Column(String(16), unique=True, index=True)

    areas = relationship("Area", back_populates="area_types")

class AreaSport(Base):
    __tablename__= "area_sports"

    area_sport_id = Column(Integer, primary_key=True)

    area_id = Column(UUID(as_uuid=True), ForeignKey('areas.area_id'))
    sport_id = Column(Integer, ForeignKey('sports.sport_id'))

    areas = relationship("Area", back_populates="area_sports")
    sports = relationship("Sport", back_populates="area_sports")

class Area(Base):
    __tablename__ = "areas"

    area_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(32), unique=True, index=True)
    description = Column(Text)
    location_info = Column(String(64))
    grade = Column(Float)

    area_type_id = Column(Integer, ForeignKey('area_types.area_type_id')) 
    owner_company_id = Column(UUID(as_uuid=True), ForeignKey('companies.company_id')) 
    
    area_types = relationship("AreaType", back_populates="areas")
    companies = relationship("Company", back_populates="areas")
    
    area_sports = relationship("AreaSport", back_populates="areas")
    area_pictures = relationship("AreaPicture", back_populates="areas")
    appointments = relationship("Appointment", back_populates="areas")
     
class Picture(Base):
    __tablename__ = "pictures"

    picture_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    picture_link = Column(Text)

    users = relationship("User", back_populates="pictures")
    company_pictures = relationship("CompanyPicture", back_populates="pictures")
    area_pictures = relationship("AreaPicture", back_populates="pictures")
    teams = relationship("Team", back_populates="pictures")

class UserReview(Base):
    __tablename__ = "user_reviews"

    user_review_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    review_giver = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    review_taker = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    grade = Column(Float)
    review = Column(Text)

    givers = relationship("User", foreign_keys=[review_giver], back_populates="given_reviews")
    takers = relationship("User", foreign_keys=[review_taker], back_populates="received_reviews")

class UserSportPreference(Base):
    __tablename__ = "user_sport_preferences"

    user_sport_id = Column(Integer, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    sport_id = Column(Integer, ForeignKey('sports.sport_id'))

    users = relationship("User", back_populates="user_sport_preferences")
    sports = relationship("Sport", back_populates="user_sport_preferences")

class Team(Base):
    __tablename__ = "teams"

    team_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(32), unique=True, index=True)
    foundation_date = Column(Date)
    leader = Column(UUID(as_uuid=True), ForeignKey('users.user_id')) 
    sport_id = Column(Integer, ForeignKey('sports.sport_id'))
    picture_id = Column(UUID(as_uuid=True), ForeignKey('pictures.picture_id'))

    users = relationship("User", back_populates="teams") 
    sports = relationship("Sport", back_populates="teams")
    pictures = relationship("Picture", back_populates="teams")

    team_players = relationship("TeamPlayer", back_populates="teams")
    appointments = relationship("Appointment", back_populates="teams")

class TeamPlayer(Base):
    __tablename__ = "teamplayers"

    team_player_id = Column(Integer, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.team_id'))

    users = relationship("User", back_populates="team_players")
    teams = relationship("Team", back_populates="team_players")

class CompanyPicture(Base):
    __tablename__ = "company_pictures"

    company_picture_id = Column(Integer, primary_key=True)
    picture_id = Column(UUID(as_uuid=True), ForeignKey('pictures.picture_id'))
    company_id = Column(UUID(as_uuid=True), ForeignKey('companies.company_id'))

    companies = relationship("Company", back_populates="company_pictures")
    pictures = relationship("Picture", back_populates="company_pictures")

class AreaPicture(Base):
    __tablename__ = "area_pictures"

    area_picture_id = Column(Integer, primary_key=True)
    picture_id = Column(UUID(as_uuid=True), ForeignKey('pictures.picture_id'))
    company_id = Column(UUID(as_uuid=True), ForeignKey('areas.area_id'))

    areas = relationship("Area", back_populates="area_pictures")
    pictures = relationship("Picture", back_populates="area_pictures")

class UserRole(Base):
    __tablename__ = "user_roles"

    user_role_id = Column(Integer, primary_key=True)
    role = Column(String(32), unique=True)

    users = relationship("User", back_populates="user_roles")

class Appointment(Base):
    __tablename__ = "appointments"

    appointment_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    time = Column(DateTime)
    area_id = Column(UUID(as_uuid=True), ForeignKey('areas.area_id'))
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.team_id'))

    areas = relationship("Area", back_populates="appointments")
    teams = relationship("Team", back_populates="appointments")

# CHAT:
class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(32))

    chat_users = relationship("ChatUser", back_populates="chats")
    messages = relationship("Message", back_populates="chats")

class ChatUser(Base):
    __tablename__ = "chat_users"

    chat_id = Column(UUID(as_uuid=True), ForeignKey('chats.chat_id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))

    chats = relationship("Chat", back_populates="chat_users")
    users = relationship("User", back_populates="chat_users")    

    __table_args__ = (
        PrimaryKeyConstraint('chat_id', 'user_id', name='chat_user_pk'),
    )

class Message(Base):
    __tablename__ = "messages"

    message_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    chat_id = Column(UUID(as_uuid=True), ForeignKey('chats.chat_id'))
    content = Column(Text)
    time = Column(DateTime)

    chats = relationship("Chat", back_populates="messages")
    users = relationship("User", back_populates="messages")    

class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))  
    content = Column(Text)

    users = relationship("User", back_populates="notifications")    

