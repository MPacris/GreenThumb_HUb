import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_migrate import Migrate
from database.models import db
from database.schemas import ma
from resources.auth import LoginResource, RegisterResource
from resources.cars import AllCarResource, UserCarResource
from resources.gardens import GardensResource, GetGardenResource
from resources.plants import PlantsResource, GetPlantResource, PlantImageUploadResource
from resources.tasks import TasksResource, GetTaskResource
from resources.harvests import HarvestsResource, GetHarvestResource, HarvestImageUploadResource, GetHarvestChartResource
from resources.user_gardens import UserGardensResource


from dotenv import load_dotenv
from os import environ

# Adds variables from .env file to environment
load_dotenv()

# Creates instances of additional libraries
bcrypt = Bcrypt()
jwt= JWTManager()
cors = CORS()
migrate = Migrate()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER =  os.path.join(BASE_DIR, 'static', 'images')

def create_app():
    """
    App factory that creates app instance
    """
    # Creates app instance
    app = Flask(__name__, static_url_path='/static')
    CORS(app)

    # Loads config properties from .env file
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('SQLALCHEMY_DATABASE_URI')
    app.config['JWT_SECRET_KEY'] = environ.get('JWT_SECRET_KEY')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Registers all routes with API
    api = create_routes()

    # Registers Flask app with additional libraries created/imported above
    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    api.init_app(app)
    migrate.init_app(app, db)

    return app


def create_routes():
    """
    Creates Flask Restful instance and registers all Resource routes
    """
    api = Api()
    api.add_resource(RegisterResource, '/api/auth/register')
    api.add_resource(LoginResource, '/api/auth/login')
    api.add_resource(AllCarResource, '/api/cars')
    api.add_resource(UserCarResource, '/api/user_cars')
    # TODO: Create files for your Resources in resources folder, add them here
    
    api.add_resource(GardensResource, '/api/gardens')
    api.add_resource(GetGardenResource, '/api/gardens/<int:garden_id>')


    api.add_resource(PlantsResource, '/api/plants')
    api.add_resource(GetPlantResource, '/api/plants/<int:plant_id>')
    api.add_resource(PlantImageUploadResource, '/api/plantImage/<int:plant_id>')

    api.add_resource(TasksResource, '/api/tasks')
    api.add_resource(GetTaskResource, '/api/tasks/<int:task_id>')

    api.add_resource(HarvestsResource, '/api/harvests')
    api.add_resource(GetHarvestResource, '/api/harvests/<int:harvest_id>')
    api.add_resource(HarvestImageUploadResource, '/api/harvestImage/<int:harvest_id>')
    api.add_resource(GetHarvestChartResource, '/api/harvest-chart/<int:plant_id>')


    api.add_resource(UserGardensResource, '/api/user_gardens')


    return api

app = create_app()