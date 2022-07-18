from turtle import Turtle
from mongoengine import Document,fields

class restaurant(Document):
    name=fields.StringField()
    address=fields.StringField()
    cuisine=fields.ListField()
    logo=fields.ImageField()
    owner=fields.ObjectIdField()

class item(Document):
    name=fields.StringField()
    description=fields.StringField()
    image=fields.ImageField()
    isVegetarian=fields.BooleanField()
    category=fields.StringField()
    isAvailable=fields.BooleanField()
    timings=fields.StringField()
    price=fields.FloatField()
    restaurant_id=fields.ObjectIdField()

class admin(Document):
    key=fields.StringField()