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

bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'),
    'creation_time': fields.DateTime(attribute='_creation_time', description='Erstellungszeitpunkt des Objekts')
})
person = api.inherit('Person', bo, {
    'vorname': fields.Integer(attribute='_vorname', description='unique ID des Vornamens'),
    'nachname': fields.String(attribute='_nachname', description='nachname des Nachnamens')
    'email': fields.String(attribute='_email', description='unique email des der Person'),
    'benutzername': fields.String(attribute='_benutzername', description='benutzername des Benutzernamens')
})
# Alle weiteren bo´s wie bei Person erstellen

@zeiterfassungapp.route('/persons')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonListOperations(Resource):
    @secured
    @zeiterfassungapp.marshal_list_with(person)
    def get(self):
        """Auslesen aller Person-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        pers = adm.get_all_person()
        return pers

    @zeiterfassungapp.marshal_with(person, code=200)
    @zeiterfassungapp.expect(person)  # Wir erwarten ein Person-Objekt von Client-Seite.
    @secured
    def post(self):
        """Anlegen eines neuen Person-Objekts.
        """
        adm = Administration()

        proposal = Person.from_dict(api.payload)

        if proposal is not None:
            pers = adm.create_person(proposal.get_vorname(), proposal.get_nachname(), proposal.get_email(), proposal.get_benutzername())
            return pers, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/person/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Person-Objekts')
class PersonOperations(Resource):
    @zeiterfassungapp.marshal_with(person)
    @secured
    def get(self, id):
        """Auslesen einer bestimmten Person-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        pers = adm.get_person_by_id(id)
        return pers

    @secured
    def delete(self, id):
        """Löschen einer bestimmten Person-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        pers = adm.get_person_by_id(id)
        adm.delete_person(pers)
        return '', 200

    @zeiterfassungapp.marshal_with(person)
    @zeiterfassungapp.expect(person, validate=True)

    def put(self, id):
        """Update einer bestimmten Person.
        """
        adm = Administration()
        p = Person.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_person(p)
            return '', 200
        else:
            return '', 500

@zeiterfassungapp.route('/person/<string:email>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('email', 'Die Mail des Person-Objekts')
class PersonOperations(Resource):
    @zeiterfassungapp.marshal_with(person)
    @secured
    def get(self, email):
        """Auslesen einer bestimmten Person-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        pers = adm.get_person_by_email(email)
        return pers


