"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, UserProfile, ProviderProfile, Address 
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# POST endpoints

@api.route("/users", methods=["POST"])
def create_user():
    body = request.json
    user_already_exists = UserProfile.query.filter_by(email=body["email"]).first()
    if user_already_exists:
        return jsonify({"Message": "Email already in use"}), 301
    new_user = UserProfile(
        name=body["name"],
        email=body["email"],
        password=body["password"],
        must_have_certificate=body["must_have_certificate"],
        required_experience=body["required_experience"],
        required_rating=body["required_rating"],
        avatar_image=body["avatar_image"]
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"id": new_user.id}), 200


@api.route("/addresses", methods=["POST"])
def create_address():
    body = request.json
    new_address = Address(
        is_main=body["is_main"],
        street=body["street"],
        apartment=body["apartment"],
        city=body["city"],
        state=body["state"],
        postal_code=body["postal_code"],
        country=body["country"],
        latitude=body["latitude"],
        longitude=body["longitude"],
        user_id=body["user_id"],
        provider_id=body["provider_id"]
    )
    db.session.add(new_address)
    db.session.commit()
    return jsonify({"Message": "Address created"}), 200
