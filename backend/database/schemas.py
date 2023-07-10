from datetime import date
from flask_marshmallow import Marshmallow
from marshmallow import post_load, fields, validates, ValidationError
from database.models import User, Car, Garden, Plant, Task, Harvest

ma = Marshmallow()

# Auth Schemas
class RegisterSchema(ma.Schema):
    """
    Schema used for registration, includes password
    """
    id = fields.Integer(primary_key=True)
    username = fields.String(required=True)
    password = fields.String(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.String(required=True)
    class Meta:
        fields = ("id", "username",  "password", "first_name", "last_name", "email")

    @post_load
    def create_user(self, data, **kwargs):
        return User(**data)
    
class UserSchema(ma.Schema):
    """
    Schema used for displaying users, does NOT include password
    """
    id = fields.Integer(primary_key=True)
    username = fields.String(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.String(required=True)
    class Meta:
        fields = ("id", "username", "first_name", "last_name", "email",)

register_schema = RegisterSchema()
user_schema = UserSchema()
users_schema = UserSchema(many=True)


# Car Schemas
class CarSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    make = fields.String(required=True)
    model = fields.String(required=True)
    year = fields.Integer()
    user_id = fields.Integer()
    user = ma.Nested(UserSchema, many=False)
    class Meta:
        fields = ("id", "make", "model", "year", "user_id", "user")
    
    @post_load
    def create_car(self, data, **kwargs):
        return Car(**data)

car_schema = CarSchema()
cars_schema = CarSchema(many=True)



class GardenSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    user_id = fields.Integer()
    name = fields.String(required=True)
    notes = fields.String()
    user = ma.Nested(UserSchema)
    users = ma.Nested(UserSchema, many =True)

    class Meta:
        fields = ("id", "user_id", "name", "notes", "user", "users")
    
    @post_load
    def create_garden(self, data, **kwargs):
        return Garden(**data)

garden_schema = GardenSchema()
gardens_schema = GardenSchema(many=True)

class UserGardenSchema(ma.Schema):
    user_id = fields.Integer()
    garden_id = fields.Integer()
    user = ma.Nested(UserSchema)
    garden = ma.Nested(GardenSchema)
    
    class Meta:
        fields = ("user_id", "garden_id", "user", "garden")
    
    @post_load
    def create_user_garden(self, data, **kwargs):
        return {
            'user_id': data['user_id'],
            'garden_id': data['garden_id'],
            'user': data['user'],
            'garden': data['garden']
        }

user_garden_schema = UserGardenSchema()
user_gardens_schema = UserGardenSchema(many=True)




class PlantSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    type = fields.String(required=True)
    location = fields.String(required=True)
    image_url = fields.String()
    garden_id = fields.Integer()
    garden = ma.Nested(GardenSchema)
    
    class Meta:
        fields = ("id", "type", "location", "image_url", "garden_id", "garden")
    
    @post_load
    def create_plant(self, data, **kwargs):
        return Plant(**data)

plant_schema = PlantSchema()
plants_schema = PlantSchema(many=True)

class TaskSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    user_id = fields.Integer()
    plant_id = fields.Integer(required=True)
    task_type = fields.String(required=True)
    task_scheduled = fields.Date(required=True)
    task_completed = fields.Date()
    user = ma.Nested(UserSchema, many=False)
    plant = ma.Nested(PlantSchema, many=False)
    

    
    class Meta:
        fields = ("id", "plant_id", "user_id", "task_type", "task_scheduled", "task_completed", "user", "plant")
    
    @post_load
    def create_task(self, data, **kwargs):
        return Task(**data)

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

class HarvestSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    task_id = fields.Integer()
    rating = fields.Integer(required=True)
    image_url = fields.String()
    notes = fields.String()
    task_completed = fields.Date(required=True)
    plant_id = fields.Integer(required=True)
    task = ma.Nested(TaskSchema, many=False)

    class Meta:
        fields = ("id", "task_id", "rating", "image_url", "notes", "task_completed", "plant_id", "task")
    
    @post_load
    def create_harvest(self, data, **kwargs):
        return Harvest(**data)

harvest_schema = HarvestSchema()
harvests_schema = HarvestSchema(many=True)