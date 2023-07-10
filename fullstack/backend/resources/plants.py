import os
from flask import request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from werkzeug.utils import secure_filename
from flask_restful import Resource
from database.models import db, Plant, Garden
from database.schemas import plant_schema, plants_schema

class PlantsResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        garden_ids = db.session.execute(
            "SELECT garden_id FROM usergardens WHERE user_id = :user_id",
            {"user_id": user_id}
        ).fetchall()
        garden_ids = [garden_id[0] for garden_id in garden_ids]

        plants = Plant.query.filter(Plant.garden_id.in_(garden_ids)).all()
        return plants_schema.dump(plants), 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        form_data = request.get_json()
        garden_id = int(form_data.get('garden_id', 0))
        plant = plant_schema.load(form_data)
        plant.user_id = user_id
        plant.garden_id = garden_id
        db.session.add(plant)
        db.session.commit()
        return plant_schema.dump(plant), 201
    

class GetPlantResource(Resource):
    
    @jwt_required()
    def put(self, plant_id):
        plant = Plant.query.filter_by(id=plant_id).first()
        if not plant:
            return {'message': 'Plant not found'}, 404

        update_data = request.get_json()
        updated_plant = plant_schema.load(update_data, partial=True)
        plant.type = updated_plant.type
        plant.location = updated_plant.location
        db.session.commit()

        return plant_schema.dump(plant), 200

    
    @jwt_required()
    def delete(self, plant_id):

        plant = Plant.query.filter_by(id=plant_id).first()
        if not plant:
            return {'message': 'Plant not found'}, 404

        db.session.delete(plant)
        db.session.commit()

        return {'message': 'Plant deleted'}, 200
    
    @jwt_required()
    def get(self, plant_id):
        plant = Plant.query.filter_by(id=plant_id).first()
        return plant_schema.dump(plant), 200
    

class PlantImageUploadResource(Resource):
    
    def post(self,plant_id):
        if 'image_url' not in request.files:
            return 'no_file', 404   
        file = request.files['image_url']
        
        if file.filename == '':
            return 'filename_empty', 404
        
        if file and allowed_file(file.filename):
            plant = Plant.query.get_or_404(plant_id)
            plant.image_url = file.filename
            db.session.commit()

            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            return 'Success', 201
        
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
