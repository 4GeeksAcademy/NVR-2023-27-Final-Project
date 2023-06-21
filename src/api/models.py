from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, it's a security breach
        }

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    must_have_certificate = db.Column(db.Boolean(), nullable=False)
    required_experience = db.Column(db.Integer, nullable=False)
    required_rating = db.Column(db.Float)
    avatar_image = db.Column(db.String(), nullable=True)
    service_requests = db.relationship(
        'ServiceRequest', backref='user_profile')
    notifications = db.relationship('Notification', backref='user_profile')
    exclusions = db.relationship('Exclusion', backref='user_profile')
    addresses = db.relationship('Address', backref='user_profile')

    def __repr__(self):
        return f'<UserProfile {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "must_have_certificate": self.must_have_certificate,
            "required_experience": self.required_experience,
            "required_rating": self.required_rating,
            "avatar_image": self.avatar_image,

        }

class ProviderProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    has_certificate = db.Column(db.Boolean())
    experience = db.Column(db.Integer, nullable=False)
    service_radius = db.Column(db.Integer, nullable=False)
    average_rating = db.Column(db.Float)
    ratings_counter = db.Column(db.Integer, nullable=False)
    avatar_image = db.Column(db.String(), nullable=True)
    services_provided = db.relationship(
        'ServiceProvided', backref='provider_profile')
    service_requests = db.relationship(
        'ServiceRequest', backref='provider_profile')
    notifications = db.relationship('Notification', backref='provider_profile')
    provider_availabilities = db.relationship(
        'ProviderAvailability', backref='provider_profile')
    exclusions = db.relationship('Exclusion', backref='provider_profile')
    address = db.relationship(
        'Address', backref='provider_profile', uselist=False)

    def __repr__(self):
        return f'<ProviderProfile {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "has_certificate": self.has_certificate,
            "experience": self.experience,
            "service_radius": self.service_radius,
            "average_rating": self.average_rating,
            "ratings_counter": self.ratings_counter,
            "avatar_image": self.avatar_image,
        }


class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_main = db.Column(db.Boolean())
    street = db.Column(db.String(100), nullable=True)
    apartment = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user_profile.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey(
        'provider_profile.id'), nullable=True)
    service_request= db.relationship('ServiceRequest', backref='address')

    def __repr__(self):
        return f'<Address {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "is_main": self.is_main,
            "street": self.street,
            "apartment": self.apartment,
            "city": self.city,
            "state": self.state,
            "postal_code": self.postal_code,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "user_id": self.user_id,
            "provider_id": self.provider_id,
        }

class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(250), nullable=False )
    recurrence = db.Column(db.Integer)
    quantity = db.Column(db.Integer) 
    service_description_id = db.Column(db.Integer, db.ForeignKey(
        'service_description.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user_profile.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey(
        'provider_profile.id'), nullable=True)
    address_id = db.Column(db.Integer, db.ForeignKey(
        'address.id'), nullable=False)
    verbal_password = db.Column(db.String(50), nullable=True )
    qr_password = db.Column(db.String(50), nullable=True )
    notifications = db.relationship('Notification', backref='service_request')
    

    def __repr__(self):
        return f'<ServiceRequest {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "status": self.status,
            "date": self.date,
            "time": self.time,
            "recurrence": self.recurrence,
            "quantity": self.quantity,
            "service_description_id": self.service_description_id,
            "user_id": self.user_id,
            "provider_id": self.provider_id,
            "address_id": self.address_id,
            "verbal_password": self.verbal_password,
            "qr_password": self.qr_password,
        }

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type_of_notification = db.Column(db.Integer)
    status = db.Column(db.Integer)
    publishing_date_time = db.Column(db.DateTime, nullable=False)
    message = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user_profile.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey(
        'provider_profile.id'), nullable=True)
    service_request_id = db.Column(db.Integer, db.ForeignKey(
    'service_request.id'), nullable=True)

    def __repr__(self):
        return f'<Notification {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "type_of_notification": self.type_of_notification,
            "status": self.status,
            "publishing_date_time": self.publishing_date_time,
            "message": self.message,
            "user_id": self.user_id,
            "provider_id": self.provider_id,
            "service_request_id": self.service_request_id,

        }


class Exclusion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profile.id'))
    provider_id = db.Column(db.Integer, db.ForeignKey('provider_profile.id'))

    def __repr__(self):
        return f'<Exclusion {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "provider_id": self.provider_id,
        }


class ProviderAvailability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider_profile.id'))
    day = db.Column(db.String(100), nullable=False)
    time_slot = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<ProviderAvailability {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "provider_id": self.provider_id,
            "day": self.day,
            "time_slot": self.time_slot,
        }


class ServiceDescription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable= True)
    service = db.Column(db.String(100), nullable= True)
    description = db.Column(db.String(255), nullable= True)
    unit = db.Column(db.String(100), nullable= True)
    duration = db.Column(db.Float, nullable= True)
    personnel = db.Column(db.Integer, nullable= True)
    included = db.Column(db.String(100), nullable= True)
    price = db.Column(db.Float, nullable= True)
    service_provided = db.Column(db.Integer, db.ForeignKey(
        'service_provided.id'), nullable=True)
    service_request = db.relationship('ServiceRequest', backref='service_description')
    

    def __repr__(self):
        return f'<ServiceDescription {self.service}>'

    def serialize(self):
        return {
            "id": self.id,
            "category": self.category,
            "service": self.service,
            "description": self.description,
            "unit": self.unit,
            "duration": self.duration,
            "personnel": self.personnel,
            "included": self.included,
            "price": self.price
        }

class ServiceProvided(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey(
        'provider_profile.id'), nullable=False)
    services_descriptions = db.relationship(
        'ServiceDescription', backref='service_provider', uselist=False)

    def __repr__(self):
        return f'<ServiceProvided {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "provider_id": self.provider_id,
            "service_id": self.service_id,
        }
