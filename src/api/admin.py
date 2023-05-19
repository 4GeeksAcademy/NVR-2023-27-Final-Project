
import os
from flask_admin import Admin
from .models import db, MemberAccount, UserProfile, ProviderProfile, Address, ServiceRequest, Notification, Exclusion, ProviderAvailability, ServiceDescription, ServiceProvided  
from flask_admin.contrib.sqla import ModelView


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(MemberAccount, db.session))
    admin.add_view(ModelView(UserProfile, db.session))
    admin.add_view(ModelView(ProviderProfile, db.session))
    admin.add_view(ModelView(Address, db.session))
    admin.add_view(ModelView(ServiceRequest, db.session))
    admin.add_view(ModelView(Notification, db.session))
    admin.add_view(ModelView(Exclusion, db.session))
    admin.add_view(ModelView(ProviderAvailability, db.session))
    admin.add_view(ModelView(ServiceDescription, db.session))
    admin.add_view(ModelView(ServiceProvided, db.session))


# You can duplicate that line to add mew models
# admin.add_view(ModelView(YourModelName, db.session))
