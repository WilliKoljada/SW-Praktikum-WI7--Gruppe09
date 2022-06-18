"""
A. Allgemeine Hinweise zu diesem Module:

Normalerweise würde man eine Datei dieser Länge bzw. ein Module
dieser Größe in mehrere Dateien bzw. Modules untergliedern. So könnte
man z.B. pro Resource Class ein eigenes Module anlegen. Dadurch
ergäben sich erhebliche Vorteile bzgl. der Wartungsfreundlichkeit
dieses Modules. Es ergäben sich aber auch Nachteile! So haben Sie
etwa mit einer Reihe von Abhängigkeiten z.B. zwischen der API-Definition
und den Decorators zu tun. Außerdem verschlechtert sich aufgrund der Länge
der Datei die Übersichtlichkeit der Inhalte und Strukturen.

Abgesehen von Lehrbüchern und Vorlesungen müssen Sie in realen Projekten
häufig die Vor- und Nachteile von Entscheidungen abwägen und sich dann
bewusst für einen Weg entscheiden. Hier wurde die Entscheidung getroffen,
die Einfachheit und Verständlichkeit des Source Codes höher zu werten als
die Optimierung des Kopplungsgrads und damit die Wartbarkeit des Modules.

B. Konventionen für dieses Module:

    B.1. HTTP response status codes:

        Folgende Codes werden verwendet:
        200 OK           :      bei erfolgreichen requests. Af die Verwendung von
                                weiter differenzierenden Statusmeldungen wie etwa
                                '204 No Content' für erfolgreiche requests, die
                                außer evtl. im Header keine weiteren Daten zurückliefern,
                                wird in dieser Fallstudie auch aus Gründen einer
                                möglichst einfachen Umsetzung verzichtet.
        401 Unauthorized :      falls der User sich nicht gegenüber dem System
                                authentisiert hat und daher keinen Zugriff erhält.
        404 Not Found    :      falls eine angefragte Resource nicht verfügbar ist
        500 Internal Server Error : falls der Server einen Fehler erkennt,
                                diesen aber nicht genauer zu bearbeiten weiß.

    B.2. Name des Moduls:
        Der Name dieses Moduls lautet main.py. Grund hierfür ist, dass Google
        App Engine, diesen Namen bevorzugt und sich dadurch das Deployment
        einfacher gestaltet. Natürlich wären auch andere Namen möglich. Dies
        wäre aber mit zusätzlichem Konfigurationsaufwand in der Datei app.yaml
        verbunden.
"""

"""Unser Service basiert auf Flask"""
from inspect import Attribute
from flask import Flask
"""Auf Flask aufbauend nutzen wir RestX"""
from flask_restx import Api, Resource, fields
"""Wir benutzen noch eine Flask-Erweiterung für Cross-Origin Resource Sharing"""
from flask_cors import CORS
"""Wir greifen natürlich auf unsere Applikationslogik inkl. BusinessObject-Klassen zurück"""

from server.bo.Aktivitaet import Aktivitaet
from server.Administration import Administration
from server.bo.Projekt import Projekt
from server.bo.Person import Person
from server.bo.Zeitintervall import Zeitintervall
from server.bo.Ereignis import Ereignis

"""Außerdem nutzen wir einen selbstgeschriebenen Decorator, der die Authentifikation übernimmt"""
from SecurityDecorator import secured

"""Hier wird Flask instanziert"""
app = Flask(__name__)

"""Flask-Erweiterung für Cross-Origin Resource Sharing"""
CORS(app, resources=r"/zeiterfassungapp/*")

api = Api(app, version="1.0", title="Zeiterfassungapp API",
          description="Eine rudimentäre Demo-Api für Listenerstellung.")

"""Namespaces"""
zeiterfassungapp = api.namespace("Zeiterfassungapp", description="Funktionen der App") #Name der App?

"""Nachfolgend werden analog zu unseren BusinessObject-Klassen transferierbare Strukturen angelegt.
BusinessObject dient als Basisklasse."""

bo = api.model("BusinessObject", {
    "id": fields.Integer(attribute="_id", description="Der Unique Identifier eines Business Object"),
    #"creation_date": fields.DateTime(attribute="_creation_date", description="Das Erstellungsdatum eines bo",
    #                                 dt_format="iso8601")
})

aktivitaet = api.inherit("Aktivitaet", bo, {
    "name": fields.String(attribute="_name", description="der NAme der Aktivitaet"),
    "beschreibung": fields.String(attribute="_beschreibung", description="die Beschreibung der Aktivitaet"),
    "projektID": fields.Integer(attribute="_projektID", description="der ID des Projekt zum dem die Aktivitaet gehört")
})

person = api.inherit("Person", bo, {
    "vorname": fields.String(attribute="_vorname", description="Vornamen der Person"),
    "nachname": fields.String(attribute="_nachname", description="nachname der Person"),
    "email": fields.String(attribute="_email", description="unique email des der Person"),
    "benutzername": fields.String(attribute="_benutzername", description="benutzername der Person"),
    "role": fields.String(attribute="_role", description="role der Person"),
    "google_id": fields.String(attribute="_google_id", description="google_id der Person")
})

projekt = api.inherit("Projekt", bo, {
    "name": fields.String(attribute="_name", description="name des Projekt"),
    "beschreibung": fields.String(attribute="_beschreibung", description="die Beschreibung des Projekts"),
    "personID": fields.Integer(attribute= "personID", description="ID des Erstellers vom Projekt(auftraggeber)")
})

zeitintervall = api.inherit("Zeitintervall", bo, {
    "datum": fields.Date(attribute="_datum", description="Datum des Zeitintervall"),
    "startzeit": fields.DateTime(attribute="_startzeit", description="Begin Zeit des Zeitintervall"),
    "endzeit": fields.DateTime(attribute="_endzeit", description="End Zeit des Zeitintervall"),
    "aktivitaetID": fields.Integer(attribute= "aktivitaetID", description="aktivitaet ID des Zeitintervall"),
    "personID": fields.Integer(attribute= "personID", description="ID des Erstellers vom Zeitintervall")
})

ereignis = api.inherit("Ereignis", bo, {
    "type": fields.String(attribute= "_type", description="Type des Ereignis"),
    "datum": fields.Date(attribute="_datum", description="Datum des Ereignis"),
    "startzeit": fields.DateTime(attribute="_startzeit", description="Begin Zeit des Ereignis"),
    "endzeit": fields.DateTime(attribute="_endzeit", description="End Zeit des Ereignis"),
    "personID": fields.Integer(attribute= "personID", description="person ID des Ereignis")
})
# Alle weiteren bo´s wie bei Aktivitaet erstellen

@zeiterfassungapp.route("/aktivitaet")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
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
            akt = adm.create_aktivitaet(proposal.get_name(), proposal.get_beschreibung(), proposal.get_projektID())
            return akt, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return "", 500


@zeiterfassungapp.route("/aktivitaet/<int:id>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("id", "Die ID des Aktivitaet-Objekts")
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
        adm.delete_aktivitaet(id)
        return "", 200

    @zeiterfassungapp.marshal_with(aktivitaet)
    @zeiterfassungapp.expect(aktivitaet, validate=True)
    def put(self, id):
        """Update einer bestimmten Aktivitaet.
        """
        adm = Administration()
        p = Aktivitaet.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.update_aktivitaet(p)
            return p, 200
        else:
            return "", 500


@zeiterfassungapp.route("/aktivitaet/<string:name>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("name", "Der Name des Aktivitaet-Objekts")
class AktivitaetNameOperations(Resource):
    @zeiterfassungapp.marshal_with(aktivitaet)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, name):
        """Auslesen einer bestimmten Aktivitaet-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        akt = adm.get_aktivitaet_by_name(name)
        return akt

@zeiterfassungapp.route("/person")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
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
            pers = adm.create_person(proposal.get_vorname(), proposal.get_nachname(), proposal.get_email(),
                                     proposal.get_benutzername(), proposal.get_role(), proposal.get_google_id())
            return pers, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return "", 500

@zeiterfassungapp.route("/person/<int:id>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("id", "Die ID des Person-Objekts")
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
        adm.delete_person(id)
        return "", 200

    @zeiterfassungapp.marshal_with(person)
    @zeiterfassungapp.expect(person, validate=True)
    def put(self, id):
        """Update einer bestimmten Person.
        """
        adm = Administration()
        p = Person.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.update_person(p)
            return p, 200
        else:
            return "", 500


@zeiterfassungapp.route("/person/<string:email>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("email", "Die Email des Person-Objekts")
class PersonEmailOperations(Resource):
    @zeiterfassungapp.marshal_with(person)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, email):
        """Auslesen einer bestimmten Person-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        person = adm.get_person_by_email(email)
        return person





@zeiterfassungapp.route("/ereignis")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
class EreignisListOperations(Resource):
    #@secured zwecks Testung vom Backend deaktiviert
    @zeiterfassungapp.marshal_list_with(ereignis)
    def get(self):
        """Auslesen aller Ereignis-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        proj = adm.get_all_ereignisse()
        return proj

    @zeiterfassungapp.marshal_with(ereignis, code=200)
    @zeiterfassungapp.expect(ereignis)  # Wir erwarten ein Ereignis-Objekt von Client-Seite.
    #@secured zwecks Testung vom Backend deaktiviert
    def post(self):
        """Anlegen eines neuen Projekt-Objekts.
        """
        adm = Administration()

        proposal = Ereignis.from_dict(api.payload)

        if proposal is not None:
            ereig = adm.create_ereignis(proposal.get_type(), proposal.get_datum(), proposal.get_startzeit(),
                                        proposal.get_endzeit(), proposal.get_personID())
            return ereig, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return "", 500

@zeiterfassungapp.route("/ereignis/<int:id>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("id", "Die ID des Ereignis-Objekts")
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
        adm.delete_ereignis(id)
        return "", 200

    @zeiterfassungapp.marshal_with(ereignis)
    @zeiterfassungapp.expect(ereignis, validate=True)
    def put(self, id):
        """Update eines bestimmten Projekts.
        """
        adm = Administration()
        p = Ereignis.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.update_ereignis(p)
            return p, 200
        else:
            return "", 500


@zeiterfassungapp.route("/ereignis/<string:type>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("type", "Der Type des Ereignis-Objekts")
class EreignisTypeOperations(Resource):
    @zeiterfassungapp.marshal_with(ereignis)
    #@secured zwecks Testung vom Backend deaktiviert
    def get(self, type):
        """Auslesen einer bestimmten Aktivitaet-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        ereignis = adm.get_ereignis_by_type(type)
        return ereignis

@zeiterfassungapp.route("/projekt")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
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
            proj = adm.create_projekt(proposal.get_name(), proposal.get_beschreibung(), proposal.get_personID())
            return proj, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return "", 500


@zeiterfassungapp.route("/projekt/<int:id>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("id", "Die ID des Projekt-Objekts")
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
        adm.delete_projekt(id)
        return "", 200

    @zeiterfassungapp.marshal_with(projekt)
    @zeiterfassungapp.expect(projekt, validate=True)
    def put(self, id):
        """Update eines bestimmten Projekts.
        """
        adm = Administration()
        p = Projekt.from_dict(api.payload)

        if p is not None:
            p.set_id(id)
            adm.update_projekt(p)
            return p, 200
        else:
            return "", 500



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