import json
import logging
import urllib
import sendgrid
import requests
from sparkpost import SparkPost
from sendgrid.helpers.mail import *
import jinja2
import re
import webapp2
import os
from google.appengine.api import urlfetch
from google.appengine.ext import db
from google.appengine.api import images
import webapp2
import requests_toolbelt.adapters.appengine
from datetime import datetime, timedelta
from random import randint
import time

requests_toolbelt.adapters.appengine.monkeypatch()
jinja_env = jinja2.Environment(autoescape=True,
                               loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))

USER_RE = re.compile(r"^[a-zA-Z]{3,20}\s?([a-zA-Z]{3,20})?$")


def valid_name(username):
    if username and USER_RE.match(username):
        return True
    else:
        return False


EMAIL_RE = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")


def valid_email(email):
    if email and EMAIL_RE.match(email):
        return True
    else:
        return False


def valid_phone(phone):
    if phone.isdigit() and len(phone) == 10:
        return True
    else:
        return False


def send_simple_email(subject, body, email):
    return requests.post(
        "https://api.mailgun.net/v3/sandbox3044e679dd1947139228f23db8e8d379.mailgun.org/messages",
        auth=("api", "key-5492d5bbddfd085f28cc93268edb72d4"),
        data={"from": "Management <postmaster@sandbox3044e679dd1947139228f23db8e8d379.mailgun.org>",
              "to": "<%s>" % (email),
              "subject": subject,
              "text": body})


class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))


class Hosts(db.Model):
    name = db.StringProperty(required=True)
    email = db.StringProperty(required=True)
    phone = db.StringProperty(required=True)
    date = db.DateTimeProperty(auto_now_add=True)


class CheckedIn(db.Model):
    visitor_name = db.StringProperty(required=True)
    visitor_email = db.StringProperty(required=True)
    visitor_phone = db.StringProperty(required=True)
    visitor_id = db.StringProperty(required=True)
    pic = db.BlobProperty()
    host_name = db.StringProperty(required=True)
    date = db.DateTimeProperty(auto_now_add=True)
    webcam = db.TextProperty()


class CheckedOut(db.Model):
    visitor_name = db.StringProperty(required=True)
    visitor_email = db.StringProperty(required=True)
    visitor_phone = db.StringProperty(required=True)
    visitor_id = db.StringProperty(required=True)
    pic = db.BlobProperty()
    webcam = db.TextProperty()
    host_name = db.StringProperty(required=True)
    host_email = db.StringProperty(required=True)
    host_phone = db.StringProperty(required=True)
    checkin_date = db.DateTimeProperty(required=True)
    checkout_date = db.DateTimeProperty(auto_now_add=True)


class MainHandler(Handler):
    def get(self):
        self.render('welcome.html')


class AddHostHandler(Handler):
    def get(self):
        self.render("registerhost.html", mssg="")

    def post(self):
        name = self.request.get("name")
        if not valid_name(name):
            self.render("registerhost.html", mssg="Invalid Name !!")
            return
        email = self.request.get("email")
        if not valid_email(email):
            self.render("registerhost.html", mssg="Invalid Email !!")
            return
        phone = self.request.get("phone")
        if not valid_phone(phone):
            self.render("registerhost.html", mssg="Invalid Phone Number !!")
            return
        host = Hosts(name=str(name),
                     email=str(email),
                     phone=str(phone)
                     )
        host.put()
        self.redirect('/')


visitor_id_global = 1

class CheckInHandler(Handler):
    def get(self):
        all_hosts = db.GqlQuery("select * from Hosts")
        self.render('checkin.html', hosts=all_hosts, mssg="")

    def post(self):
        all_hosts = db.GqlQuery("select * from Hosts")
        name = self.request.get("name")
        if not valid_name(name):
            self.render("checkin.html", hosts=all_hosts, mssg="Invalid Name !!")
            return
        email = self.request.get("email")
        if not valid_email(email):
            self.render("checkin.html", hosts=all_hosts, mssg="Invalid Email !!")
            return
        phone = self.request.get("phone")
        if not valid_phone(phone):
            self.render("checkin.html", hosts=all_hosts, mssg="Invalid Phone Number !!")
            return
	global visitor_id_global
        visitor_id = str(visitor_id_global)
	visitor_id_global += 1
        print visitor_id
        all_checked_in = db.GqlQuery("select * from CheckedIn")
        host = self.request.get("host")
        pic = ""
        pic_error = False
        try:
            pic = self.request.get("pic")
            pic = images.resize(pic, 256, 256)
        except:
            print "pic error"
            pic_error = True
            pic = ""
        webcam = ""
        try:
            webcam = self.request.get("webcam")
        except:
            print "webcam error"
            webcam = ""
        webcam_error = False
        if webcam == "":
            webcam_error = True
            # print webcam
        if webcam_error and pic_error:
            self.render("checkin.html", hosts=all_hosts, mssg="Upload a photo or take picture from webcam !!")
            return
        found = False
        host_email = ""
        all_hosts = db.GqlQuery("select * from Hosts")
        for i in all_hosts:
            if i.name == host:
                found = True
                host_email = i.email
                break

        if found:
            checkin = CheckedIn(visitor_name=str(name),
                                visitor_email=str(email),
                                visitor_phone=str(phone),
                                visitor_id=str(visitor_id),
                                pic=pic,
                                webcam=str(webcam),
                                host_name=str(host)
                                )
            checkin.put()
            checkin_id = str(checkin.key().id())
            body_mssg = ("Name: %s\n\nEmail: %s\n\nPhone: %s\n\n" % (name, email, phone))
            send_simple_email("New Incoming Visitor", body_mssg, host_email)

            self.render("error.html", mssg="Checked In Successfully !", link=checkin_id)
        else:
            self.render("error.html", mssg="Error Checking In !!", link="")


class CheckOutHandler(Handler):
    def get(self):
        all_checked_in = CheckedIn.all()
        ids = []
        for i in all_checked_in:
            ids.append(str(i.key().id()))
        self.render("checkout.html", all_checked_in=all_checked_in, ids=ids)

    def post(self):
        visitor_id = self.request.get("visitor_id")
        all_checked_in = CheckedIn.all()
        all_checked_in.filter("visitor_id =", visitor_id)
        ids = []
        for i in all_checked_in:
            ids.append(str(i.key().id()))
        self.render("checkout.html", all_checked_in=all_checked_in, ids=ids)


class CheckedOutHandler(Handler):
    def get(self):
        email = self.request.get("email")
        name = ""
        all_checked_in = db.GqlQuery("select * from CheckedIn")
        found = False
        x = ""
        for i in all_checked_in:
            if i.visitor_email == email:
                name = i.visitor_name
                found = True
                host_name = i.host_name
                all_hosts = db.GqlQuery("select * from Hosts")
                host_mail = ""
                for j in all_hosts:
                    if j.name == host_name:
                        host_mail = j.email
                        history = CheckedOut(visitor_name=i.visitor_name,
                                             visitor_email=i.visitor_email,
                                             visitor_phone=i.visitor_phone,
                                             visitor_id=i.visitor_id,
                                             pic=i.pic,
                                             webcam=i.webcam,
                                             host_name=j.name,
                                             host_email=j.email,
                                             host_phone=j.phone,
                                             checkin_date=i.date)
                        history.put()
                        break
                send_simple_email("Visitor Checked Out !!", "Name:%s\n\nEmail: %s\n\n" % (name, email), host_mail)
                i.delete()
                break
        if found:
            self.render("error.html", mssg="Checked Out Successfully !!", link="")
	    time.sleep(1)
	    self.redirect("/checkout")
        if not found:
            self.render("error.html", mssg="no such person checked in !!", link="")


class ImgHandler(Handler):
    def get(self):
        check_in_id = self.request.get("id")
        key = db.Key.from_path('CheckedOut', int(check_in_id))
        person = db.get(key)
        if person.pic:
            self.response.headers['Content-Type'] = 'image/jpeg'
            self.response.out.write(person.pic)
        else:
            self.response.out.write('No image')


class ImageHandler(Handler):
    def get(self):
        check_in_id = self.request.get("id")
        key = db.Key.from_path('CheckedIn', int(check_in_id))
        person = db.get(key)
        if person.pic:
            self.response.headers['Content-Type'] = 'image/jpeg'
            self.response.out.write(person.pic)
        else:
            self.response.out.write('No image')


class PermalinkHandler(Handler):
    def get(self):
        person_id = self.request.get("id")
        key = db.Key.from_path('CheckedIn', int(person_id))
        person = db.get(key)
        self.render("permalink.html", i=person, id=person_id)


class ReportHandler(Handler):
    def get(self):
        self.render("report.html", history="", ids="", all_checkin="", idss="")

    def post(self):
        start_date = self.request.get("start_date")
        if start_date == "":
            self.redirect('/generatereport')
        end_date = self.request.get("end_date")
        if end_date == "":
            self.redirect('/generatereport')
        print start_date
        print end_date
        start_date = start_date.split('/')
        end_date = end_date.split('/')
        """
        for i in start_date:
            print i
        for i in end_date:
            print i
        """
        # 7/15/2017
        start_day = int(start_date[1])
        start_month = int(start_date[0])
        start_year = int(start_date[2])
        end_day = int(end_date[1])
        end_month = int(end_date[0])
        end_year = int(end_date[2])
        start_datetime = datetime(start_year, start_month, start_day)
        end_datetime = datetime(end_year, end_month, end_day)
	today_date = datetime.now()
	print start_datetime
	print end_datetime
	print today_date
	if end_datetime > today_date:
	    self.render("report.html", history="", ids="", mssg="End date should not be greater than today's date.")
	    return
	if start_datetime > end_datetime:
            self.render("report.html", history="", ids="", mssg="!! Start Date MUST be less than End Date !!")
            return
	end_datetime += timedelta(hours=24)
        all_history = CheckedOut.all()
        all_history.filter('checkin_date >=', start_datetime)
        all_history.filter('checkin_date <=', end_datetime)
	all_checkin = CheckedIn.all()
	all_checkin.filter("date >=", start_datetime)
	all_checkin.filter("date <=", end_datetime)
	idss = []
	for i in all_checkin:
	    idss.append(str(i.key().id()))
	"""
        for i in all_history:
            print i.checkin_date
            print i.visitor_name
	"""
        ids = []
        for i in all_history:
            ids.append(str(i.key().id()))
        self.render("report.html", history=all_history, ids=ids, mssg="", all_checkin=all_checkin, idss=idss)


class TestHandler(Handler):
    def get(self):
        self.render("index.html")


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/addhost', AddHostHandler),
    ('/checkin', CheckInHandler),
    ('/checkout', CheckOutHandler),
    ('/checkedout', CheckedOutHandler),
    ('/image', ImageHandler),
    ('/img', ImgHandler),
    ('/permalink', PermalinkHandler),
    ('/generatereport', ReportHandler),
    ('/test', TestHandler)
], debug=True)
