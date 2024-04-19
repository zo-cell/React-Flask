from flask import Flask, make_response, render_template, redirect, session, url_for, flash, g, request, jsonify, abort, send_file, current_app, Response
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, desc, func
from sqlalchemy.orm import relationship
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError, DataRequired, Email, EqualTo, NumberRange
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from werkzeug.utils import secure_filename
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import datetime, timedelta
from datetime import date as Date
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.units import inch
from reportlab.platypus import Image
from flask_oauthlib.client import OAuth, OAuthException
from reportlab.lib.enums import TA_RIGHT

import jwt
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from io import StringIO
import csv
import time
from reportlab.platypus import Paragraph, Spacer
import io, pdfkit, pandas as pd
from io import BytesIO, TextIOWrapper
import os
import logging
import schedule


logging.basicConfig(level=logging.DEBUG)

db = SQLAlchemy()
app = Flask(__name__)
app.app_context().push()
bcrypt = Bcrypt(app)
# jwt = JWTManager(app)


CORS(app)

# 'mysql://shady:123@localhost/react.db'
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///dashboard.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY']=os.urandom(32)


# SMTP server configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True


# Email credentials
app.config['MAIL_USERNAME'] = 'shadysamy428@gmail.com'
app.config['MAIL_PASSWORD'] = 'ztlc iphn dgad gwzr'

db.init_app(app)
ma = Marshmallow(app)


# Initialize Flask-Mail
mail = Mail(app)

# Initialize BackgroundScheduler
scheduler = BackgroundScheduler()
scheduler.start()








oauth = OAuth(app)
google = oauth.remote_app(
    'google',
    consumer_key='986300498034-gdgohhka0scfv04q82uoogb6qrso3fuk.apps.googleusercontent.com',
    consumer_secret='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',
    request_token_params={
        'scope': 'email'
    },
    base_url='https://www.googleapis.com/oauth2/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
)




# Members Model:
class Members(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(120), nullable=False, unique=True)
  firstName = db.Column(db.String(80))
  lastName = db.Column(db.String(80))
  birthDate = db.Column(db.Date)
  age = db.Column(db.Integer)
  phone = db.Column(db.String(100))
  access = db.Column(db.String(80), nullable=False)
  password = db.Column(db.String(100))
  branchID = db.Column(db.Integer)
  status = db.Column(db.String(50), nullable=False)

  def __init__(self, firstName, lastName, email, birthDate, age, phone,  access, password, branchID, status):
    self.firstName = firstName
    self.lastName = lastName
    self.email = email
    self.birthDate = birthDate
    self.age = age
    self.phone = phone
    self.access = access
    self.password = password
    self.branchID = branchID
    self.status = status

# Members schema:
class MembersSchema(ma.Schema):
  class Meta:
    fields = ('id', 'firstName', 'lastName', 'email', 'birthDate', 'age', 'phone', 'access', 'password', 'branchID', 'status')

member_schema =  MembersSchema()
members_schema = MembersSchema(many=True)













# Orders Model:
class Orders(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.Date)
  licensePlate = db.Column(db.String(100), nullable=False)
  carBrand = db.Column(db.String(1000), nullable=False)
  carModel = db.Column(db.String(1000), nullable=False)
  customer = db.Column(db.String(3000), nullable=False)
  service = db.Column(db.String(5000))
  price = db.Column(db.Float, nullable=False)
  W1 = db.Column(db.String(1000), nullable=False)
  W2 = db.Column(db.String(1000), nullable=False)
  W3 = db.Column(db.String(1000), nullable=False)
  notes = db.Column(db.String(1000000), nullable=False)
  branchID = db.Column(db.Integer)


def __init__(self, date, licensePlate, carBrand, carModel, customer, service, price, W1, W2, W3, notes, branchID):
    self.date = date
    self.licensePlate = licensePlate
    self.carBrand = carBrand
    self.carModel = carModel
    self.customer = customer
    self.service = service
    self.price = price
    self.W1 = W1
    self.W2 = W2
    self.W3 = W3
    self.notes = notes
    self.branchID = branchID




# Orders schema:
class OrdersSchema(ma.Schema):
  class Meta:
    fields = ('id', 'date', 'licensePlate', 'carBrand', 'carModel', 'customer', 'service', 'price', 'W1', 'W2', 'W3', 'notes', 'branchID')

order_schema =  OrdersSchema()
orders_schema = OrdersSchema(many=True)











# Workers Model:
class Workers(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  firstName = db.Column(db.String(80), nullable=False)
  lastName = db.Column(db.String(80), nullable=False)
  email = db.Column(db.String(100), nullable=False)
  phone = db.Column(db.String(100), nullable=False)
  access = db.Column(db.String(80), nullable=False)
  password = db.Column(db.String(100), nullable=False)
  Jobs = relationship("Jobs")
  branchID = db.Column(db.Integer)
  status = db.Column(db.String(50), nullable=False)


def __init__(self, firstName, lastName, email, phone, access, password, branchID, status):
    self.firstName = firstName
    self.lastName = lastName
    self.email = email
    self.phone = phone
    self.access = access
    self.password = password
    self.branchID = branchID
    self.status = status


# Workers schema:
class WorkersSchema(ma.Schema):
  class Meta:
    fields = ('id', 'firstName', 'lastName', 'email', 'phone', 'access', 'password', 'branchID', 'status')

worker_schema =  WorkersSchema()
workers_schema = WorkersSchema(many=True)








# Jobs table:
class Jobs(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.Date)
  firstName = db.Column(db.String(80), nullable=False)
  lastName = db.Column(db.String(80), nullable=False)
  jobs = db.Column(db.String(3000), nullable=False)
  customer = db.Column(db.String(1000), nullable=False)
  check = db.Column(db.String(50))
  subMission = db.Column(db.String(3000000))
  doubled = db.Column(db.String(50))
  worker_id = db.Column(db.Integer, ForeignKey('workers.id'))
  workerEmail = db.Column(db.String(100), nullable=False)
  image1 = db.Column(db.String(1000000), nullable=False)
  image2 = db.Column(db.String(1000000))
  image3 = db.Column(db.String(1000000))
  branchID = db.Column(db.Integer)



def __init__(self, date, firstName, lastName, jobs, customer, check, doubled, worker_id, subMission, image1, image2, image3, branchID, workerEmail):
    self.date= date
    self.firstName = firstName
    self.lastName = lastName
    self.jobs = jobs
    self.customer = customer
    self.check = check
    self.doubled = doubled
    self.worker_id =  worker_id
    self.workerEmail = workerEmail
    self.subMission = subMission
    self.image1 = image1
    self.image2 = image2
    self.image3 = image3
    self.branchID = branchID


# Jobs schema:
class JobsSchema(ma.Schema):
  class Meta:
    fields = ('id', 'date', 'firstName', 'lastName', 'jobs', 'customer', 'check', 'doubled', 'worker_id', 'subMission', 'image1', 'image2', 'image3', 'branchID', 'workerEmail')

job_schema =  JobsSchema()
jobs_schema = JobsSchema(many=True)








# Service table:
class Service(db.Model):
  id = db.Column(db.Integer, primary_key=True)

  service = db.Column(db.String(1000000), nullable=False)
  price = db.Column(db.Float, nullable=False)
  serviceType = db.Column(db.String(3000), nullable=False)
  percentage = db.Column(db.Float, nullable=False)
  branchID = db.Column(db.Integer)




def __init__(self, service, price, serviceType, percentage, branchID):
  self.service= service
  self.price = price
  self.serviceType = serviceType
  self.percentage = percentage
  self.branchID = branchID



# Service schema:
class ServiceSchema(ma.Schema):
  class Meta:
    fields = ('id', 'service', 'price', 'serviceType', 'percentage', 'branchID')

service_schema =  ServiceSchema()
services_schema = ServiceSchema(many=True)






# Customers Model:
class Customers(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.Date)
  name = db.Column(db.String(1000), nullable=False)
  licensePlate = db.Column(db.String(100), nullable=False)
  carBrand = db.Column(db.String(1000), nullable=False)
  carModel = db.Column(db.String(1000), nullable=False)
  service = db.Column(db.String(5000))
  price = db.Column(db.Float, nullable=False)
  image1 = db.Column(db.String(1000000), nullable=False)
  image2 = db.Column(db.String(1000000))
  image3 = db.Column(db.String(1000000))
  branchID = db.Column(db.Integer)




def __init__(self, date, name, licensePlate, carBrand, carModel, service, price, image1, image2, image3, branchID):
    self.date = date
    self.name = name
    self.licensePlate = licensePlate
    self.carBrand = carBrand
    self.carModel = carModel
    self.service = service
    self.price = price
    self.image1 = image1
    self.image2 = image2
    self.image3 = image3
    self.branchID = branchID






# Customers schema:
class CustomersSchema(ma.Schema):
  class Meta:
    fields = ('id', 'date', 'name', 'licensePlate', 'carBrand', 'carModel', 'service', 'price', 'image1', 'image2', 'image3', 'branchID')

customer_schema =  CustomersSchema()
customers_schema = CustomersSchema(many=True)






# Define the Branch model
class Branch(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(5000), nullable=False)
  location = db.Column(db.String(5000), nullable=False)


def __init__(self, name, location):
    self.name = name
    self.location = location




# Branch schema:
class BranchSchema(ma.Schema):
  class Meta:
    fields = ('id', 'name', 'location')

branch_schema =  BranchSchema()
branches_schema = BranchSchema(many=True)





# Define the Mail model
class Mail(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  count = db.Column(db.Integer)



def __init__(self, count):
  self.count = count





# Mail schema:
class MailSchema(ma.Schema):
  class Meta:
    fields = ('id', 'count')

mail_schema =  MailSchema()
mails_schema = MailSchema(many=True)



@app.before_request
def before_request():

  g.id = None

  if "user_id" in session:
    g.id = session["user_id"]






# Function to backup the database
@app.route('/download_all_data', methods=['GET'])
def download_all_data():
    output = StringIO()
    writer = csv.writer(output)

    # Write data from Members table
    writer.writerow(["Members Data"])
    writer.writerow(["id", "firstName", "lastName", "email", "birthDate", "age", "phone", "access", "password", "branchID", "status"])
    for member in Members.query.all():
        writer.writerow([member.id, member.firstName, member.lastName, member.email, member.birthDate, member.age, member.phone, member.access, member.password, member.branchID, member.status])

    writer.writerow([])  # Empty row to separate tables

    # Write data from Orders table
    writer.writerow(["Orders Data"])
    writer.writerow(["id", "date", "licensePlate", "carBrand", "carModel", "customer", "service", "price", "W1", "W2", "W3", "notes", "branchID"])
    for order in Orders.query.all():
        writer.writerow([order.id, order.date, order.licensePlate, order.carBrand, order.carModel, order.customer, order.service, order.price, order.W1, order.W2, order.W3, order.notes, order.branchID])

    writer.writerow([])  # Empty row to separate tables

    # Write data from Workers table
    writer.writerow(["Workers Data"])
    writer.writerow(["id", "firstName", "lastName", "email", "phone", "access", "password", "branchID", "status"])
    for worker in Workers.query.all():
        writer.writerow([worker.id, worker.firstName, worker.lastName, worker.email, worker.phone, worker.access, worker.password, worker.branchID, worker.status])

    writer.writerow([])  # Empty row to separate tables

    # Write data from Jobs table
    writer.writerow(["Jobs Data"])
    writer.writerow(["id", "date", "firstName", "lastName", "jobs", "customer", "check", "doubled", "worker_id", "subMission", "image1", "image2", "image3", "branchID", "workerEmail"])
    for job in Jobs.query.all():
        writer.writerow([job.id, job.date, job.firstName, job.lastName, job.jobs, job.customer, job.check, job.doubled, job.worker_id, job.subMission, job.image1, job.image2, job.image3, job.branchID, job.workerEmail])

    writer.writerow([])  # Empty row to separate tables

    # Write data from Service table
    writer.writerow(["Service Data"])
    writer.writerow(["id", "service", "price", "serviceType", "percentage", "branchID"])
    for service in Service.query.all():
        writer.writerow([service.id, service.service, service.price, service.serviceType, service.percentage, service.branchID])

    writer.writerow([])  # Empty row to separate tables

    # Write data from Customers table
    writer.writerow(["Customers Data"])
    writer.writerow(["id", "date", "name", "licensePlate", "carBrand", "carModel", "service", "price", "image1", "image2", "image3", "branchID"])
    for customer in Customers.query.all():
        writer.writerow([customer.id, customer.date, customer.name, customer.licensePlate, customer.carBrand, customer.carModel, customer.service, customer.price, customer.image1, customer.image2, customer.image3, customer.branchID])

    writer.writerow([])  # Empty row to separate tables

    # Write data from Branch table
    writer.writerow(["Branch Data"])
    writer.writerow(["id", "name", "location"])
    for branch in Branch.query.all():
        writer.writerow([branch.id, branch.name, branch.location])

    output.seek(0)  # Move cursor to start of StringIO

    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=all_data.csv"}
    )



# Get Mail count api route:
@app.route("/api/mail/get/<id>/" , methods=["GET"])
def GetMail(id):

  # get a mail:
  mail = Mail.query.get(id)
  results = mail_schema.dump(mail)
  return jsonify(results)


# Function to send email with orders data (monthly)
def send_monthly_email(app):
    with app.app_context():

        Email = Mail.query.get(1)
        if Email:
          Email.count += 1
        else:
          newMail = Mail(count=1)
          db.session.add(newMail)
        db.session.commit()
        # Calculate start and end dates of last month
        current_date = datetime.now()
        last_month_start = current_date.replace(month=current_date.month - 1)
        last_month_end = current_date

        # Query orders for last month
        orders = Orders.query.filter(Orders.date >= last_month_start, Orders.date <= last_month_end).all()

        email_content = f"Orders for {last_month_start.strftime('%B %Y')}:\n"
        for order in orders:
          branchName = Branch.query.filter_by(id=order.branchID).first().name
          email_content += f"Order ID: {order.id}, Date: {order.date}, Customer: {order.customer}, Price: {order.price}, Branch: {branchName}\n"

        msg = Message('Monthly Orders Report', sender="noreply@demo.com", recipients=[app.config['MAIL_USERNAME']])
        msg.body = email_content
        mail.send(msg)

# Function to handle daily notifications based on frontend actions
@app.route('/notify_frontend_action', methods=['POST'])
def notify_frontend_action():
    Email = Mail.query.get(1)
    if Email is not None:
      Email.count += 1
    else:
      newMail = Mail(count=1)
      db.session.add(newMail)
    db.session.commit()

    data = request.json
    action = data.get('action')
    # Get Order data from frontend
    orderID = data.get('id')
    date = data.get('date')
    customer = data.get('customer')
    service = data.get('service')
    price = data.get('price')
    auth = data.get('auth')
    access = data.get('Access')
    branchName = data.get('branchName')
    licensePlate = data.get('licensePlate')
    carBrand = data.get('carBrand')
    carModel = data.get('carModel')
    notes = data.get('notes')
    W1 = data.get('W1')
    W2 = data.get('W2')
    W3 = data.get('W3')



    newWorkerName1 = ''
    if 'W1' in data:
      worker = Workers.query.filter_by(id=W1).first()
      if worker is not None:
        newWorkerFirstName1 = worker.firstName
        newWorkerLastName1 = worker.lastName
        newWorkerName1 = f"{newWorkerFirstName1} {newWorkerLastName1}"
      else:
        # Handle the case where the worker with ID 'W3' is not found
        newWorkerName1 = '---'

    newWorkerName2 = ''
    if 'W2' in data:
      worker = Workers.query.filter_by(id=W2).first()
      if worker is not None:
        newWorkerFirstName2 = worker.firstName
        newWorkerLastName2 = worker.lastName
        newWorkerName2 = f"{newWorkerFirstName2} {newWorkerLastName2}"
      else:
        # Handle the case where the worker with ID 'W3' is not found
        newWorkerName2 = '---'

    newWorkerName3 = ''
    if 'W3' in data:
      worker = Workers.query.filter_by(id=W3).first()
      if worker is not None:
        newWorkerFirstName3 = worker.firstName
        newWorkerLastName3 = worker.lastName
        newWorkerName3 = f"{newWorkerFirstName3} {newWorkerLastName3}"
      else:
        # Handle the case where the worker with ID 'W3' is not found
        newWorkerName3 = '---'

    oldDate = data.get('oldDate')
    oldCustomer = data.get('oldCustomer')
    oldService = data.get('oldService')
    oldPrice = data.get('oldPrice')
    oldNotes = data.get('oldNotes')
    oldLicensePlate = data.get('oldLicensePlate')
    oldCarBrand = data.get('oldCarBrand')
    oldCarModel = data.get('oldCarModel')
    oldW1 = data.get('oldW1')
    oldW2 = data.get('oldW2')
    oldW3 = data.get('oldW3')


    oldWorkerName1 = ''
    if 'oldW1' in data:
      worker = Workers.query.filter_by(id=oldW1).first()
      if worker is not None:
        oldWorkerFirstName1 = worker.firstName
        oldWorkerLastName1 = worker.lastName
        oldWorkerName1 = f"{oldWorkerFirstName1} {oldWorkerLastName1}"
      else:
        # Handle the case where the worker with ID 'W3' is not found
        oldWorkerName1 = '---'

    oldWorkerName2 = ''
    if 'oldW2' in data:
      worker = Workers.query.filter_by(id=oldW2).first()
      if worker is not None:
        oldWorkerFirstName2 = worker.firstName
        oldWorkerLastName2 = worker.lastName
        oldWorkerName2 = f"{oldWorkerFirstName2} {oldWorkerLastName2}"
      else:
        # Handle the case where the worker with ID 'W3' is not found
        oldWorkerName2 = '---'

    oldWorkerName3 = ''
    if 'oldW3' in data:
      worker = Workers.query.filter_by(id=oldW3).first()
      if worker is not None:
        oldWorkerFirstName3 = worker.firstName
        oldWorkerLastName3 = worker.lastName
        oldWorkerName3 = f"{oldWorkerFirstName3} {oldWorkerLastName3}"
      else:
        # Handle the case where the worker with ID 'W3' is not found
        oldWorkerName3 = '---'



    # Get Services data from frontend.
    serviceID = data.get('serviceID')
    updatedService = data.get('updatedService')
    updatedPrice = data.get('updatedPrice')
    updatedServiceType = data.get('updatedServiceType')
    updatedPercentage = data.get('updatedPercentage')

    oldServicesService = data.get('oldServicesService')
    oldServicesPrice = data.get('oldServicesPrice')
    oldServiceType = data.get('oldServiceType')
    oldPercentage = data.get('oldPercentage')

    # Get Member data from frontend:
    fn = data.get('fn')
    ln = data.get('ln')
    email = data.get('email')
    access = data.get('access')

    memberID = data.get('memberID')
    updatedFirstName = data.get('updatedFirstName')
    updatedLastName = data.get('updatedLastName')
    updatedEmail = data.get('updatedEmail')
    updatedAccess = data.get('updatedAccess')
    updatedAge = data.get('updatedAge')
    updatedPhone = data.get('updatedPhone')
    updatedBranch = data.get('updatedBranch')

    firstNameToUpdate = data.get('firstNameToUpdate')
    lastNameToUpdate = data.get('lastNameToUpdate')
    emailToUpdate = data.get('emailToUpdate')
    ageToUpdate = data.get('ageToUpdate')
    phoneToUpdate = data.get('phoneToUpdate')
    accessToUpdate = data.get('accessToUpdate')
    branchToUpdate = data.get('branchToUpdate')


    # Get the job data from frontend:
    jobID = data.get('jobID')
    updatedCheck = data.get('updatedCheck')
    updatedSubMission = data.get('updatedSubMission')
    workerID = data.get('workerID')

    jobCustomer = ''
    if 'jobID' in data:
      job = Jobs.query.filter_by(id=jobID).first()
      if job is not None:
        jobCustomer = job.customer
      else:
        jobCustomer = '---'

    jobMainService = ''
    if 'jobID' in data:
      job = Jobs.query.filter_by(id=jobID).first()
      if job is not None:
        jobMainService = job.jobs
      else:
        jobMainService = '---'



    checkedWorkerName = ''
    if 'workerID' in data:
      worker = Workers.query.filter_by(id=workerID).first()
      if worker is not None:
        checkedWorkerFirstName = worker.firstName
        checkedWorkerLastName = worker.lastName
        checkedWorkerName = f"{checkedWorkerFirstName} {checkedWorkerLastName}"
      else:
        # Handle the case where the worker with ID 'W3' is not found
        checkedWorkerName = '---'

    # Perform specific actions based on frontend action
    if action == 'new_order':
        content = f"New order added by: {auth}!\n Order ID: {orderID}, Date: {date}, Customer: {customer}, License plate: {licensePlate}, Car brand: {carBrand}, Car model: {carModel}, Worker 1: {newWorkerName1}, Worker 2: {newWorkerName2}, Worker 3: {newWorkerName3}, Service: {service}, Price: {price}, Notes: {notes}, Branch: {branchName}"
        send_notification(content)
    elif action == 'updated_order':
        content = f"An Order Updated by: {auth}!\nFrom:\nOrder ID: {orderID}, Date: {oldDate}, Customer: {oldCustomer}, License plate: {oldLicensePlate}, Car brand: {oldCarBrand}, Car model: {oldCarModel}, Worker 1: {oldWorkerName1}, Worker 2: {oldWorkerName2}, Worker 3: {oldWorkerName3}, Service: {oldService}, Price: {oldPrice}, Notes: {oldNotes}, Branch: {branchName}\nTo:\nOrder ID: {orderID}, Date: {date}, Customer: {customer}, License plate: {licensePlate}, Car brand: {carBrand}, Car model: {carModel}, Worker 1: {newWorkerName1}, Worker 2: {newWorkerName2}, Worker 3: {newWorkerName3}, Service: {service}, Price: {price}, Notes: {notes}, Branch: {branchName}"
        send_notification(content)
    elif action == 'deleted_order':
        content = f"An Order Deleted by: {auth}!\nOrder ID: {orderID}, Date: {oldDate}, Customer: {oldCustomer}, License plate: {oldLicensePlate}, Car brand: {oldCarBrand}, Car model: {oldCarModel}, Worker 1: {oldWorkerName1}, Worker 2: {oldWorkerName2}, Worker 3: {oldWorkerName3}, Service: {oldService}, Price: {oldPrice}, Notes: {oldNotes}, Branch: {branchName}"
        send_notification(content)
    elif action == 'updated_service':
        content = f"A Service Updated by: {auth}!\nFrom:\nService ID: {serviceID}, Service: {oldServicesService}, Price: {oldServicesPrice}, Service type: {oldServiceType}, Percentage: {oldPercentage}, Branch: {branchName}\nTo:\nService ID: {serviceID}, Service: {updatedService}, Price: {updatedPrice}, Service type: {updatedServiceType}, Percentage: {updatedPercentage}, Branch: {branchName}"
        send_notification(content)
    elif action == 'deleted_service':
        content = f"A Service Deleted by: {auth}!\nService ID: {serviceID}, Service: {oldServicesService}, Price: {oldServicesPrice}, Service type: {oldServiceType}, Percentage: {oldPercentage}, Branch: {branchName}"
        send_notification(content)
    elif action == 'new_user':
        content = f"New Member created!\n First name: {fn}, Last name: {ln}, Email: {email}, Access: {access}"
        send_notification(content)
    elif action == 'updated_member':
        content = f"A Member Updated by: {auth}!\nFrom:\nMember ID: {memberID}, First name: {firstNameToUpdate}, Last name: {lastNameToUpdate}, Email: {emailToUpdate}, Age: {ageToUpdate}, Phone: {phoneToUpdate}, Access: {accessToUpdate}, Branch: {branchToUpdate}\nTo:\nMember ID: {memberID}, First name: {updatedFirstName}, Last name: {updatedLastName}, Email: {updatedEmail}, Age: {updatedAge}, Phone: {updatedPhone}, Access: {updatedAccess}, Branch: {updatedBranch}"
        send_notification(content)
    elif action == 'deleted_member':
        content = f"A Member Deleted by: {auth}!\nMember ID: {memberID}, First name: {firstNameToUpdate}, Last name: {lastNameToUpdate}, Email: {emailToUpdate}, Age: {ageToUpdate}, Phone: {phoneToUpdate}, Access: {accessToUpdate}, Branch: {branchToUpdate}"
        send_notification(content)
    elif action == 'job_check':
        content = f"New job status!\n{checkedWorkerName} checked with: {updatedCheck} for completing: {updatedSubMission}\n Job ID: {jobID}, Job is done: {updatedCheck}, Customer: {jobCustomer}, Main service: {jobMainService}, Sub-Mission: {updatedSubMission}"
        send_notification(content)
    # Add more conditions for other actions

    return 'Notification sent!'

# Function to send notification email
def send_notification(message):
    msg = Message('Daily Notification', sender="noreply@demo.com", reply_to="Dashboard@gmail.com", recipients=[app.config['MAIL_USERNAME']])
    msg.body = message
    mail.send(msg)

# Schedule monthly email
scheduler.add_job(send_monthly_email, args=[app], trigger=CronTrigger(day='17', hour='9', minute='18'))





def generate_jwt_token(access_token, user_info, access):
    secret_key = 'SeCrEt91#0@1/'
    payload = {
        'access_token': access_token,
        'email': user_info.get('email'),
        'access': access,

    }
    jwt_token = jwt.encode(payload, secret_key, algorithm='HS256')
    return jwt_token

@app.route('/google_login', methods=["POST"])
def google_login():
    access_token = request.json.get('access_token')
    user_info = request.json.get('user_info')
    data = request.get_json()
    birthDate = datetime.strptime('2024-1-1', '%Y-%m-%d').date()

    # Check if user already exists in the Members table
    user = Members.query.filter_by(email=user_info.get('email')).first()

    if user is None:
        # Create a new user if they don't exist
        new_user = Members(
            firstName=user_info.get('givenName'),
            lastName=user_info.get('familyName'),
            email=user_info.get('email'),
            access='No Access',
            password='google-auth',
            status='Logged Out',
            branchID=1,
            birthDate=birthDate,
            age=28,
            phone='---'
        )

        db.session.add(new_user)
        db.session.commit()

        # Generate JWT token and return user info
        jwt_token = generate_jwt_token(access_token, user_info, 'No Access')
        response_data = {
            'access_token': jwt_token,
            'user_info': user_info,
            'access': 'No Access',
            'status': 'Not Existed'

        }

    else:
        session["user_id"] = user.id
        user.status = "Logged In"
        db.session.commit()

        # Generate JWT token and return user info
        jwt_token = generate_jwt_token(access_token, user_info, user.access)
        response_data = {
            'access_token': jwt_token,
            'user_info': user_info,
            'access': user.access,
            'status': 'Existed',

        }

    return member_schema.jsonify(response_data)







#==============================================================================================================:
# ===================================> Members API Management Routes <===========================================:
#==============================================================================================================:

#                                   Get all Members from database API:

@app.route("/api/get" , methods=["GET"])
def members():

  # get all users
  all_members = Members.query.order_by(Members.id).all()
  results = members_schema.dump(all_members)
  return jsonify(results)


@app.route("/api/member/get/<id>/" , methods=["GET"])
def member(id):

  # get a member:
  member = Members.query.get(id)
  results = member_schema.dump(member)
  return jsonify(results)




# =============================================================================================================

#                         Create a new Member in the database through an API route:

@app.route('/api/signUp' , methods=['POST'])
def add_member():
  data = request.get_json()
  firstName = data.get('firstname')
  lastName = data.get("lastname")
  email = data.get('email')
  birthDate = datetime.strptime(data.get('birthdate'), '%Y-%m-%d').date()
  current_date = datetime.now().date()
  age =  current_date.year - birthDate.year
  phone = data.get('phone')
  access = data.get('access')
  password = data.get('password')
  branchID = data.get('branchID')



  existed_user = Members.query.filter_by(email=email).first()

  if existed_user :
    return jsonify({ "message": "User with this username already exists!"}), 409

  hashed_password = bcrypt.generate_password_hash(password)

  new_user = Members(firstName=firstName, lastName=lastName, email=email, birthDate=birthDate, age=age, phone=phone, access=access, password=hashed_password, branchID=branchID, status="Logged Out")
  db.session.add(new_user)
  db.session.commit()

  return member_schema.jsonify(new_user)


#==============================================================================================================

#                                           login API route:

@app.route('/api/login' , methods=['POST', 'GET'])
def login():
  email = None
  if 'email' in request.json:
    email = request.json['email']

  password = None
  if 'password' in request.json:
    password = request.json['password']

  logOutEmail = None
  if 'emailState' in request.json:
    logOutEmail = request.json['emailState']

  our_member = None
  if logOutEmail == None:
    our_member = Members.query.filter_by(email=email).first()
  if logOutEmail != None:
    our_member = Members.query.filter_by(email=logOutEmail).first()


  if our_member is None:
    return jsonify({"message": "invalid Email or Password"}), 404

  if password != None:
    if not bcrypt.check_password_hash(our_member.password, password):
      return jsonify({"message": "invalid Email or Password"}), 401

  if logOutEmail == None:
    session["user_id"] = our_member.id
    print(session["user_id"])

  if email != None:
    our_member.status = "Logged In"
  if logOutEmail != None:
    our_member.status = "Logged Out"

  db.session.commit()
  if g.id:
    return jsonify({"session": session["user_id"]})
  return member_schema.jsonify(our_member)


# Singing out API Route:
@app.route('/api/signout', methods=['POST'])
def sign_out():
    session.clear()
    return jsonify({"message": "You have been signed out."}), 200


# ==============================================================================================================

#                               Updating a Member (PUT Request) API route:

@app.route('/api/update/<id>/' , methods=['PUT'])
def update_member(id):
  member_to_update = Members.query.get(id)

  data = request.get_json()
  firstName = data.get('updatedFirstName')
  lastName = data.get('updatedLastName')
  email = data.get('updatedEmail')
  age = data.get('updatedAge')
  phone = data.get("updatedPhone")
  access = data.get('updatedAccess')
  branchID = data.get('updatedBranch')
  for key in data.keys():
    if key not in ["updatedFirstName", 'updatedLastName', 'updatedEmail', 'updatedAge','updatedPhone', 'updatedAccess', 'updatedBranch']:
      return jsonify({"error":f"The field {key} does not exist."}), 400
     # The line above checks to see if the keys from the JSON input match up with the ones we are looking for. If they don't

  # Checks to see if the fields are empty and returns an error message if they are.
  missing_fields = []
  if not firstName:
    missing_fields.append("updatedFirstName")
  if not lastName:
    missing_fields.append("updatedLastName")
  if not  email:
    missing_fields.append("updatedEmail")
  if not age:
    missing_fields.append("updatedAge")
  if not phone:
    missing_fields.append("updatedPhone")
  if not access:
    missing_fields.append("updatedAccess")


  if missing_fields:
    return jsonify({"error": f"Missing {', '.join(missing_fields)} from submitted data."}), 400

  # If there is no user with that id, it sends back a error message saying "User Not Found".
  if not member_to_update:
    return jsonify({"error": "User Not Found"}), 404

  # Updates the information of the  user who matches the ID in the URL parameter.
  member_to_update.firstName = firstName
  member_to_update.lastName = lastName
  member_to_update.email = email
  member_to_update.age = age
  member_to_update.phone = phone
  member_to_update.access = access
  member_to_update.branchID = branchID

  # Saves the changes to the database.
  db.session.commit()

  return  member_schema.jsonify(member_to_update)



# ==============================================================================================================

#                              Deleting a Member (DELETE Request) API route:

@app.route('/api/delete/<id>/' , methods=['DELETE'])
def delete_member(id):
  member_to_delete = Members.query.get(id)

  db.session.delete(member_to_delete)
  db.session.commit()

  return member_schema.jsonify(member_to_delete)




















#==============================================================================================================:
# ===================================> Workers API Management Routes <===========================================:
#==============================================================================================================:

#                                   Get all Workers from database API:

@app.route("/api/workers/get" , methods=["GET"])
def workers():

  # get all users
  all_workers = Workers.query.order_by(Workers.id).all()
  results = workers_schema.dump(all_workers)
  return jsonify(results)




@app.route("/api/worker/get/<id>/" , methods=["GET"])
def worker(id):

  # get a worker:
  worker = Workers.query.get(id)
  results = worker_schema.dump(worker)
  return jsonify(results)


# =============================================================================================================

#                         Create a new Worker in the database through an API route:

@app.route('/api/workers/signUp' , methods=['POST'])
def add_worker():
  data = request.get_json()
  firstName = data.get('firstname')
  lastName = data.get("lastname")
  email = data.get('email')
  phone = data.get('phone')
  access = "Worker"
  password = data.get('password')
  branchID = data.get('branchID')



  existed_worker = Workers.query.filter_by(email=email).first()
  if existed_worker and existed_worker.branchID != branchID :
    new_worker = Workers(firstName=firstName, lastName=lastName, email=email, phone=phone, access=access, password=existed_worker.password, branchID=branchID, status="Logged Out")
    db.session.add(new_worker)
    db.session.commit()

  elif existed_worker and existed_worker.branchID == branchID :
    return jsonify({ "message": "Worker with this Email already exists!"}), 409

  else:
    hashed_password = bcrypt.generate_password_hash(password)
    new_worker = Workers(firstName=firstName, lastName=lastName, email=email, phone=phone, access=access, password=hashed_password, branchID=branchID, status="Logged Out")
    db.session.add(new_worker)
    db.session.commit()

  # session["user_id"] = new_worker.id

  return worker_schema.jsonify(new_worker)


#==============================================================================================================

#                                          Workers login API route:

@app.route('/api/workers/login' , methods=['POST'])
def worker_login():
  email = None
  if 'Wemail' in request.json:
    email = request.json['Wemail']

  password = None
  if 'Wpassword' in request.json:
    password = request.json['Wpassword']






  logOutEmail = None
  if 'emailState' in request.json:
    logOutEmail = request.json['emailState']

  our_worker = None
  if logOutEmail == None:
    our_worker = Workers.query.filter_by(email=email).first()
  if logOutEmail != None:
    our_worker = Workers.query.filter_by(email=logOutEmail).first()

  if our_worker is None:
    return jsonify({"message": "invalid Email or Password"}), 404

  if password != None:
    if not bcrypt.check_password_hash(our_worker.password, password):
      return jsonify({"message": "invalid Email or Password"}), 401





  if logOutEmail == None:
    session["user_id"] = our_worker.id
    print(session["user_id"])

  if email != None:
    our_worker.status = "Logged In"
  if logOutEmail != None:
    our_worker.status = "Logged Out"

  db.session.commit()
  if g.id:
    return jsonify({"session": session["user_id"]})
  return worker_schema.jsonify(our_worker)


# Singing out API Route:
# Existed Up there ^

# ==============================================================================================================

#                               Updating a Worker (PUT Request) API route:

@app.route('/api/workers/update/<id>/' , methods=['PUT'])
def update_worker(id):
  worker_to_update = Workers.query.get(id)
  old_worker_data = Workers.query.get(id)

  data = request.get_json()
  firstName = data.get('updatedFirstName')
  lastName = data.get('updatedLastName')
  email = data.get('updatedEmail')
  phone = data.get("updatedPhone")
  # jops = old_worker_data.jops
  #can't update check column so we just let it stay the same

  access = old_worker_data.access
  for key in data.keys():
    if key not in ["updatedFirstName", 'updatedLastName', 'updatedEmail', 'updatedPhone'] :
      return jsonify({"error":f"The field {key} does not exist."}), 400
     # The line above checks to see if the keys from the JSON input match up with the ones we are looking for. If they don't

  # Checks to see if the fields are empty and returns an error message if they are.
  missing_fields = []
  if not firstName:
    missing_fields.append("First Name")
  if not lastName:
    missing_fields.append("Last Name")
  if not  email:
    missing_fields.append("Email")
  if not phone:
    missing_fields.append("Phone")



  if missing_fields:
    return jsonify({"error": f"Missing {', '.join(missing_fields)} from submitted data."}), 400

  # If there is no user with that id, it sends back a error message saying "User Not Found".
  if not worker_to_update:
    return jsonify({"error": "User Not Found"}), 404

  # Updates the information of the  user who matches the ID in the URL parameter.
  worker_to_update.firstName = firstName
  worker_to_update.lastName = lastName
  worker_to_update.email = email
  worker_to_update.phone = phone
  # worker_to_update.jops = jops

  worker_to_update.access = access

  # Saves the changes to the database.
  db.session.commit()

  return  worker_schema.jsonify(worker_to_update)



# ==============================================================================================================

#                              Deleting a user (DELETE Request) API route:


@app.route('/api/workers/delete/<id>/' , methods=['DELETE'])
def delete_worker(id):
  worker_to_delete = Workers.query.get(id)

  db.session.delete(worker_to_delete)
  db.session.commit()

  return worker_schema.jsonify(worker_to_delete)





















#==============================================================================================================:
# ===================================> Orders API Management Routes <===========================================:
#==============================================================================================================:

#                                   Get all Orders from database API:

@app.route("/api/orders/get" , methods=["GET"])
def orders():

  # get all orders:
  all_orders = Orders.query.order_by(Orders.id).all()
  results = orders_schema.dump(all_orders)
  return jsonify(results)




@app.route("/api/order/get/<id>/" , methods=["GET"])
def order(id):

  # get one order:
  order = Orders.query.get(id)
  results = order_schema.dump(order)
  return jsonify(results)



# =============================================================================================================

#                         Add Orders in the database through an API route:

@app.route('/api/AddOrders' , methods=['POST'])
def add_orders():

  if 'file' in request.files:
    branchID = request.form['branchID']
    # Uploading a CSV file
    csv_file = request.files['file']

    # Wrap the file in a TextIOWrapper to ensure it's treated as text
    csv_data = csv.DictReader(TextIOWrapper(csv_file, 'utf-8'), delimiter=';')

    for row in csv_data:
      print(row)
      # Remove leading and trailing whitespace from column names
      row = {key.strip(): value for key, value in row.items()}

      if 'date' in row:
        date = datetime.strptime(row['date'], '%d/%m/%Y').date()
      else:
          # Handle missing 'date' column in the CSV file
          date = None

      # Access other columns using stripped keys
      licensePlate = row['licensePlate']
      carBrand = row['carBrand']
      carModel = row['carModel']
      customer = row['customer']
      service = row['service']
      price = float(row['price'])
      W1 = row['W1']
      W2 = row['W2']
      W3 = row['W3']
      notes = row['notes']

      worker1Email = Workers.query.filter_by(id=W1).first().email if W1 else ''
      worker2Email = Workers.query.filter_by(id=W2).first().email if W2 else ''
      worker3Email = Workers.query.filter_by(id=W3).first().email if W3 else ''


      firstName1 = Workers.query.filter_by(id=W1).first().firstName if W1 else ''
      lastName1 = Workers.query.filter_by(id=W1).first().lastName if W1 else ''
      firstName2 = Workers.query.filter_by(id=W2).first().firstName if W2 else ''
      lastName2 = Workers.query.filter_by(id=W2).first().lastName if W2 else ''
      firstName3 = Workers.query.filter_by(id=W3).first().firstName if W3 else ''
      lastName3 = Workers.query.filter_by(id=W3).first().lastName if W3 else ''

      existing_w1 = Jobs.query.filter_by(worker_id=W1).first()
      existing_w2 = Jobs.query.filter_by(worker_id=W2).first()
      existing_w3 = Jobs.query.filter_by(worker_id=W3).first()

      if firstName1 and lastName1 :
        if existing_w1:
          job = Jobs(date=date, jobs=service, firstName=firstName1, lastName=lastName1, check='No', doubled=1, worker_id=W1, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker1Email)
          db.session.add(job)
          db.session.commit()
        else:
          job = Jobs(date=date, jobs=service, firstName=firstName1, lastName=lastName1, check='No', doubled=0, worker_id=W1, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker1Email)
          db.session.add(job)
          db.session.commit()


      if firstName2 and lastName2 :
        if existing_w2:
          job = Jobs(date= date, jobs=service, firstName=firstName2, lastName=lastName2, check='No', doubled=1, worker_id=W2, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker2Email)
          db.session.add(job)
          db.session.commit()
        else:
          job = Jobs(date= date, jobs=service, firstName=firstName2, lastName=lastName2, check='No', doubled=0, worker_id=W2, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker2Email)
          db.session.add(job)
          db.session.commit()

      if firstName3 and lastName3 :
        if existing_w3:
          job = Jobs(date= date, jobs=service, firstName=firstName3, lastName=lastName3, check='No', doubled=1, worker_id=W3, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker3Email)
          db.session.add(job)
          db.session.commit()
        else:
          job = Jobs(date= date, jobs=service, firstName=firstName3, lastName=lastName3, check='No', doubled=0, worker_id=W3, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker3Email)
          db.session.add(job)
          db.session.commit()

        # we need to check that there is no service with this name and branchID :
      existing_service = Service.query.filter_by(service=service, branchID=branchID).first()

      if not existing_service:

        newServiceRow = Service(service=service, serviceType='Percentage %', price=price, percentage=40, branchID=branchID)
        db.session.add(newServiceRow)
        db.session.commit()



      new_order = Orders(date=date, licensePlate=licensePlate, carBrand=carBrand, carModel=carModel, customer=customer, price=price, service=service, W1=W1, W2=W2, W3=W3, notes=notes, branchID=branchID)
      db.session.add(new_order)
      db.session.commit()
      # Your existing logic to process the data goes here

    return jsonify({"message": "Data successfully processed from CSV file"})
  else:

    data = request.get_json()
    date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()
    licensePlate = data.get('licensePlate')
    carBrand = data.get("carBrand")
    carModel = data.get('carModel')
    customer = data.get('customer')
    service = data.get('service')
    fixedCommission = data.get('fixedCommission')
    price = data.get('price')
    W1 = data.get('W1')
    W2 = data.get('W2')
    W3 = data.get('W3')
    notes = data.get('notes')
    branchID = data.get('branchID')

    worker1Email = Workers.query.filter_by(id=W1).first().email if W1 else ''
    worker2Email = Workers.query.filter_by(id=W2).first().email if W2 else ''
    worker3Email = Workers.query.filter_by(id=W3).first().email if W3 else ''


    firstName1 = data.get('firstName1')
    lastName1 = data.get('lastName1')
    firstName2 = data.get('firstName2')
    lastName2 = data.get('lastName2')
    firstName3 = data.get('firstName3')
    lastName3 = data.get('lastName3')
    doubled = False
    new_order = Orders(date=date, licensePlate=licensePlate, carBrand=carBrand, carModel=carModel, customer=customer, price=price, service=service, W1=W1, W2=W2, W3=W3, notes=notes, branchID=branchID)
    db.session.add(new_order)
    db.session.commit()
    # Get latest worker ID
    max_id = db.session.query(func.max(Jobs.worker_id)).scalar()

    # Check if W1 exists
    existing_w1 = Jobs.query.filter_by(worker_id=W1).first()
    if existing_w1:
      newW1 = max_id + 1
      doubled = True

    # Check if W2 exists
    existing_w2 = Jobs.query.filter_by(worker_id=W2).first()
    if existing_w2:
      newW2 = max_id + 1
      doubled = True

    # Check if W3 exists
    existing_w3 = Jobs.query.filter_by(worker_id=W3).first()
    if existing_w3:
      newW3 = max_id + 1
      doubled = True

    if firstName1 and lastName1 :
      if existing_w1:
        job = Jobs(date=date, jobs=service, firstName=firstName1, lastName=lastName1, check='No', doubled=doubled, worker_id=W1, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker1Email)
        db.session.add(job)
        db.session.commit()
      else:
        job = Jobs(date=date, jobs=service, firstName=firstName1, lastName=lastName1, check='No', doubled=doubled, worker_id=W1, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker1Email)
        db.session.add(job)
        db.session.commit()


    if firstName2 and lastName2 :
      if existing_w2:
        job = Jobs(date= date, jobs=service, firstName=firstName2, lastName=lastName2, check='No', doubled=doubled, worker_id=W2, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker2Email)
        db.session.add(job)
        db.session.commit()
      else:
        job = Jobs(date= date, jobs=service, firstName=firstName2, lastName=lastName2, check='No', doubled=doubled, worker_id=W2, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker2Email)
        db.session.add(job)
        db.session.commit()

    if firstName3 and lastName3 :
      if existing_w3:
        job = Jobs(date= date, jobs=service, firstName=firstName3, lastName=lastName3, check='No', doubled=doubled, worker_id=W3, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker3Email)
        db.session.add(job)
        db.session.commit()
      else:
        job = Jobs(date= date, jobs=service, firstName=firstName3, lastName=lastName3, check='No', doubled=doubled, worker_id=W3, subMission='', image1='', image2='', image3='', customer=customer, branchID=branchID, workerEmail=worker3Email)
        db.session.add(job)
        db.session.commit()

    # we need to check that there is no service with this name and branchID :
    existing_service = Service.query.filter_by(service=service, branchID=branchID).first()

    if not existing_service:
      if fixedCommission:
          newServiceRow = Service(service=service, serviceType="Fixed", price=price, percentage=fixedCommission, branchID=branchID)
          db.session.add(newServiceRow)
          db.session.commit()
      else:
          newServiceRow = Service(service=service, serviceType='Percentage %', price=price, percentage=40, branchID=branchID)
          db.session.add(newServiceRow)
          db.session.commit()










    # Checks to see if the fields are empty and returns an error message if they are.
    missing_fields = []
    if not date:
      missing_fields.append("Date")
    if not licensePlate:
      missing_fields.append("License Plate")
    if not carBrand:
      missing_fields.append("Car Brand")
    if not carModel:
      missing_fields.append("Car Model")
    if not customer:
      missing_fields.append("Customer")
    if not service:
      missing_fields.append("Service")
    if not price:
      missing_fields.append("Price")



    if missing_fields:
      return jsonify({"error": f"Missing {', '.join(missing_fields)} from submitted data."}), 400





    return order_schema.jsonify(new_order)




# ==============================================================================================================

#                               Updating an Order (PUT Request) API route:

@app.route('/api/orders/update/<id>/' , methods=['PUT'])
def update_order(id):
  order_to_update = Orders.query.get(id)

  data = request.get_json()
  date_str = data.get('updatedDate')
  if date_str:
      try:
          date = datetime.strptime(date_str, '%Y-%m-%d').date()
      except ValueError:
          return jsonify({"error": "Invalid date format. Date should be in the format YYYY-MM-DD."}), 400
  else:
      return jsonify({"error": "Date field is missing in the request data."}), 400

  licensePlate = data.get('updatedLicensePlate')
  carBrand = data.get('updatedCarBrand')
  carModel = data.get('updatedCarModel')
  customer = data.get("updatedCustomer")
  service = data.get('updatedService')
  oldService = order_to_update.service
  oldDate = order_to_update.date
  price = data.get('updatedPrice')
  notes = data.get('updatedNotes')




  worker_ids = [data.get('W1'), data.get('W2'), data.get('W3')]


  worker_id1 = data.get('W1')
  worker_id2 = data.get('W2')
  worker_id3 = data.get('W3')

  newWorker1 = Workers.query.get(worker_id1)
  newWorker2 = Workers.query.get(worker_id2)
  newWorker3 = Workers.query.get(worker_id3)

  worker1Email = Workers.query.filter_by(id=worker_id1).first().email if worker_id1 else ''
  worker2Email = Workers.query.filter_by(id=worker_id2).first().email if worker_id2 else ''
  worker3Email = Workers.query.filter_by(id=worker_id3).first().email if worker_id3 else ''

  old_w1 = order_to_update.W1
  old_w2 = order_to_update.W2
  old_w3 = order_to_update.W3

  jobs_w1 = Jobs.query.filter(Jobs.worker_id == old_w1)
  jobs_w2 = Jobs.query.filter(Jobs.worker_id == old_w2)
  jobs_w3 = Jobs.query.filter(Jobs.worker_id == old_w3)

  # for job in jobs_w1:
  #   if job.jobs == oldService and job.date == oldDate:
  #     job.firsName = newWorker1.firstName
  #     job.lastName = newWorker1.lastName
  #     job.worker_id = worker_id1
  #     job.workerEmail = worker1Email
  #     job.date = date
  #     db.session.commit()

  # for job in jobs_w2:
  #   if job.jobs == oldService and job.date == oldDate:
  #     job.firsName = newWorker2.firstName
  #     job.lastName = newWorker2.lastName
  #     job.worker_id = worker_id2
  #     job.workerEmail = worker2Email
  #     job.date = date
  #     db.session.commit()

  # for job in jobs_w3:
  #   if job.jobs == oldService and job.date == oldDate:
  #     job.firsName = newWorker3.firstName
  #     job.lastName = newWorker3.lastName
  #     job.worker_id = worker_id3
  #     job.workerEmail = worker3Email
  #     job.date = date
  #     db.session.commit()


  # Handling updating jobs in the jobs table:
  # Get all jobs for the old service
  jobs = Jobs.query.filter(Jobs.jobs == oldService)
  # Update each job
  if jobs and jobs_w1 or jobs_w2 or jobs_w3:
    for job in jobs:
      job.jobs = service
      job.customer = customer
      job.date = date
      db.session.commit()


  service_to_update = Service.query.filter_by(service = oldService).first()
  if price and service_to_update:
    service_to_update.price = price
    db.session.commit()




  for key in data.keys():
    if key not in ["updatedDate",
                   'updatedLicensePlate',
                   'updatedCarBrand',
                   'updatedCarModel',
                   'updatedCustomer',
                   'updatedService',
                   'updatedPrice',
                   'W1',
                   'W2',
                   'W3',
                   'initialSelectedWorkers',
                   'updatedNotes',
                   ] :
      return jsonify({"error":f"The field {key} does not exist."}), 400
     # The line above checks to see if the keys from the JSON input match up with the ones we are looking for. If they don't

  # Checks to see if the fields are empty and returns an error message if they are.
  missing_fields = []
  if not date:
    missing_fields.append("Date")
  if not licensePlate:
    missing_fields.append("License Plate")
  if not carBrand:
    missing_fields.append("Car Brand")
  if not carModel:
    missing_fields.append("Car Model")
  if not customer:
    missing_fields.append("Customer")
  if not service:
    missing_fields.append("Service")
  if not price:
    missing_fields.append("Price")
  if not notes:
    missing_fields.append("Notes")


  if missing_fields:
    return jsonify({"error": f"Missing {', '.join(missing_fields)} from submitted data."}), 400

  # If there is no user with that id, it sends back a error message saying "User Not Found".
  if not order_to_update:
    return jsonify({"error": "User Not Found"}), 404

  # Updates the information of the  user who matches the ID in the URL parameter.
  order_to_update.date = date
  order_to_update.licensePlate = licensePlate
  order_to_update.carBrand = carBrand
  order_to_update.carModel = carModel
  order_to_update.customer = customer
  order_to_update.service = service
  order_to_update.price = price
  order_to_update.W1 = worker_ids[0]
  order_to_update.W2 = worker_ids[1]
  order_to_update.W3 = worker_ids[2]
  order_to_update.notes = notes

  # Saves the changes to the database.
  db.session.commit()

  return  order_schema.jsonify(order_to_update)



# ==============================================================================================================

#                              Deleting an Order (DELETE Request) API route:

@app.route('/api/order/delete/<id>/' , methods=['DELETE'])
def delete_order(id):
  order_to_delete = Orders.query.get(id)

  db.session.delete(order_to_delete)
  db.session.commit()

  return order_schema.jsonify(order_to_delete)









#==============================================================================================================:
# ===================================> Jobs API Management Routes <===========================================:
#==============================================================================================================:

#                                   Get all Workers from database API:

@app.route("/api/jobs/get" , methods=["GET"])
def jobs():

  # get all jobs
  all_jobs = Jobs.query.order_by(Jobs.id).all()
  results = jobs_schema.dump(all_jobs)
  return jsonify(results)



@app.route("/api/job/get/<id>/" , methods=["GET"])
def job(id):

  # get one job:
  job = Jobs.query.get(id)
  results = job_schema.dump(job)
  return jsonify(results)


# ==============================================================================================================

#                               Updating a Job (PUT Request) API route:

@app.route('/api/jobs/update/<id>/' , methods=['PUT'])
def update_job(id):
  job_to_update = Jobs.query.get(id)

  oldService = job_to_update.jobs
  oldCustomer = job_to_update.customer
  oldDate = job_to_update.date
  service = ''
  if 'updatedService' in request.form:
    service = request.form['updatedService']
  else:
    service = oldService

  customer = ''
  if 'updatedCustomer' in request.form:
    customer = request.form['updatedCustomer']
  else:
    customer = oldCustomer

  date_str = ''
  if 'updatedDate' in request.form:
      date_str = request.form['updatedDate']
  else:
      date_str = oldDate

  if date_str:
      try:
          if isinstance(date_str, Date):
              date_str = date_str.strftime('%Y-%m-%d')
          parsed_date = datetime.strptime(date_str, '%Y-%m-%d').date()
      except ValueError:
          return jsonify({"error": "Invalid date format. Date should be in the format YYYY-MM-DD."}), 400
  else:
      return jsonify({"error": "Date field is missing in the request data."}), 400


  worker_id1 = None
  newWorker1 = ''
  worker1Email = ''
  if 'updatedW1' in request.form:
    worker_id1 = request.form['updatedW1']
    newWorker1 = Workers.query.get(worker_id1)
    worker1Email = Workers.query.filter_by(id=worker_id1).first().email if worker_id1 else ''


  if worker_id1:
    job_to_update.firsName = newWorker1.firstName
    job_to_update.lastName = newWorker1.lastName
    job_to_update.worker_id = worker_id1
    job_to_update.workerEmail = worker1Email



  # if worker_id2:
  #   job_to_update.firsName = newWorker2.firstName
  #   job_to_update.lastName = newWorker2.lastName
  #   job_to_update.worker_id = worker_id2
  #   job_to_update.workerEmail = worker2Email

  # if worker_id3:
  #   job_to_update.firsName = newWorker3.firstName
  #   job_to_update.lastName = newWorker3.lastName
  #   job_to_update.worker_id = worker_id3
  #   job_to_update.workerEmail = worker3Email




  job_to_update.jobs = service
  job_to_update.customer = customer
  job_to_update.date = parsed_date





  check = request.form['updatedCheck']
  subMission = request.form['updatedSubMission']
  oldImage1 = job_to_update.image1
  oldImage2 = job_to_update.image2
  oldImage3 = job_to_update.image3

  image1 = None
  image2 = None
  image3 = None

  if 'updatedImage1' in request.files:
    image1 = request.files['updatedImage1']

  if 'updatedImage2' in request.files:
    image2 = request.files['updatedImage2']

  if 'updatedImage3' in request.files:
    image3 = request.files['updatedImage3']


  if image1 != None and allowed_image(image1.filename):
    filename1 = secure_filename(image1.filename)
    image1.save(os.path.join('client/public/images', filename1))

  if image2 != None and allowed_image(image2.filename):
    filename2 = secure_filename(image2.filename)
    image2.save(os.path.join('client/public/images', filename2))

  if image3 != None and allowed_image(image3.filename):
    filename3 = secure_filename(image3.filename)
    image3.save(os.path.join('client/public/images', filename3))




  # If there is no user with that id, it sends back a error message saying "User Not Found".
  if not job_to_update:
    return jsonify({"error": "User Not Found"}), 404


  job_to_update.check = check
  job_to_update.subMission = subMission


  if image1 != None:
    job_to_update.image1 = filename1
  else:
    job_to_update.image1 = oldImage1

  if image2 != None:
    job_to_update.image2 = filename2
  else:
    job_to_update.image2 = oldImage2

  if image3 != None:
    job_to_update.image3 = filename3
  else:
    job_to_update.image3 = oldImage3



  # Saves the changes to the database.
  db.session.commit()

  return  job_schema.jsonify(job_to_update)




# ==============================================================================================================

#                              Deleting a Job (DELETE Request) API route:

@app.route('/api/Jobs/delete/<id>/' , methods=['DELETE'])
def delete_job(id):
  job_to_delete = Jobs.query.get(id)

  db.session.delete(job_to_delete)
  db.session.commit()

  return job_schema.jsonify(job_to_delete)












#==============================================================================================================:
# ===================================> Service API Management Routes <===========================================:
#==============================================================================================================:

#                                   Get all Services from database API:

@app.route("/api/Services/get" , methods=["GET"])
def services():

  # get all services
  all_services = Service.query.order_by(Service.id).all()
  results = services_schema.dump(all_services)
  return jsonify(results)



# Get one service:
@app.route("/api/service/get/<id>/" , methods=["GET"])
def service(id):

  # get a service:
  service = Service.query.get(id)
  results = service_schema.dump(service)
  return jsonify(results)




# ==============================================================================================================

#                               Updating a Service (PUT Request) API route:

@app.route('/api/service/update/<id>/' , methods=['PUT'])
def update_service(id):
  service_to_update = Service.query.get(id)
  old_worker_data = Service.query.get(id)

  data = request.get_json()
  service = data.get('updatedService')
  price = data.get('updatedPrice')
  serviceType = data.get('updatedServiceType')
  percentage = data.get("updatedPercentage")

  for key in data.keys():
    if key not in ["updatedService", 'updatedPrice', 'updatedServiceType', 'updatedPercentage'] :
      return jsonify({"error":f"The field {key} does not exist."}), 400
     # The line above checks to see if the keys from the JSON input match up with the ones we are looking for. If they don't

  # Checks to see if the fields are empty and returns an error message if they are.
  missing_fields = []
  if not service:
    missing_fields.append("Service")
  if not price:
    missing_fields.append("Price")
  if not serviceType:
    missing_fields.append("Service Type")
  if not percentage:
    missing_fields.append("Percentage")



  if missing_fields:
    return jsonify({"error": f"Missing {', '.join(missing_fields)} from submitted data."}), 400

  # If there is no user with that id, it sends back a error message saying "User Not Found".
  if not service_to_update:
    return jsonify({"error": "User Not Found"}), 404

  # Updates the information of the  user who matches the ID in the URL parameter.
  service_to_update.service = service
  service_to_update.price = price
  service_to_update.serviceType = serviceType
  service_to_update.percentage = percentage


  # Saves the changes to the database.
  db.session.commit()

  return  service_schema.jsonify(service_to_update)



# ==============================================================================================================

#                              Deleting a Service (DELETE Request) API route:

@app.route('/api/service/delete/<id>/' , methods=['DELETE'])
def delete_service(id):
  service_to_delete = Service.query.get(id)

  db.session.delete(service_to_delete)
  db.session.commit()

  return service_schema.jsonify(service_to_delete)










#==============================================================================================================:
# ===================================> Customers API Management Routes <===========================================:
#==============================================================================================================:

#                                   Get all Customers from database API:

@app.route("/api/customers/get" , methods=["GET"])
def customers():

  # get all customers:
  all_customers = Customers.query.order_by(Customers.id).all()
  results = customers_schema.dump(all_customers)
  return jsonify(results)




@app.route("/api/customer/get/<id>/" , methods=["GET"])
def customer(id):

  # get one order:
  customer = Customers.query.get(id)
  results = customer_schema.dump(customer)
  return jsonify(results)



# =============================================================================================================

#                         Add Customers in the database through an API route:

app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["PNG", "JPG", "JPEG", "WEBP", "AVIF", "GIF", "CSV"]

def allowed_image(filename):
    if not "." in filename:
        return False
    ext = filename.rsplit(".", 1)[1]
    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False


@app.route('/api/AddCustomers' , methods=['POST'])
def add_customers():
  # data = request.get_json()

  if 'file' in request.files:
    branchID = request.form['branchID']
    # Uploading a CSV file
    csv_file = request.files['file']

    # Wrap the file in a TextIOWrapper to ensure it's treated as text
    csv_data = csv.DictReader(TextIOWrapper(csv_file, 'utf-8'), delimiter=';')

    for row in csv_data:
      print(row)
      # Remove leading and trailing whitespace from column names
      row = {key.strip(): value for key, value in row.items()}

      if 'date' in row:
        date = datetime.strptime(row['date'], '%d/%m/%Y').date()
      else:
          # Handle missing 'date' column in the CSV file
          date = None

      # Access other columns using stripped keys
      name = row['name']
      licensePlate = row['licensePlate']
      carBrand = row['carBrand']
      carModel = row['carModel']
      service = row['service']
      price = float(row['price'])
      image1 = row['image1']
      image2 = row['image2']
      image3 = row['image3']

      new_customer = Customers(date=date, name=name, licensePlate=licensePlate, carBrand=carBrand, carModel=carModel, price=price, service=service, image1=image1, image2=image2, image3=image3, branchID=branchID)
      db.session.add(new_customer)
      db.session.commit()


    return jsonify({"message": "Data successfully processed from CSV file"})

  else:


    if 'date' not in request.form:
      return jsonify({"error": "Date field is missing in the form data."}), 400

    date_str = request.form['date']
    try:
      date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
      return jsonify({"error": "Invalid date format. Date should be in the format YYYY-MM-DD."}), 400


    name = request.form['name']
    licensePlate = request.form['licensePlate']
    carBrand = request.form['carBrand']
    carModel = request.form['carModel']
    service = request.form['service']
    price = request.form['price']
    branchID = request.form['branchID']
    image1= None
    image2= None
    image3= None

    filename1 = ''
    filename2 = ''
    filename3 = ''

    if 'image1' in request.files:
      image1 = request.files['image1']
      print(image1)

    if 'image2' in request.files:
      image2 = request.files['image2']

    if 'image3' in request.files:
      image3 = request.files['image3']


    if image1 != None and allowed_image(image1.filename):
      filename1 = secure_filename(image1.filename)
      image1.save(os.path.join('client/public/images', filename1))

    if image2 != None and allowed_image(image2.filename):
      filename2 = secure_filename(image2.filename)
      image2.save(os.path.join('client/public/images', filename2))

    if image3 != None and allowed_image(image3.filename):
      filename3 = secure_filename(image3.filename)
      image3.save(os.path.join('client/public/images', filename3))


    new_customer = Customers(date=date, name=name, licensePlate=licensePlate, carBrand=carBrand, carModel=carModel, price=price, service=service, image1=filename1, image2=filename2, image3=filename3, branchID=branchID)
    db.session.add(new_customer)
    db.session.commit()








    # Checks to see if the fields are empty and returns an error message if they are.





    return customer_schema.jsonify(new_customer)




# ==============================================================================================================

#                               Updating a Customer (PUT Request) API route:

@app.route('/api/customers/update/<id>/' , methods=['PUT'])
def update_customer(id):
  customer_to_update = Customers.query.get(id)
  print('Hello World!')
  # data = request.get_json()
  if 'updatedDate' not in request.form:
    return jsonify({"error": "Date field is missing in the form data."}), 400

  date_str = request.form['updatedDate']
  try:
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
  except ValueError:
    return jsonify({"error": "Invalid date format. Date should be in the format YYYY-MM-DD."}), 400

  name = request.form["updatedName"]
  licensePlate = request.form['updatedLicensePlate']
  carBrand = request.form['updatedCarBrand']
  carModel = request.form['updatedCarModel']
  service = request.form['updatedService']
  price = request.form['updatedPrice']

  oldImage1 = customer_to_update.image1
  oldImage2 = customer_to_update.image2
  oldImage3 = customer_to_update.image3

  image1 = None
  image2 = None
  image3 = None
  if 'updatedImage1' in request.files:
    image1 = request.files['updatedImage1']

  if 'updatedImage2' in request.files:
    image2 = request.files['updatedImage2']

  if 'updatedImage3' in request.files:
    image3 = request.files['updatedImage3']


  if image1 != None and allowed_image(image1.filename):
    filename1 = secure_filename(image1.filename)
    image1.save(os.path.join('client/public/images', filename1))

  if image2 != None and allowed_image(image2.filename):
    filename2 = secure_filename(image2.filename)
    image2.save(os.path.join('client/public/images', filename2))

  if image3 != None and allowed_image(image3.filename):
    filename3 = secure_filename(image3.filename)
    image3.save(os.path.join('client/public/images', filename3))




  # If there is no user with that id, it sends back a error message saying "User Not Found".
  if not customer_to_update:
    return jsonify({"error": "User Not Found"}), 404



  customer_to_update.date = date
  customer_to_update.name = name
  customer_to_update.licensePlate = licensePlate
  customer_to_update.carBrand = carBrand
  customer_to_update.carModel = carModel
  customer_to_update.service = service
  customer_to_update.price = price
  if image1 != None:
    customer_to_update.image1 = filename1
  else:
    customer_to_update.image1 = oldImage1

  if image2 != None:
    customer_to_update.image2 = filename2
  else:
    customer_to_update.image2 = oldImage2

  if image3 != None:
    customer_to_update.image3 = filename3
  else:
    customer_to_update.image3 = oldImage3



  # Saves the changes to the database.
  db.session.commit()

  return  customer_schema.jsonify(customer_to_update)



# ==============================================================================================================

#                              Deleting a Customer (DELETE Request) API route:

@app.route('/api/customers/delete/<id>/' , methods=['DELETE'])
def delete_customer(id):
  customer_to_delete = Customers.query.get(id)

  db.session.delete(customer_to_delete)
  db.session.commit()

  return customer_schema.jsonify(customer_to_delete)













#==============================================================================================================:
# ===================================> Branches API Management Routes <===========================================:
#==============================================================================================================:

#                                   Get all Branches from database API:

@app.route("/api/branches/get" , methods=["GET"])
def branches():

  # get all branches:
  all_branches = Branch.query.order_by(Branch.id).all()
  results = branches_schema.dump(all_branches)
  return jsonify(results)




@app.route("/api/branch/get/<id>/" , methods=["GET"])
def branch(id):

  # get one branch:
  branch = Branch.query.get(id)
  results = branch_schema.dump(branch)
  return jsonify(results)



# =============================================================================================================

#                         Add New Branch in the database through an API route:




@app.route('/api/AddBranch' , methods=['POST'])
def add_branch():
  data = request.get_json()

  name = data.get('name')
  location = data.get('location')


  new_branch = Branch(name=name, location=location)
  db.session.add(new_branch)
  db.session.commit()


  return branch_schema.jsonify(new_branch)




# ==============================================================================================================

#                               Updating a Branch (PUT Request) API route:

@app.route('/api/branch/update/<id>/' , methods=['PUT'])
def update_branch(id):
  branch_to_update = Branch.query.get(id)

  data = request.get_json()
  name = data.get('UpdatedName')
  location = data.get('UpdatedLocation')

  # If there is no user with that id, it sends back a error message saying "User Not Found".
  if not branch_to_update:
    return jsonify({"error": "User Not Found"}), 404

  branch_to_update.name = name
  branch_to_update.location  = location

  # Saves the changes to the database.
  db.session.commit()

  return branch_schema.jsonify(branch_to_update)



# ==============================================================================================================

#                              Deleting a Branch (DELETE Request) API route:

@app.route('/api/branch/delete/<id>/' , methods=['DELETE'])
def delete_branch(id):
  branch_to_delete = Branch.query.get(id)

  db.session.delete(branch_to_delete)
  db.session.commit()

  return branch_schema.jsonify(branch_to_delete)



















#==============================================================================================================:
# ===================================> Generating Reports API Routes <===========================================:
#==============================================================================================================:





# Route for generating and downloading a PDF report
@app.route('/api/reports/download/pdf', methods=['POST'])
def download_pdf_report():

  data = request.get_json()
  print("Hello World!")
  startDate = data.get('startDate')
  endDate = data.get('endDate')
  name = data.get('name')
  totalSalary = data.get('totalSalary')

  if not data or not data.get('data') or not startDate or not endDate:
      return jsonify({'error': 'Missing required parameters'}), 400

  filtered_rows = []
  for r in data['data']:
    date = r['date']
    if startDate <= date <= endDate:
      filtered_rows.append(r)

  styles = getSampleStyleSheet()
  title_style = styles['Heading1']
  title_style.alignment = TA_CENTER
  data_style = styles['Normal']
  data_style.alignment = TA_JUSTIFY

  # c = canvas.Canvas(buffer)
  buffer = BytesIO()
  doc = SimpleDocTemplate(buffer, pagesize=letter)
  elements = []

  width, height = letter

  # Title
  elements.append(Paragraph('Salary Report', title_style))

  # Dates
  elements.append(Paragraph(f"Date Range: {startDate} - {endDate}", data_style))
  if name:
    elements.append(Paragraph(f"Worker Name: {name}", data_style))
  else:
    elements.append(Paragraph(f"Worker Name: All Workers in this Date Range", data_style))
  elements.append(Paragraph(f"Salary Total: {totalSalary}", data_style))
  elements.append(Spacer(1, 12))

  # Data
  table_data = [['ID',
                 'Date',
                 'Service',
                 'Price',
                 'Salary',
                 'License P.L.',
                 'Car Brand',
                 'Car Model',
                 'Customer',
                 'W 1',
                 'W 2',
                 'W 3',
                 'Notes'
                ]]

  for row in filtered_rows:
    table_data.append([row['id'],
                       row['date'],
                       row['service'],
                       row['price'],
                       row['salary'],
                       row['licensePlate'],
                       row['carBrand'],
                       row['carModel'],
                       row['customer'],
                       row['W1'],
                       row['W2'],
                       row['W3'],
                       row['notes'
                      ]])

 # Calculate column widths based on content
  col_widths = [max([len(str(row[col])) for row in table_data]) * 12 for col in range(len(table_data[0]))]

  # Calculate the total content width
  total_width = sum(col_widths)

  # Calculate the relative widths based on the total content width
  relative_widths = [width * col_width / total_width for col_width in col_widths]

  # Create the table with the calculated relative column widths
  table = Table(table_data, colWidths=relative_widths)


  # Smaller font
  header_style = [
    ('BACKGROUND', (0,0), (-1,0), colors.grey),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica'),
    ('FONTSIZE', (0,0), (-1,0), 6),
  ]

  # Less padding
  header_style.append(('TOPPADDING', (0,0), (-1,0), 1))
  header_style.append(('BOTTOMPADDING', (0,0), (-1,0), 1))

  # Rotate text
  header_style.append(('TEXTANGLE', (0,0), (-1,0), 45))


  # table.maxWidth = '100%'

  # Allow flowing onto multiple pages
  # table.wrapOn(doc, width, height)
  # table.splitByRow = True
  # table = Table(table_data, colWidths=['auto'])
  table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,0), colors.grey),
                             ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                             ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                             ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                             ('ALIGN', (0,0), (-1,0), 'CENTER'),
                             ('VALIGN', (0,0), (-1,0), 'MIDDLE'),
                             ('FONTSIZE', (0,0), (-1,0), 10),
                             ('BOTTOMPADDING', (0,0), (-1,0), 12),
                             ('BACKGROUND', (0,1), (-1,-1), colors.beige),
                             ('GRID', (0,0), (-1,-1), 1, colors.black),
                             ('TEXTANGLE', (0,0), (-1,0)),

                             ]))
  # table.wrapOn(canvas, width, height)

  elements.append(table)
  doc.build(elements)

  buffer.seek(0)
  print(buffer.getvalue())

  return send_file(BytesIO(buffer.getvalue()), as_attachment=True, download_name='salary_report.pdf', mimetype='application/pdf')




@app.route('/api/reports/download/excel', methods=['POST'])
def download_excel_report():

    data = request.get_json()

    if not data or not data.get('data') or not data.get('startDate') or not data.get('endDate'):
        return jsonify({'error': 'Missing required parameters'}), 400

    start_date = data['startDate']
    end_date = data['endDate']

    filtered_rows = [row for row in data['data'] if row['date'] >= start_date and row['date'] <= end_date]

    # Generate the Excel report using Pandas
    df = pd.DataFrame(filtered_rows)

    # Create an Excel writer using BytesIO
    excel_writer = pd.ExcelWriter('report.xlsx', engine='xlsxwriter')
    df.to_excel(excel_writer, index=False)
    excel_writer._save()  # Save the Excel file
    excel_writer.close()

    # Return the Excel report as a file download
    return send_file('report.xlsx', as_attachment=True, download_name='report.xlsx', mimetype='application/vnd.ms-excel')







# Invoice:
# Route for generating and downloading a PDF Invoice:
@app.route('/api/invoices/download/pdf', methods=['POST'])
def download_pdf_invoice():

  data = request.get_json()
  date = data.get('date')
  MyCompany = 'My Company'
  totalSalary = data.get('total')
  logo_path = "client/public/images/my-icon.png"
  logo = Image(logo_path, width=1.8*inch, height=1.8*inch)  # Adjust width and height as needed

  if not data or not data.get('data'):
    return jsonify({'error': 'Missing required parameters'}), 400

  filtered_rows = []
  for r in data['data']:
    filtered_rows.append(r)

  styles = getSampleStyleSheet()
  title_style = styles['Heading1']
  title_style.alignment = TA_CENTER
  title_style.fontSize = 20
  data_style = styles['Normal']
  data_style.alignment = TA_JUSTIFY

  # c = canvas.Canvas(buffer)
  buffer = BytesIO()
  doc = SimpleDocTemplate(buffer, pagesize=letter)
  elements = []

  width, height = letter

  # Title
  elements.append(Paragraph('Invoice', title_style))
  elements.append(Spacer(1, 12))
  elements.append(logo)  # Add the logo image
  elements.append(Paragraph(f"Company Name: {MyCompany}", data_style))
  elements.append(Paragraph(f"Date: {date}", data_style))
  elements.append(Spacer(1, 12))


  table_data = [['ID',
                'Customer',
                'Date',
                'Service',
                'Price',
                ]]

  for row in filtered_rows:
      table_data.append([row['id'],
                        row['customer'],
                        row['date'],
                        row['service'],
                        row['price'],
                        ])

  # Calculate column widths based on content
  col_widths = [max([len(str(row[col])) for row in table_data]) * 12 for col in range(len(table_data[0]))]


  # Calculate the total content width
  total_width = sum(col_widths)

  # Calculate the relative widths based on the total content width
  relative_widths = [width * col_width / total_width for col_width in col_widths]
  # Create the table with the calculated relative column widths
  table = Table(table_data, colWidths=relative_widths)

  # Apply styles to the table
  table.setStyle(TableStyle([
      ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
      ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
      ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
      ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
      ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
      ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
      ('FONTSIZE', (0, 0), (-1, 0), 10),
      ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
      ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
      ('GRID', (0, 0), (-1, -1), 1, colors.black),
      ('TEXTANGLE', (0, 0), (-1, 0)),
  ]))

  # Append the table to the elements
  elements.append(table)

  # Total amount section
  # Total amount section
  total_style = styles['Normal']
  total_style.alignment = TA_RIGHT
  total_style.fontName = 'Helvetica-Bold'
  total_style.fontSize = 14  # Increase the font size

  elements.append(Spacer(1, 72))  # Add a larger spacer to move the total to the right bottom
  elements.append(Paragraph(f"Total: {totalSalary}", total_style))
  doc.build(elements)

  buffer.seek(0)
  print(buffer.getvalue())

  return send_file(BytesIO(buffer.getvalue()), as_attachment=True, download_name='Invoice.pdf', mimetype='application/pdf')













# class Products(db.Model):
#   id = db.Column(db.Integer, primary_key=True)
#   title = db.Column(db.String(1000), nullable=False)
#   description = db.Column(db.String(3000), nullable=False)
#   price =  db.Column(db.Float, nullable=False)
#   category = db.Column(db.String(80), nullable=False)
#   rate = db.Column(db.Float)
#   image1 = db.Column(db.String(1000000), nullable=False)
#   image2 = db.Column(db.String(1000000))
#   image3 = db.Column(db.String(1000000))


#   def __init__(self, title, description, price, category, rate, image1, image2, image3):
#     self.title = title
#     self.description = description
#     self.price = price
#     self.category = category
#     self.rate = rate
#     self.image1 = image1
#     self.image2 = image2
#     self.image3 = image3


# #users schema:
# class UserSchema(ma.Schema):
#   class Meta:
#     fields = ('id', 'username', 'email', 'password')

# user_schema =  UserSchema()
# users_schema = UserSchema(many=True)


# #products schema:
# class ProductsSchema(ma.Schema):
#   class Meta:
#     fields = ('id', 'title', 'description', 'price', 'category', 'rate', 'image1', 'image2', 'image3')

# product_schema =  ProductsSchema()
# products_schema = ProductsSchema(many=True)



# @app.before_request
# def before_request():

#   g.id = None

#   if "user_id" in session:
#     g.id = session["user_id"]


# #==============================================================================================================:
# # ===================================> Users API Management Routes <===========================================:
# #==============================================================================================================:

# #                                   Get all users from database API:

# @app.route("/api/get" , methods=["GET"])
# def members():

#    # get all users
#   all_users = user.query.order_by(user.id).all()
#   results = users_schema.dump(all_users)

#   return jsonify(results)

# # =============================================================================================================

# #                         Create a new user in the database through an API route:

# @app.route('/api/signUp' , methods=['POST'])
# def add_user():
#   username = request.json['username']
#   email = request.json['email']
#   password = request.json['password']

#   existed_user = user.query.filter_by(username=username).first()

#   if existed_user :
#     return jsonify({ "message": "User with this username already exists!"}), 409

#   hashed_password = bcrypt.generate_password_hash(password)
#   new_user = user(username, email, hashed_password)
#   db.session.add(new_user)
#   db.session.commit()

#   session["user_id"] = new_user.id
#   return user_schema.jsonify(new_user)


# #==============================================================================================================

# #                                           login API route:

# @app.route('/api/login' , methods=['POST'])
# def login():
#   username = request.json['username']
#   # email = request.json['email']
#   password = request.json['password']

#   our_user = user.query.filter_by(username=username).first()

#   if our_user is None:
#     return jsonify({"message":" invalid Username or Password"}), 404

#   if not bcrypt.check_password_hash(our_user.password, password):
#     return jsonify({"message":"invalid Username or Password"}), 401


#   session["user_id"] = our_user.id
#   if g.id:
#     return jsonify({"session": session["user_id"]})
#   return user_schema.jsonify(our_user)


# # Singing out API Route:
# @app.route('/api/signout' , methods=['POST'])
# def sign_out():
#   session.clear()
#   return jsonify({"message":"You have been signed out."})

# # ==============================================================================================================

# #                               Updating a user (PUT Request) API route:

# @app.route('/api/update/<id>/' , methods=['PUT'])
# def update_user(id):
#   user_to_update = user.query.get(id)

#   username = request.json['username']
#   email = request.json['email']
#   password = request.json['password']

#   user_to_update.username = username
#   user_to_update.email = email
#   user_to_update.password = password

#   db.session.commit()
#   return  user_schema.jsonify(user_to_update)




# # ==============================================================================================================

# #                              Deleting a user (DELETE Request) API route:

# @app.route('/api/delete/<id>/' , methods=['DELETE'])
# def delete_user(id):
#   user_to_delete = user.query.get(id)

#   db.session.delete(user_to_delete)
#   db.session.commit()

#   return user_schema.jsonify(user_to_delete)




# #==============================================================================================================:
# # =================================> *** Products API Management Routes *** <==================================:
# #==============================================================================================================:

# #                                     Get all users from database API:

# @app.route("/api/getProducts" , methods=["GET"])
# def products():

#    # get all users
#   all_products = Products.query.order_by(Products.id).all()
#   results = products_schema.dump(all_products)

#   return jsonify(results)


# #==============================================================================================================

# #                              Create A New Product (POST Request) API Route:

# app.config["IMAGE_UPLOADS"] = "client/public/images"
# app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["PNG", "JPG", "JPEG", "WEBP", "AVIF", "GIF", "CSV"]

# def allowed_image(filename):
#     if not "." in filename:
#         return False
#     ext = filename.rsplit(".", 1)[1]
#     if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
#         return True
#     else:
#         return False



# @app.route('/api/addOneProduct' , methods=['POST'])
# def add_one_product():
#   title = request.form['title']
#   description = request.form['description']
#   price = request.form['price']
#   category = request.form['category']
#   rate = request.form['rate']
#   image1 = request.files['image1']
#   image2 = request.files['image2']
#   image3 = request.files['image3']

#   #check for error:
#   if image1 and allowed_image(image1.filename):
#     result1 = cloudinary.uploader.upload(image1)
#   else:
#     return jsonify({"message": "please upload a valid image extention"}),400
#   if image2 and allowed_image(image2.filename):
#     result2 = cloudinary.uploader.upload(image2)
#   else:
#     return jsonify({"message": "please upload a valid image extention"}),400
#   if image3 and allowed_image(image3.filename):
#     result3 = cloudinary.uploader.upload(image3)
#   else:
#     return jsonify({"message": "please upload a valid image extention"}),400

#   image1_URL = result1['secure_url']
#   image2_URL = result2['secure_url']
#   image3_URL = result3['secure_url']

#   new_product = Products(title=title, description=description, price=price, category=category, rate=rate, image1=image1_URL, image2=image2_URL, image3=image3_URL)
#   try:
#     db.session.add(new_product)
#     db.session.commit()
#     return jsonify({"SuccessMessage": "product has been added successfully!"}), 200
#   except:
#     return jsonify({"FailurMessage": "Something went wrong, can't add the product!"}), 500



# #==============================================================================================================:

# #                               Deleting a Product (DELETE Request) API route:

# @app.route('/api/deleteProduct/<id>/' , methods=['DELETE'])
# def delete_product(id):
#   product_to_delete = user.query.get(id)

#   db.session.delete(product_to_delete)
#   db.session.commit()

#   return product_schema.jsonify(product_to_delete)







if __name__ == "__main__":
  app.run(debug=True)


