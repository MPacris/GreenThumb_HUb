from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_restful import Resource
from database.models import db, Task
from database.schemas import task_schema, tasks_schema



class TasksResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user_tasks = Task.query.filter_by(user_id=user_id).all()
        return tasks_schema.dump(user_tasks), 200


    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        form_data = request.get_json()
        new_task = task_schema.load(form_data)
        new_task.user_id = user_id
        db.session.add(new_task)
        db.session.commit()
        return task_schema.dump(new_task), 201
    

class GetTaskResource(Resource):
    
    
    @jwt_required()
    def get(self, task_id):
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        if not task:
            return {'message': 'Task not found'}, 404

        return task_schema.dump(task), 200
    
    
    
    @jwt_required()
    def put(self, task_id):
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        if not task:
            return {'message': 'Task not found'}, 404

        update_data = request.get_json()
        task.task_completed = update_data.get("task_completed", task.task_completed)
        task.user_id = update_data.get("user_id", task.user_id)
        db.session.commit()

        return task_schema.dump(task), 200

    @jwt_required()
    def delete(self, task_id):
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        if not task:
            return {'message': 'Task not found'}, 404

        db.session.delete(task)
        db.session.commit()

        return {'message': 'Task deleted'}, 200
    