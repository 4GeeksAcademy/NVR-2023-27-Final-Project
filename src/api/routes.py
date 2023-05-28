"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, UserProfile, ProviderProfile 
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
        access_token= create_access_token(identity=user.email) 
        return jsonify({"token":access_token}), 200
    return jsonify({"error":"error login"}), 401

@api.route("/signinprovider", methods=["POST"])
def signin_provider():
    body = request.json
    provider = ProviderProfile.query.filter_by(
        email=body["email"], password=body["password"]).first()
    if provider:
        token= create_access_token(identity=provider.email) 
        return jsonify({"token":token}), 200
    return jsonify({"error":"error login"}), 401

@api.route("/getuser", methods=["GET"])
@jwt_required()
def get_user():
    print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    user_email=get_jwt_identity()
    user=UserProfile.query.filter_by(email=user_email).first()
    return jsonify({"user":user.serialize()}), 200

@api.route("/getprovider", methods=["GET"])
@jwt_required()
def get_provider():
    print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    provider_email=get_jwt_identity()
    provider=ProviderProfile.query.filter_by(email=provider_email).first()
    return jsonify({"provider":provider.serialize()}), 200

