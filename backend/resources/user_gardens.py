from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, User, Garden, user_gardens
from database.schemas import garden_schema, gardens_schema, user_garden_schema


class UserGardensResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        serialized_gardens = gardens_schema.dump(user.user_gardens)
        return serialized_gardens, 200
    

    @jwt_required()
    def post(self):
        username = request.json.get('username')
        user = User.query.filter_by(username=username).first()

        garden_id = request.json.get('garden_id')
        garden = Garden.query.get(garden_id)    
        user.user_gardens.append(garden)
        db.session.commit()
        serialized_user_garden = user_garden_schema.dump(garden)
        return serialized_user_garden, 201

