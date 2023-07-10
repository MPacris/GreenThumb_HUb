from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, Garden
from database.schemas import garden_schema, gardens_schema



class GardensResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user_gardens = Garden.query.filter_by(user_id=user_id).all()
        return gardens_schema.dump(user_gardens), 200


    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        form_data = request.get_json()
        new_garden = garden_schema.load(form_data)
        new_garden.user_id = user_id
        db.session.add(new_garden)
        db.session.commit()
        return garden_schema.dump(new_garden), 201
    

class GetGardenResource(Resource):
    @jwt_required()
    def get(self, garden_id):
        user_id = get_jwt_identity()
        garden = Garden.query.filter_by(id=garden_id).first()
        if not garden:
            return {'message': 'Garden not found'}, 404
        
        # Check if the user is either the creator or has been assigned to the garden
        if garden.user_id != user_id:
            assigned_garden = db.session.execute(
                "SELECT * FROM usergardens WHERE user_id = :user_id AND garden_id = :garden_id",
                {'user_id': user_id, 'garden_id': garden_id}
            ).fetchone()
            if not assigned_garden:
                return {'message': 'You are not authorized to access this garden'}, 403

        return garden_schema.dump(garden), 200
    
    
    @jwt_required()
    def put(self, garden_id):
        user_id = get_jwt_identity()
        garden = Garden.query.filter_by(id=garden_id, user_id=user_id).first()
        if not garden:
            return {'message': 'Garden not found'}, 404

        update_data = request.get_json()
        updated_garden = garden_schema.load(update_data, partial=True)
        garden.name = updated_garden.name
        garden.notes = updated_garden.notes
        db.session.commit()

        return garden_schema.dump(garden), 200

    @jwt_required()
    def delete(self, garden_id):
        user_id = get_jwt_identity()
        garden = Garden.query.filter_by(id=garden_id, user_id=user_id).first()
        if not garden:
            return {'message': 'Garden not found'}, 404

        db.session.delete(garden)
        db.session.commit()

        return {'message': 'Garden deleted'}, 200
    