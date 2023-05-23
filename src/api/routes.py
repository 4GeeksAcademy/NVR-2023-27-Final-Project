"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, UserProfile, ProviderProfile
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/signinuser", methods=["POST"])
def signin_user():
    body = request.json
    user = UserProfile.query.filter_by(
        email=body["email"], password=body["password"]).first()
    if user:
        token= create_access_token(identity=user.id) 
        return jsonify({"token":token}), 200
    return jsonify({"error":"error login"}), 401

@api.route("/signinprovider", methods=["POST"])
def signin_provider():
    body = request.json
    provider = ProviderProfile.query.filter_by(
        email=body["email"], password=body["password"]).first()
    print("HELLO")
    if provider:
        ptoken= create_access_token(identity=provider.id) 
        return jsonify({"ptoken":ptoken}), 200
    return jsonify({"error":"error login"}), 401
