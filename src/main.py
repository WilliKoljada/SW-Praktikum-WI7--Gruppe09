'''Unser Service basiert auf Flask'''
from flask import Flask
'''Auf Flask aufbauend nutzen wir RestX'''
from flask_restx import Api, Resource, fields
'''Wir benutzen noch eine Flask-Erweiterung für Cross-Origin Resource Sharing'''
from flask_cors import CORS
'''Wir greifen natürlich auf unsere Applikationslogik inkl. BusinessObject-Klassen zurück'''

from server.bo.Aktivitaet import Aktivitaet
from server.bo.Arbeitszeitkonto import Arbeitszeitkonto
from server.Administration import Administration
from server.bo.Projekt import Projekt
from server.bo.Person import Person
from server.bo.Zeitintervall import Zeitintervall
from server.bo.Zeitintervallbuchung import Zeitintervallbuchung
from server.bo.Projektarbeit import Projektarbeit
from server.bo.Ereignisbuchung import Ereignisbuchung
from server.bo.Ereignis import Ereignis
from server.bo.Buchung import Buchung

'''Außerdem nutzen wir einen selbstgeschriebenen Decorator, der die Authentifikation übernimmt'''
from SecurityDecorator import secured

"""Hier wird Flask instanziert"""
app = Flask(__name__)

"""Flask-Erweiterung für Cross-Origin Resource Sharing"""
CORS(app, resources=r'/zeiterfassungapp/*')

api = Api(app, version='1.0', title='Zeiterfassungapp API',
          description='Eine rudimentäre Demo-Api für Listenerstellung.')

"""Namespaces"""
zeiterfassungapp = api.namespace('Zeiterfassungapp', description="Funktionen der App") #Name der App?

"""Nachfolgend werden analog zu unseren BusinessObject-Klassen transferierbare Strukturen angelegt.
BusinessObject dient als Basisklasse."""

bo = api.model('BusinessObject', {
    'id': fields.Integer(attribute='_id', description='Der Unique Identifier eines Business Object'),
    'creation_date': fields.DateTime(attribute='_creation_date', description='Das Erstellungsdatum eines bo',
                                     dt_format='iso8601')
})

aktivitaet = api.inherit('Aktivitaet', bo, {
    'bezeichnung': fields.String(attribute='_bezeichnung', description='unique Bezeichnung der Aktivitaet'),
    'kapazitaet_in_personentagen': fields.String(attribute='_kapazitaet_in_personentagen', description='Kapazitaet in Personentagen')
})

arbeitszeitkonto = api.inherit('Arbeitszeitkonto', bo, {
    'arbeitspensum': fields.Float(attribute='_arbeitspensum', description='Das Arbeitspensum'),
})

buchung = api.inherit('Buchung', bo, {
    'ersteller': fields.String(attribute='_ersteller', description='Ersteller einer Buchung')

})

person = api.inherit('Person', bo, {
    'vorname': fields.String(attribute='_vorname', description='unique ID des Vornamens'),
    'nachname': fields.String(attribute='_nachname', description='nachname des Nachnamens'),
    'email': fields.String(attribute='_email', description='unique email des der Person'),
    'benutzername': fields.String(attribute='_benutzername', description='benutzername des Benutzernamens')
})

projekt = api.inherit('Projekt', bo, {
    'auftraggeber': fields.String(attribute='_auftraggeber', description='unique ID des Auftraggebers'),
    'bezeichnung': fields.String(attribute='_bezeichnung', description=' Bezeichnung des Projekts ')
})

projektarbeit = api.inherit('Projektarbeit', bo, {
    'bezeichnung': fields.String(attribute='_bezeichnung', description='Bezeichnung der Projektarbeit')
})

zeitintervall = api.inherit('Zeitintervall', bo, {
    'projektlaufzeit': fields.Integer(attribute='_projektlaufzeit', description='Projektlaufzeit')
})

ereignisbuchung = api.inherit('Ereignisbuchung', bo, {
    'ereignisbuchung_id': fields.Integer(attribute= 'ereignisbuchung_id', description='Ereignisbuchung-ID einer Ereignisbuchunguchung')
})

zeitintervallbuchung = api.inherit('Zeitintervallbuchung', bo, {
    '': fields.Integer(attribute= '', description='   ')
})

ereignis = api.inherit('Ereignis', bo, {
    'zeitpunkt_ereigniseintritt': fields.String(attribute= '_zeitpunkt_ereigniseintritt', description='Zeitpunkt vom Ereignis')
})
# Alle weiteren bo´s wie bei Aktivitaet erstellen

@zeiterfassungapp.route('/aktivitaet')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class AktivitaetListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(aktivitaet)
    def get(self):
        """Auslesen aller Aktivitaet-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        akt = adm.get_all_aktivitaet()
        return akt

    @zeiterfassungapp.marshal_with(aktivitaet, code=200)
    @zeiterfassungapp.expect(aktivitaet)  # Wir erwarten ein Aktivitaet-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Aktivitaet-Objekts.
        """
        adm = Administration()

        proposal = Aktivitaet.from_dict(api.payload)

        if proposal is not None:
            akt = adm.create_aktivitaet(proposal.get_bezeichnung(), proposal.get_kapazitaet_in_personentagen())
            return akt, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/aktivitaet/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Aktivitaet-Objekts')
class AktivitaetOperations(Resource):
    @zeiterfassungapp.marshal_with(aktivitaet)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Aktivitaet-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        akt = adm.get_aktivitaet_by_id(id)
        return akt

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Aktivitaet-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        akt = adm.get_aktivitaet_by_id(id)
        adm.delete_aktivitaet(akt)
        return '', 200

    @zeiterfassungapp.marshal_with(aktivitaet)
    @zeiterfassungapp.expect(aktivitaet, validate=True)

    def put(self, id):
        """Update einer bestimmten Aktivitaet.
        """
        adm = Administration()
        p = Aktivitaet.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_aktivitaet(p)
            return '', 200
        else:
            return '', 500

@zeiterfassungapp.route('/buchung')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class AktivitaetListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(buchung)
    def get(self):
        """Auslesen aller Aktivitaet-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        buch = adm.get_alle_buchungen()
        return buch

    @zeiterfassungapp.marshal_with(buchung, code=200)
    @zeiterfassungapp.expect(buchung)  # Wir erwarten ein Aktivitaet-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Aktivitaet-Objekts.
        """
        adm = Administration()

        proposal = Buchung.from_dict(api.payload)

        if proposal is not None:
            buch = adm.create_buchung(proposal.get_ersteller())
            return buch, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/buchung/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Aktivitaet-Objekts')
class AktivitaetOperations(Resource):
    @zeiterfassungapp.marshal_with(buchung)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Aktivitaet-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        buch = adm.get_aktivitaet_by_id(id)
        return buch

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Aktivitaet-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        buch = adm.get_buchung_by_key(id)
        adm.delete_buchung(buch)
        return '', 200

    @zeiterfassungapp.marshal_with(buchung)
    @zeiterfassungapp.expect(buchung, validate=True)

    def put(self, id):
        """Update einer bestimmten Aktivitaet.
        """
        adm = Administration()
        p = Buchung.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_buchung(p)
            return '', 200
        else:
            return '', 500

@zeiterfassungapp.route('/person')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class PersonListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(person)
    def get(self):
        """Auslesen aller Person-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        pers = adm.get_all_person()
        return pers

    @zeiterfassungapp.marshal_with(person, code=200)
    @zeiterfassungapp.expect(person)  # Wir erwarten ein Person-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Person-Objekts.
        """
        adm = Administration()

        proposal = Person.from_dict(api.payload)

        if proposal is not None:
            pers = adm.create_person(proposal.get_google_user_id(), proposal.get_vorname(), proposal.get_nachname(), proposal.get_email(),
                                     proposal.get_benutzername())
            return pers, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/person/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Person-Objekts')
class PersonOperations(Resource):
    @zeiterfassungapp.marshal_with(person)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Person-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        pers = adm.get_person_by_id(id)
        return pers

    #@secured zwecks Testung vom Backend deaktiviert
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

"""@zeiterfassungapp.route('/person/<string:email>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('Email', 'Die Mail des Person-Objekts')
class PersonOperations(Resource):
    @zeiterfassungapp.marshal_with(person)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, email):
        Auslesen einer bestimmten Person-BO.
        Objekt wird durch die id in bestimmt.
        
        adm = Administration()
        pers = adm.get_person_by_email(email)
        return pers"""





# Alle weiteren bo´s wie bei Arbeitszeitkonto erstellen

@zeiterfassungapp.route('/arbeitszeitkonto')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ArbeitszeitkontoListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(arbeitszeitkonto)
    def get(self):
        """Auslesen aller Arbeitszeitkonto-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        arbeit = adm.get_all_arbeitszeitkonto()
        return arbeit

    @zeiterfassungapp.marshal_with(arbeitszeitkonto, code=200)
    @zeiterfassungapp.expect(arbeitszeitkonto)  # Wir erwarten ein Arbeitszeitkonto-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Arbeitszeitkonto-Objekts.
        """
        adm = Administration()

        proposal = Arbeitszeitkonto.from_dict(api.payload)

        if proposal is not None:
            arbeit = adm.create_arbeitszeitkonto(proposal.get_arbeitspensum())
            return arbeit, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/arbeitszeitkonto/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Arbeitszeitkonto-Objekts')
class ArbeitszeitkontoOperations(Resource):
    @zeiterfassungapp.marshal_with(arbeitszeitkonto)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Arbeitszeitkonto-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        arbeit = adm.get_arbeitszeitkonto_by_id(id)
        return arbeit

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Arbeitszeitkonto-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        arbeit = adm.get_arbeitszeitkonto_by_id(id)
        adm.delete_arbeitszeitkonto(arbeit)
        return '', 200

    @zeiterfassungapp.marshal_with(arbeitszeitkonto)
    @zeiterfassungapp.expect(arbeitszeitkonto, validate=True)

    def put(self, id):
        """Update einer bestimmten Arbeitszeitkonto.
        """
        adm = Administration()
        p = Arbeitszeitkonto.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_arbeitszeitkonto(p)
            return '', 200
        else:
            return '', 500

@zeiterfassungapp.route('/arbeitszeitkonto/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die Bezeichnung des Arbeitszeitkonto-Objekts')
class ArbeitszeitkontoOperations(Resource):
    @zeiterfassungapp.marshal_with(arbeitszeitkonto)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Arbeitszeitkonto-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        arbeit = adm.get_arbeitszeitkonto_by_id(id)
        return arbeit

@zeiterfassungapp.route('/ereignis')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class EreignisListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(ereignis)
    def get(self):
        """Auslesen aller Projekt-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        proj = adm.get_all_ereignisse()
        return proj

    @zeiterfassungapp.marshal_with(ereignis, code=200)
    @zeiterfassungapp.expect(ereignis)  # Wir erwarten ein Projekt-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Projekt-Objekts.
        """
        adm = Administration()

        proposal = Ereignis.from_dict(api.payload)

        if proposal is not None:
            ereig = adm.create_ereignis(proposal.get_zeitpunkt_ereigniseintritt())
            return ereig, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500

@zeiterfassungapp.route('/ereignis/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Ereignis-Objekts')
class EreigniskontoOperations(Resource):
    @zeiterfassungapp.marshal_with(ereignis)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Ereignis-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        ereig = adm.get_ereignis_by_id(id)
        return ereig

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Projekt-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        ereig = adm.get_ereignis_by_id(id)
        adm.delete_ereignis(ereig)
        return '', 200

    @zeiterfassungapp.marshal_with(ereignis)
    @zeiterfassungapp.expect(ereignis, validate=True)
    def put(self, id):
        """Update eines bestimmten Projekts.
        """
        adm = Administration()
        p = Ereignis.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_ereignis(p)
            return '', 200
        else:
            return '', 500

# Alle weiteren bo´s wie bei Projekt erstellen

@zeiterfassungapp.route('/projekt')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjektListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(projekt)
    def get(self):
        """Auslesen aller Projekt-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        proj = adm.get_all_projekt()
        return proj

    @zeiterfassungapp.marshal_with(projekt, code=200)
    @zeiterfassungapp.expect(projekt)  # Wir erwarten ein Projekt-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Projekt-Objekts.
        """
        adm = Administration()

        proposal = Projekt.from_dict(api.payload)

        if proposal is not None:
            proj = adm.create_projekt(proposal.get_auftraggeber(), proposal.get_bezeichnung())
            return proj, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/projekt/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Projekt-Objekts')
class ProjektOperations(Resource):
    @zeiterfassungapp.marshal_with(projekt)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Projekt-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        proj = adm.get_projekt_by_id(id)
        return proj

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Projekt-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        proj = adm.get_projekt_by_id(id)
        adm.delete_projekt(proj)
        return '', 200

    @zeiterfassungapp.marshal_with(projekt)
    @zeiterfassungapp.expect(projekt, validate=True)

    def put(self, id):
        """Update eines bestimmten Projekts.
        """
        adm = Administration()
        p = Projekt.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_projekt(p)
            return '', 200
        else:
            return '', 500



# Alle weiteren bo´s wie bei Projektarbeit erstellen

@zeiterfassungapp.route('/projektarbeit')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ProjektarbeitListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(projektarbeit)
    def get(self):
        """Auslesen aller Projektarbeit-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        pa = adm.get_all_projektarbeit()
        return pa

    @zeiterfassungapp.marshal_with(projektarbeit, code=200)
    @zeiterfassungapp.expect(projektarbeit)  # Wir erwarten ein Projektarbeit-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Projektarbeit-Objekts.
        """
        adm = Administration()

        proposal = Projektarbeit.from_dict(api.payload)

        if proposal is not None:
            pa = adm.create_projektarbeit(proposal.get_bezeichnung())
            return pa, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/projektarbeit/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Projektarbeit-Objekts')
class ProjektarbeitOperations(Resource):
    @zeiterfassungapp.marshal_with(projektarbeit)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Projektarbeit-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        pa = adm.get_projektarbeit_by_id(id)
        return pa

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Projektarbeit-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        pa = adm.get_projektarbeit_by_id(id)
        adm.delete_projektarbeit(pa)
        return '', 200

    @zeiterfassungapp.marshal_with(projektarbeit)
    @zeiterfassungapp.expect(projektarbeit, validate=True)

    def put(self, id):
        """Update einer bestimmten Projektarbeit.
        """
        adm = Administration()
        p = Projektarbeit.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.save_projektarbeit(p)
            return '', 200
        else:
            return '', 500


# Alle weiteren bo´s wie bei Zeitintervall erstellen

@zeiterfassungapp.route('/zeitintervall')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ZeitintervallListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(zeitintervall)
    def get(self):
        """Auslesen aller Zeitintervall-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        zin = adm.get_all_zeitintervall()
        return zin

    @zeiterfassungapp.marshal_with(zeitintervall, code=200)
    @zeiterfassungapp.expect(zeitintervall)  # Wir erwarten ein Zeitintervall-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Zeitintervall-Objekts.
        """
        adm = Administration()

        proposal = Zeitintervall.from_dict(api.payload)

        if proposal is not None:
            zin = adm.create_zeitintervall(proposal.get_projektlaufzeit())
            return zin, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/zeitintervall/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Zeitintervall-Objekts')
class ZeitintervallOperations(Resource):
    @zeiterfassungapp.marshal_with(zeitintervall)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Zeitintervall-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        zin = adm.get_zeitintervall_by_id(id)
        return zin

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Zeitintervall-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        zin = adm.get_zeitintervall_by_id(id)
        adm.delete_zeitintervall(zin)
        return '', 200

    @zeiterfassungapp.marshal_with(zeitintervall)
    @zeiterfassungapp.expect(zeitintervall, validate=True)

    def put(self, id):
        """Update einer bestimmten Zeitintervall.
        """
        adm = Administration()
        zi = Zeitintervall.from_dict(api.payload)

        if zi is not None:
            zi.set_id(id)
            adm.save_zeitintervall(zi)
            return '', 200
        else:
            return '', 500


# Alle weiteren bo´s wie bei Zeitintervall erstellen

@zeiterfassungapp.route('/zeitintervallbuchung')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class ZeitintervallbuchungListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(zeitintervallbuchung)
    def get(self):
        """Auslesen aller Zeitintervallbuchung-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        zinb = adm.get_all_zeitintervallbuchung()
        return zinb

    @zeiterfassungapp.marshal_with(zeitintervallbuchung, code=200)
    @zeiterfassungapp.expect(zeitintervallbuchung)  # Wir erwarten ein Zeitintervallbuchung-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Zeitintervallbuchung-Objekts.
        """
        adm = Administration()

        proposal = Zeitintervallbuchung.from_dict(api.payload)

        if proposal is not None:
            zinb = adm.create_zeitintervallbuchung()
            return zinb, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/zeitintervallbuchung/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Zeitintervallbuchung-Objekts')
class ZeitintervallbuchungOperations(Resource):
    @zeiterfassungapp.marshal_with(zeitintervallbuchung)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Zeitintervallbuchung-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        zinb = adm.get_zeitintervallbuchung_by_id(id)
        return zinb

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Zeitintervallbuchung-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        zinb = adm.get_zeitintervallbuchung_by_id(id)
        adm.delete_zeitintervallbuchung(zinb)
        return '', 200

    @zeiterfassungapp.marshal_with(zeitintervallbuchung)
    @zeiterfassungapp.expect(zeitintervallbuchung, validate=True)

    def put(self, id):
        """Update einer bestimmten Zeitintervallbuchung.
        """
        adm = Administration()
        zinv = Zeitintervallbuchung.from_dict(api.payload)

        if zinv is not None:
            zinv.set_id(id)
            adm.save_zeitintervallbuchung(zinv)
            return '', 200
        else:
            return '', 500

# Alle weiteren bo´s wie bei Ereignisbuchung erstellen

@zeiterfassungapp.route('/ereignisbuchung')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
class EreignisbuchungListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(ereignisbuchung)
    def get(self):
        """Auslesen aller Ereignisbuchung-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        zinb = adm.get_all_ereignisbuchung()
        return zinb

    @zeiterfassungapp.marshal_with(ereignisbuchung, code=200)
    @zeiterfassungapp.expect(ereignisbuchung)  # Wir erwarten ein Ereignisbuchung-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Ereignisbuchung-Objekts.
        """
        adm = Administration()

        proposal = Ereignisbuchung.from_dict(api.payload)

        if proposal is not None:
            zinb = adm.create_Ereignisbuchung()
            return zinb, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return '', 500


@zeiterfassungapp.route('/ereignisbuchung/<int:id>')
@zeiterfassungapp.response(500, 'Falls es zu einem Server-seitigen Fehler kommt.')
@zeiterfassungapp.param('id', 'Die ID des Ereignisbuchung-Objekts')
class EreignisbuchungOperations(Resource):
    @zeiterfassungapp.marshal_with(ereignisbuchung)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, id):
        """Auslesen einer bestimmten Ereignisbuchung-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        zinb = adm.get_ereignisbuchung_by_id(id)
        return zinb

    #@secured zwecks Testung vom Backend deaktiviert
    def delete(self, id):
        """Löschen einer bestimmten Ereignisbuchung-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        zinb = adm.get_ereignisbuchung_by_id(id)
        adm.delete_ereignisbuchung(zinb)
        return '', 200

    @zeiterfassungapp.marshal_with(ereignisbuchung)
    @zeiterfassungapp.expect(ereignisbuchung, validate=True)

    def put(self, id):
        """Update einer bestimmten Ereignisbuchung.
        """
        adm = Administration()
        zinv = Ereignisbuchung.from_dict(api.payload)

        if zinv is not None:
            zinv.set_id(id)
            adm.save_ereignisbuchung(zinv)
            return '', 200
        else:
            return '', 500

# Alle weiteren bo´s wie bei Zeitintervall erstellen


    """
    Nachdem wir nun sämtliche Resourcen definiert haben, die wir via REST bereitstellen möchten,
    müssen nun die App auch tatsächlich zu starten.

    Diese Zeile ist leider nicht Teil der Flask-Doku! In jener Doku wird von einem Start via Kommandozeile ausgegangen.
    Dies ist jedoch für uns in der Entwicklungsumgebung wenig komfortabel. Deshlab kommt es also schließlich zu den 
    folgenden Zeilen. 

    **ACHTUNG:** Diese Zeile wird nur in der lokalen Entwicklungsumgebung ausgeführt und hat in der Cloud keine Wirkung!
    """
    if __name__ == '__main__':
        app.run(debug=True)