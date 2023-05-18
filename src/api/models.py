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
            # do not serialize the password, its a security breach
        }


class MemberAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_type = db.Column(db.Integer, nullable=False)
    user_or_provider_id = db.Column(db.Integer, nullable=False)
    member_name = db.Column(db.String(100), unique=True, nullable=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    user_profile = db.relationship('UserProfile', backref='member_account')
    provider_profile = db.relationship(
        'ProviderProfile', backref='member_account')
    addresses = db.relationship('Address', backref='member_account')


class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member_account.id'))
    must_have_certificate = db.Column(db.Boolean(), nullable=False)
    required_experience = db.Column(db.Integer, nullable=False)
    required_rating = db.Column(db.Float)
    # exclusion_csv_string = db.Column(db.String, nullable=True)
    avatar_images = db.Column(db.String, nullable=True)
    service_requests = db.relationship(
        'ServiceRequest', backref='user_profile')
    notifications = db.relationship('Notification', backref='user_profile')
    exclusion = db.relationship('Exclusion', backref='user_profile')


class ProviderProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member_account.id'))
    has_certificate = db.Column(db.Boolean())
    experience = db.Column(db.Integer, nullable=False)
    # services_csv_string = db.Column(db.String(200), nullable=False)
    service_radius = db.Column(db.Integer, nullable=False)
    average_rating = db.Column(db.Float)
    ratings_counter = db.Column(db.Integer, nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member_account.id'))
    avatar_images = db.Column(db.String, nullable=True)
    service_requests = db.relationship(
        'ServiceRequest', backref='provider_profile')
    notifications = db.relationship('Notification', backref='provider_profile')
    service_list = db.relationship('ServiceList', backref='provider_profile')
    exclusion = db.relationship('Exclusion', backref='provider_profile')


class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_main = db.Column(db.Boolean())
    user_id = db.Column(db.Integer, db.ForeignKey('member_account.id'))
    street = db.Column(db.String(100), nullable=True)
    apartment = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)


class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time_slot = db.Column(db.Integer)
    recurrence = db.Column(db.Integer)
    service = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user_profile.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey(
        'provider_profile.id'), nullable=True)
    address_id = db.Column(db.Integer, db.ForeignKey(
        'address.id'), nullable=False)


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


class Exclusion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profile.id'))
    provider_id = db.Column(db.Integer, db.ForeignKey('provider_profile.id'))


class ProviderAvailability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(100), nullable=False)
    time_slot = db.Column(db.String(100), nullable=False)


class ServiceList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey(
        'provider_profile.id'), nullable=False)
    services_name = db.Column(db.String(100), nullable=False)
