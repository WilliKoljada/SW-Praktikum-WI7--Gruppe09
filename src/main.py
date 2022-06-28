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
    "creation_date": fields.DateTime(attribute="_creation_date", description="Das Erstellungsdatum eines bo",
                                     dt_format="iso8601")
})

aktivitaet = api.inherit("Aktivitaet", bo, {
    "name": fields.String(attribute="_name", description="der Name der Aktivitaet"),
    "beschreibung": fields.String(attribute="_beschreibung", description="die Beschreibung der Aktivitaet"),
    "dauert": fields.String(attribute="_dauert", description="die Dauert der Aktivitaet"),
    "projektID": fields.Integer(attribute="_projektID", description="der ID des Projekt zum dem die Aktivitaet gehört")
})

konto = api.inherit("Aktivitaet", bo, {
    "arbeit": fields.String(attribute="_arbeit", description="die Arbeitzeit der Person"),
    "pause": fields.String(attribute="_pause", description="die Pausezeit der Person"),
    "urlaub": fields.String(attribute="_urlaub", description="die Urlaubzeit der Person"),
    "krankheit": fields.String(attribute="_krankheit", description="die Krankheitzeit der Person")
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
    "name": fields.String(attribute="_name", description="Name des Projekt"),
    "auftraggeber": fields.String(attribute="_auftraggeber", description="Auftraggeber des Projekt"),
    "beschreibung": fields.String(attribute="_beschreibung", description="die Beschreibung des Projekts"),
    "kapazitaet": fields.String(attribute="_kapazitaet", description="die Kapazitaet des Projekts"),
    "personID": fields.Integer(attribute= "_personID", description="ID des Erstellers vom Projekt(auftraggeber)")
})

zeitintervall = api.inherit("Zeitintervall", bo, {
    "datum": fields.String(attribute="_datum", description="Datum des Zeitintervall"),
    "startzeit": fields.String(attribute="_startzeit", description="Begin Zeit des Zeitintervall"),
    "endzeit": fields.String(attribute="_endzeit", description="End Zeit des Zeitintervall"),
    "aktivitaetID": fields.Integer(attribute= "aktivitaetID", description="aktivitaet ID des Zeitintervall"),
    "personID": fields.Integer(attribute= "_personID", description="ID des Erstellers vom Zeitintervall")
})

ereignis = api.inherit("Ereignis", bo, {
    "type": fields.String(attribute= "_type", description="Type des Ereignis"),
    "datum": fields.String(attribute="_datum", description="Datum des Ereignis"),
    "startzeit": fields.String(attribute="_startzeit", description="Begin Zeit des Ereignis"),
    "endzeit": fields.String(attribute="_endzeit", description="End Zeit des Ereignis"),
    "personID": fields.Integer(attribute= "_personID", description="person ID des Ereignis")
})
# Alle weiteren bo´s wie bei Aktivitaet erstellen

@zeiterfassungapp.route("/aktivitaet")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
class AktivitaetListOperations(Resource):
    @zeiterfassungapp.marshal_list_with(aktivitaet)
    @secured
    def get(self):
        """Auslesen aller Aktivitaet-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        akt = adm.get_all_aktivitaet()
        return akt

    @zeiterfassungapp.marshal_with(aktivitaet, code=200)
    @zeiterfassungapp.expect(aktivitaet)  # Wir erwarten ein Aktivitaet-Objekt von Client-Seite.
    @secured
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
    @secured
    def get(self, id):
        """Auslesen einer bestimmten Aktivitaet-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        akt = adm.get_aktivitaet_by_id(id)
        return akt

    @secured
    def delete(self, id):
        """Löschen einer bestimmten Aktivitaet-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        adm.delete_aktivitaet(id)
        return "", 200

    @zeiterfassungapp.marshal_with(aktivitaet)
    @zeiterfassungapp.expect(aktivitaet, validate=True)
    @secured
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
    @secured
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
    @zeiterfassungapp.marshal_list_with(person)
    @secured
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
        adm.delete_person(id)
        return "", 200

    @zeiterfassungapp.marshal_with(person)
    @zeiterfassungapp.expect(person)
    @secured
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


@zeiterfassungapp.route("/person-by-google-id/<string:google_id>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("google_id", "Die Google Id des Person-Objekts")
class PersonGoogleIdOperations(Resource):
    @zeiterfassungapp.marshal_with(person)
    @secured
    def get(self, google_id):
        """Auslesen einer bestimmten Person-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        person = adm.get_user_by_google_user_id(google_id)
        return person


@zeiterfassungapp.route("/person-by-email/<string:email>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("email", "Die Email des Person-Objekts")
class PersonEmailOperations(Resource):
    @zeiterfassungapp.marshal_with(person)
    @secured
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
    @zeiterfassungapp.marshal_list_with(ereignis)
    @secured
    def get(self):
        """Auslesen aller Ereignis-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        proj = adm.get_all_ereignisse()
        return proj

    @zeiterfassungapp.marshal_with(ereignis, code=200)
    @zeiterfassungapp.expect(ereignis)  # Wir erwarten ein Ereignis-Objekt von Client-Seite.
    @secured
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
    @secured
    def get(self, id):
        """Auslesen einer bestimmten Ereignis-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        ereig = adm.get_ereignis_by_id(id)
        return ereig

    @secured
    def delete(self, id):
        """Löschen einer bestimmten Projekt-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        adm.delete_ereignis(id)
        return "", 200

    @zeiterfassungapp.marshal_with(ereignis)
    @zeiterfassungapp.expect(ereignis, validate=True)
    @secured
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
    @secured
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
    @zeiterfassungapp.marshal_list_with(projekt)
    @secured
    def get(self):
        """Auslesen aller Projekt-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        proj = adm.get_all_projekt()
        return proj

    @zeiterfassungapp.marshal_with(projekt, code=200)
    @zeiterfassungapp.expect(projekt)  # Wir erwarten ein Projekt-Objekt von Client-Seite.
    @secured
    def post(self):
        """Anlegen eines neuen Projekt-Objekts.
        """
        adm = Administration()

        proposal = Projekt.from_dict(api.payload)

        if proposal is not None:
            proj = adm.create_projekt(proposal.get_name(), proposal.get_auftraggeber(), proposal.get_beschreibung(), proposal.get_personID())
            return proj, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return "", 500


@zeiterfassungapp.route("/projekt/<int:id>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("id", "Die ID des Projekt-Objekts")
class ProjektOperations(Resource):
    @zeiterfassungapp.marshal_with(projekt)
    @secured
    def get(self, id):
        """Auslesen einer bestimmten Projekt-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        proj = adm.get_projekt_by_id(id)
        return proj

    @secured
    def delete(self, id):
        """Löschen einer bestimmten Projekt-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        adm.delete_projekt(id)
        return "", 200

    @zeiterfassungapp.marshal_with(projekt)
    @zeiterfassungapp.expect(projekt, validate=True)
    @secured
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

# Alle weiteren bo´s wie bei Zeitintervall erstellen

@zeiterfassungapp.route("/zeitintervall")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
class ZeitintervallListOperations(Resource):
    @zeiterfassungapp.marshal_list_with(zeitintervall)
    @secured
    def get(self):
        """Auslesen aller Zeitintervall-Objekte.
        Sollten keine Customer-Objekte verfügbar sein, so wird eine leere Sequenz zurückgegeben."""
        adm = Administration()
        zin = adm.get_all_zeitintervall()
        return zin

    @zeiterfassungapp.marshal_with(zeitintervall, code=200)
    @zeiterfassungapp.expect(zeitintervall)  # Wir erwarten ein Zeitintervall-Objekt von Client-Seite.
    @secured
    def post(self):
        """Anlegen eines neuen Zeitintervall-Objekts.
        """
        adm = Administration()

        proposal = Zeitintervall.from_dict(api.payload)

        if proposal is not None:
            zin = adm.create_zeitintervall(proposal.get_datum(), proposal.get_startzeit(), proposal.get_endzeit(),
                                           proposal.get_aktivitaetID(), proposal.get_personID())
            return zin, 200
        else:
            # Wenn irgendetwas schiefgeht, dann geben wir nichts zurück und werfen einen Server-Fehler.
            return "", 500


@zeiterfassungapp.route("/zeitintervall/<int:id>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("id", "Die ID des Zeitintervall-Objekts")
class ZeitintervallOperations(Resource):
    @zeiterfassungapp.marshal_with(zeitintervall)
    @secured
    def get(self, id):
        """Auslesen einer bestimmten Zeitintervall-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        zin = adm.get_zeitintervall_by_id(id)
        return zin

    @secured
    def delete(self, id):
        """Löschen einer bestimmten Zeitintervall-BO.
        Löschende Objekt wird durch id bestimmt.
        """
        adm = Administration()
        adm.delete_zeitintervall(id)
        return "", 200

    @zeiterfassungapp.marshal_with(zeitintervall)
    @zeiterfassungapp.expect(zeitintervall, validate=True)
    @secured
    def put(self, id):
        """Update einer bestimmten Zeitintervall.
        """
        adm = Administration()
        zi = Zeitintervall.from_dict(api.payload)

        if zi is not None:
            zi.set_id(id)
            adm.update_zeitintervall(zi)
            return zi, 200
        else:
            return "", 500


@zeiterfassungapp.route("/zeitintervall/<int:aktivitaetID>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("aktivitaetID", "Der aktivitaet id des Zeitintervall-Objekts")
class ZeintervallAktivitaetIDOperations(Resource):
    @zeiterfassungapp.marshal_with(zeitintervall)
    @secured
    def get(self, aktivitaetID):
        """Auslesen einer bestimmten Zeitintervall-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        zi = adm.get_zeitintervall_by_aktivitaetID(aktivitaetID)
        return zi


@zeiterfassungapp.route("/zeitintervall/<int:personID>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("personID", "Der Person id des Zeitintervall-Objekts")
class ZeintervallPersonIDOperations(Resource):
    @zeiterfassungapp.marshal_with(zeitintervall)
    @secured
    def get(self, personID):
        """Auslesen einer bestimmten Zeitintervall-BO.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        zi = adm.get_zeitintervall_by_personID(personID)
        return zi


@zeiterfassungapp.route("/arbeitkonto/<int:personID>")
@zeiterfassungapp.response(500, "Falls es zu einem Server-seitigen Fehler kommt.")
@zeiterfassungapp.param("personID", "Der Person id des Zeitintervall-Objekts")
class ArbeitKontoOperations(Resource):
    @zeiterfassungapp.marshal_with(konto)
    @secured
    def get(self, personID):
        """Auslesen einer Arbeitkonto einer person.
        Objekt wird durch die id in bestimmt.
        """
        adm = Administration()
        konto = adm.get_arbeit_konto(personID)
        return konto


"""
Nachdem wir nun sämtliche Resourcen definiert haben, die wir via REST bereitstellen möchten,
müssen nun die App auch tatsächlich zu starten.
Diese Zeile ist leider nicht Teil der Flask-Doku! In jener Doku wird von einem Start via Kommandozeile ausgegangen.
Dies ist jedoch für uns in der Entwicklungsumgebung wenig komfortabel. Deshlab kommt es also schließlich zu den 
folgenden Zeilen. 
**ACHTUNG:** Diese Zeile wird nur in der lokalen Entwicklungsumgebung ausgeführt und hat in der Cloud keine Wirkung!
"""
if __name__ == "__main__":
    app.run(debug=True)