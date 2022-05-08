'''Unser Service basiert auf Flask'''
from flask import Flask
'''Auf Flask aufbauend nutzen wir RestX'''
from flask_restx import Api, Resource, fields
'''Wir benutzen noch eine Flask-Erweiterung für Cross-Origin Resource Sharing'''
from flask_cors import CORS
'''Wir greifen natürlich auf unsere Applikationslogik inkl. BusinessObject-Klassen zurück'''

from server.bo.Projekt import Projekt


'''Außerdem nutzen wir einen selbstgeschriebenen Decorator, der die Authentifikation übernimmt'''
from SecurityDecorator import secured

"""Hier wird Flask instanziert"""
app = Flask(__name__)

"""Flask-Erweiterung für Cross-Origin Resource Sharing"""
CORS(app, resources=r'/app/*',supports_credentials=True)

api = Api(app, version='1.0', title='Zeiterfassungapp api', #Name?
          description='Eine rudimentäre Demo-Api für Listenerstellung.')

"""Namespaces"""
zeiterfassungapp= api.namespace('app', description="Funktionen der App") #Name der App?

"""Nachfolgend werden analog zu unseren BusinessObject-Klassen transferierbare Strukturen angelegt.
BusinessObject dient als Basisklasse."""