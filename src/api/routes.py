"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, UserProfile, ProviderProfile, Address, Exclusion, ServiceRequest, Notification, ServiceDescription
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

# Imports for CalendarModal component

from datetime import date, datetime, timedelta
import calendar

# Imports for Google Distance MAtrix API calls
import requests

#*********************************************


# Bilerplate code 

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
        token = create_access_token(identity=provider.email , expires_delta=timedelta(hours=1))
        return jsonify({"token": token}), 200
    return jsonify({"error": "error login"}), 401


@api.route("/signinuser", methods=["POST"])
def signin_user():
    body = request.json
    user = UserProfile.query.filter_by(
        email=body["email"], password=body["password"]).first()
    if user:
        access_token = create_access_token(identity=user.email , expires_delta=timedelta(hours=1))
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
                user_id=user.id,
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

 #  PRIVATE USER endpoints - CALENDAR - get Booked days

@api.route("/getuserbookeddays", methods=["GET"])
@jwt_required()
def get_user_booked_days():
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()
        if user:
            current_date = date.today()

            # Calculate the end date (current date + 28 days)
            end_date = current_date + timedelta(days=28)

            service_requests = ServiceRequest.query \
                .join(ServiceDescription) \
                .filter(ServiceRequest.user_id == user.id) \
                .filter(ServiceRequest.date.between(current_date, end_date)) \
                .all()

            unique_dates = {}

            for request in service_requests:
                if request.date not in unique_dates:
                    unique_dates[request.date] = set()
                unique_dates[request.date].add(
                    request.service_description.category)

            result = []
            for unique_date, categories in unique_dates.items():
                if len(categories) > 1:
                    category = "multiple"
                else:
                    category = categories.pop()
                result.append({
                    "date": unique_date.strftime("%Y-%m-%d"),
                    "category": category
                })

            return jsonify(result), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500


 # PRIVATE USER endpoints - DELETE service request

@api.route("/deleteservicerequest/<int:service_request_id>", methods=["DELETE"])
@jwt_required()
def delete_service_request(service_request_id):
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()

        if user:
            service_request = ServiceRequest.query.get(service_request_id)

            if service_request:
                provider_id = service_request.provider_id

                # Creates a notification for the provider, if it already has a provider_id
                if provider_id is not None:
                    notification = Notification(
                        type_of_notification=0,
                        status=1,
                        publishing_date_time=datetime.now(),
                        # use {} to include vars from serviceRequest
                        message="Service cancelled.",
                        provider_id=provider_id,
                    )

                    db.session.add(notification)

                db.session.delete(service_request)
                db.session.commit()

                return jsonify({"message": "Service request deleted successfully"}), 200
            else:
                return jsonify({"message": "Service request not found"}), 404
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        print(e)
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500


 # PRIVATE USER endpoints - update and renew service request

@api.route("/updateandrenewservicerequest/<int:service_request_id>", methods=["PUT"])
@jwt_required()
def updateandrenew_service_request(service_request_id):
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()

        if user:
            service_request = ServiceRequest.query.get(service_request_id)

            if service_request:
                if service_request.recurrence == 1:
                    service_request.status = 4
                else:
                    service_request.status = 5

                    renewed_service_request = ServiceRequest()
                    renewed_service_request.status = 1
                    renewed_service_request.time = service_request.time
                    renewed_service_request.recurrence = service_request.recurrence
                    renewed_service_request.quantity = service_request.quantity
                    renewed_service_request.service_description_id = service_request.service_description_id
                    renewed_service_request.user_id = service_request.user_id
                    renewed_service_request.provider_id = None
                    renewed_service_request.address_id = service_request.address_id
                    renewed_service_request.verbal_password = service_request.verbal_password
                    renewed_service_request.qr_password = service_request.qr_password

                    renewed_date = service_request.date

                    if service_request.recurrence == 2:
                        year = service_request.date.year
                        month = service_request.date.month
                        day = service_request.date.day

                        if month == 1 and day >= 29:
                            if calendar.isleap(year):
                                renewed_date = date(year, 2, 29)
                            else:
                                renewed_date = date(year, 2, 28)
                        else:
                            next_month = month + 1

                            if next_month in [4, 6, 9, 11] and day == 31:
                                day = 30

                            if next_month > 12:
                                next_month = 1
                                year += 1
                            renewed_date = date(year, next_month, day)

                        renewed_service_request.date = renewed_date

                    elif service_request.recurrence == 3:
                        renewed_date += timedelta(days=7)
                    else:
                        renewed_date += timedelta(days=1)

                    renewed_service_request.date = renewed_date

                    db.session.add(renewed_service_request)

                db.session.commit()

                return jsonify({"message": "Service request updated successfully"}), 200
            else:
                return jsonify({"message": "Service request not found"}), 404
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        print(e)
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500


# PRIVATE USER endpoints - rate Provider

@api.route("/rateprovider/<int:service_request_id>/<float:rating>", methods=["PUT"])
@jwt_required()
def rate_provider(service_request_id, rating):
    try:
        user_email = get_jwt_identity()
        user = UserProfile.query.filter_by(email=user_email).first()

        # updates Provider ratings
        if user:
            service_request = ServiceRequest.query.get(service_request_id)

            if service_request:
                provider = ProviderProfile.query.get(
                    service_request.provider_id)
                if provider:
                    provider.average_rating = (
                        (provider.average_rating * provider.rating_counter) + rating
                    ) / (provider.rating_counter + 1)
                    provider.rating_counter += 1
                    db.session.commit()
                else:
                    return jsonify({"message": "Providernot found"}), 404

                return jsonify({"message": "Provider rating updated successfully"}), 200
            else:
                return jsonify({"message": "Service request not found"}), 404
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({
            "message": "An error occurred",
            "error": str(e)
        }), 500


# Google API distane matrix call

def get_distance_and_time(latitude1, longitude1, latitude2, longitude2):
    api_key = "AIzaSyA0Wq3nAEPCtgSku9z8_bcRM7-NTyGKRVk"
    origin = f"{latitude1},{longitude1}"
    destination = f"{latitude2},{longitude2}"
    url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}&destinations={destination}&units=metric&key={api_key}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if data['status'] == 'OK':
            distance_text = data['rows'][0]['elements'][0]['distance']['text']
            distance_value = data['rows'][0]['elements'][0]['distance']['value']
            time_text = data['rows'][0]['elements'][0]['duration']['text']
            time_value = data['rows'][0]['elements'][0]['duration']['value']

            return {'distance': distance_text, 'distance_value': distance_value,
                    'time': time_text, 'time_value': time_value}
        else:
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error with requesting data from Google API: {e}")
        return None
    except KeyError:
        print("Error with parsing Google API response: Invalid response format")
        return None

""" def get_distance_time_between_providers():
    provider_profiles = ProviderProfile.query.all()

    result = []

    for i in range(len(provider_profiles) - 1):
        current_provider = provider_profiles[i]
        next_provider = provider_profiles[i + 1]

        current_address = current_provider.address
        next_address = next_provider.address

        if current_address and next_address:
            latitude1, longitude1 = current_address.latitude, current_address.longitude
            latitude2, longitude2 = next_address.latitude, next_address.longitude

            distance_time = get_distance_and_time(latitude1, longitude1, latitude2, longitude2)

            if distance_time:
                current_provider_id = current_provider.id
                next_provider_id = next_provider.id
                distance = distance_time['distance']
                travel_time = distance_time['time']

                result.append({
                    'current_provider_id': current_provider_id,
                    'next_provider_id': next_provider_id,
                    'distance': distance,
                    'travel_time': travel_time
                })

    return result
 """