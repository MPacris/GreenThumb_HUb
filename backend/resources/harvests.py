import os
from flask import request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from werkzeug.utils import secure_filename
from flask_restful import Resource
from database.models import db, Harvest
from database.schemas import harvest_schema, harvests_schema, plant_schema



class HarvestsResource(Resource):
    @jwt_required()
    def get(self):
        user_harvests = Harvest.query.all()
        return harvests_schema.dump(user_harvests), 200


    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        form_data = request.get_json()
        new_harvest = harvest_schema.load(form_data)
        new_harvest.user_id = user_id
        db.session.add(new_harvest)
        db.session.commit()
        return harvest_schema.dump(new_harvest), 201
    
class GetHarvestChartResource(Resource):
    def get(self, plant_id):
        harvests = Harvest.query.filter_by(plant_id=plant_id).all()
        if not harvests:
            return {'message': 'No harvests found for the provided plant_id'}, 404

        chart_data = []
        for harvest in harvests:
            chart_data.append([str(harvest.task_completed), harvest.rating])

        return {'chartData': chart_data}, 200
    
class GetHarvestResource(Resource):
     

    def get(self, harvest_id): 
        harvest = Harvest.query.filter_by(id=harvest_id).first()
        if not harvest:
            return {'message': 'Harvest not found'}, 404

        return harvest_schema.dump(harvest), 200
    
    
    
    @jwt_required()
    def put(self, harvest_id):
        harvest = Harvest.query.filter_by(id=harvest_id).first()
        if not harvest:
            return {'message': 'Harvest not found'}, 404

        update_data = request.get_json()
        updated_harvest = harvest_schema.load(update_data, partial=True)
        harvest.rating = updated_harvest.rating
  
        harvest.notes = updated_harvest.notes
        db.session.commit()

        return harvest_schema.dump(harvest), 200

    @jwt_required()
    def delete(self, harvest_id):
        harvest = Harvest.query.filter_by(id=harvest_id).first()
        if not harvest:
            return {'message': 'Harvest not found'}, 404

        db.session.delete(harvest)
        db.session.commit()

        return {'message': 'Harvest deleted'}, 200



class HarvestImageUploadResource(Resource):
    
    def post(self,harvest_id):
        if 'image_url' not in request.files:
            return 'no_file', 404   
        file = request.files['image_url']
        
        if file.filename == '':
            return 'filename_empty', 404
        
        if file and allowed_file(file.filename):
            harvest = Harvest.query.get_or_404(harvest_id)
            harvest.image_url = file.filename
            db.session.commit()

            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            return 'Success', 201
        
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
