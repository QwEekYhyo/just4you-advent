from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    CheckConstraint,
)
from sqlalchemy.orm import relationship, sessionmaker, DeclarativeBase


class Base(DeclarativeBase):
    pass


class Calendar(Base):
    __tablename__ = "calendars"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)

    calendar_days = relationship(
        "CalendarDay", back_populates="calendar", cascade="all, delete-orphan"
    )
    users = relationship("User", back_populates="calendar")

    def __repr__(self):
        return f"<Calendar(id={self.id}, name='{self.name}')>"


class CalendarDay(Base):
    __tablename__ = "calendar_days"

    id = Column(Integer, primary_key=True, autoincrement=True)
    day = Column(Integer, nullable=False)
    image_path = Column(String(500))
    is_open = Column(Boolean, default=False, nullable=False)
    calendar_id = Column(Integer, ForeignKey("calendars.id"), nullable=False)

    __table_args__ = (
        CheckConstraint("day >= 1 AND day <= 24", name="check_day_range"),
    )

    calendar = relationship("Calendar", back_populates="calendar_days")

    def __repr__(self):
        return f"<CalendarDay(id={self.id}, day={self.day}, is_open={self.is_open})>"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    calendar_id = Column(Integer, ForeignKey("calendars.id"), nullable=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)

    calendar = relationship("Calendar", back_populates="users")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', is_admin={self.is_admin})>"


# Database setup and session creation
def init_db(database_url="sqlite:///just4you_advent.db"):
    engine = create_engine(database_url, echo=True)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return engine, Session
