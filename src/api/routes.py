"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, UserProfile, ProviderProfile, Address, Exclusion, ServiceRequest, Notification, ServiceDescription
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

# REGISTER endpoints


@api.route("/users", methods=["POST"])
def create_user():
    body = request.json
    user_already_exists = UserProfile.query.filter_by(
        email=body["email"]).first()
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


@api.route("/providers", methods=["POST"])
def create_provider():
    body = request.json
    provider_already_exists = ProviderProfile.query.filter_by(
        email=body["email"]).first()
    if provider_already_exists:
        return jsonify({"Message": "Email already in use"}), 301
    new_provider = ProviderProfile(
        name=body["name"],
        email=body["email"],
        password=body["password"],
        has_certificate=body["has_certificate"],
        experience=body["experience"],
        service_radius=body["service_radius"],
        average_rating=body["average_rating"],
        ratings_counter=body["ratings_counter"],
        avatar_image=body["avatar_image"]
    )
    db.session.add(new_provider)
    db.session.commit()
    return jsonify({"id": new_provider.id}), 200


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

# SIGN IN endpoints


@api.route("/signinprovider", methods=["POST"])
def signin_provider():
    body = request.json
    provider = ProviderProfile.query.filter_by(
        email=body["email"], password=body["password"]).first()
    if provider:
        token = create_access_token(identity=provider.email)
        return jsonify({"token": token}), 200
    return jsonify({"error": "error login"}), 401


@api.route("/signinuser", methods=["POST"])
def signin_user():
    body = request.json
    user = UserProfile.query.filter_by(
        email=body["email"], password=body["password"]).first()
    if user:
        access_token = create_access_token(identity=user.email)
        return jsonify({"token": access_token}), 200
    return jsonify({"error": "error login"}), 401


@api.route("/getuser", methods=["GET"])
@jwt_required()
def get_user():
    user_email = get_jwt_identity()
    user = UserProfile.query.filter_by(email=user_email).first()
    return jsonify({"user": user.serialize()}), 200


@api.route("/getprovider", methods=["GET"])
@jwt_required()
def get_provider():
    provider_email = get_jwt_identity()
    provider = ProviderProfile.query.filter_by(email=provider_email).first()
    return jsonify({"provider": provider.serialize()}), 200


# PRIVATE USER endpoints

@api.route("/servicedescriptions")
def get_service_descriptions():
    try:
        service_descriptions = ServiceDescription.query.all()
        serialized_service_descriptions = []

        for description in service_descriptions:
            serialized_description = description.serialize()
            serialized_description.pop("service_provided", None)
            serialized_service_descriptions.append(serialized_description)

        return jsonify(serialized_service_descriptions), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# PRIVATE USER endpoints - All USER DATA


@api.route("/getusersettings", methods=["GET"])
@jwt_required()
def get_user_settings():
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()

        if user:
            user_settings = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "must_have_certificate": user.must_have_certificate,
                "required_experience": user.required_experience,
                "required_rating": user.required_rating,
                "avatar_image": user.avatar_image
            }
            return jsonify({"message": "Settings successfully retrieved", "user_settings": user_settings})
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500


@api.route("/getuseraddresses", methods=["GET"])
@jwt_required()
def get_user_addresses():
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()
        if user:
            main_address = Address.query.filter_by(
                user_id=user.id, is_main=True).first()
            secondary_address = Address.query.filter_by(
                user_id=user.id, is_main=False).first()
            user_addresses = {
                "id1": main_address.id or "",
                "street1": main_address.street or "",
                "apartment1": main_address.apartment or "",
                "city1": main_address.city or "",
                "state1": main_address.state or "",
                "postalcode1": main_address.postal_code or "",
                "country1": main_address.country or "",
                "id2": secondary_address.id or "",
                "street2": secondary_address.street or "",
                "apartment2": secondary_address.apartment or "",
                "city2": secondary_address.city or "",
                "state2": secondary_address.state or "",
                "postalcode2": secondary_address.postal_code or "",
                "country2": secondary_address.country or "",
            }

            return jsonify({
                "message": "Addresses successfully retrieved",
                "user_addresses": user_addresses
            })
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500


@api.route("/getuserexclusions", methods=["GET"])
@jwt_required()
def get_user_exclusions():
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()
        if user:
            exclusions = Exclusion.query.filter_by(
                user_id=user.id).limit(5).all()
            user_exclusions = {}

            for i in range(1, 6):
                if i <= len(exclusions):
                    exclusion_id = exclusions[i - 1].provider_id
                    exclusion_name = exclusions[i - 1].provider_profile.name
                else:
                    exclusion_id = ""
                    exclusion_name = ""

                user_exclusions[f"exclusion{i}_id"] = exclusion_id
                user_exclusions[f"exclusion{i}_name"] = exclusion_name

            return jsonify({
                "message": "Exclusions successfully retrieved",
                "user_exclusions": user_exclusions
            })
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500


@api.route("/getuserservicerequests", methods=["GET"])
@jwt_required()
def get_user_service_requests():
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()
        if user:
            service_requests = ServiceRequest.query.filter_by(
                user_id=user.id).all()
            serialized_service_requests = [
                request.serialize() for request in service_requests]
            return jsonify({
                "message": "Service requests successfully retrieved",
                "user_requests": serialized_service_requests
            })
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500


@api.route("/getusernotifications", methods=["GET"])
@jwt_required()
def get_user_notifications():
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()
        if user:
            notifications = Notification.query.filter_by(user_id=user.id).all()
            serialized_notifications = [
                notification.serialize() for notification in notifications]
            return jsonify({
                "message": "Notifications successfully retrieved",
                "notifications": serialized_notifications
            })
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500

 # PRIVATE USER endpoints - create SERVICE REQUEST


@api.route("/createrequest", methods=["POST"])
@jwt_required()
def create_service_request():
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()
        if user:
            body = request.json
            new_request = ServiceRequest(
                status=body["status"],
                date=body["date"],
                time=body["time"],
                recurrence=body["recurrence"],
                quantity=body["quantity"],
                service_description_id=body["service_description_id"],
                user_id=body["user_id"],
                provider_id=body["provider_id"],
                address_id=body["address_id"]
            )
            db.session.add(new_request)
            db.session.commit()
            return jsonify({"message": "Request successfully created"}), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500
