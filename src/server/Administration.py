from .bo.Person import Person
from .bo.Aktivitaet import Aktivitaet
from .bo.Projekt import Projekt
from .bo.Zeitintervall import Zeitintervall
from .bo.Ereignis import Ereignis

from .db.PersonMapper import PersonMapper
from .db.ProjektMapper import ProjektMapper
from .db.AktivitaetMapper import AktivitaetMapper
from .db.ZeitintervallMapper import ZeitintervallMapper
from .db.EreignisMapper import EreignisMapper
from .db.ArbeitKontoMapper import ArbeitKontoMapper


class Administration(object):

    def __init__(self):
        pass

    """person-spezifische Methoden"""

    def create_person(self, vorname, nachname, email, benutzername, role, google_id):
        """Eine Person anlegen"""
        p = Person()
        p.set_google_id(google_id)
        p.set_vorname(vorname)
        p.set_nachname(nachname)
        p.set_email(email)
        p.set_benutzername(benutzername)
        p.set_role(role)
        p.set_id(1)

        with PersonMapper() as mapper:
            return mapper.insert(p)

    def get_person_by_id(self, id):
        """Die Person mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_key(id)

    def get_person_by_email(self, email):
        """Die Person mit der gegebenen email auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_email(email)

    def get_user_by_google_user_id(self, id):
        """Den Benutzer mit der gegebenen Google ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_google_user_id(id)

    def get_all_person(self):
        """Alle Personen auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_all()

    def get_person_in_projekt(self, projektID):
        """Alle Personen auslesen die ein  Projekt zugewiesen sind."""
        with PersonMapper() as mapper:
            return mapper.find_person_in_projekt(projektID)

    def update_person(self, person):
        """Die gegebene Person speichern."""
        with PersonMapper() as mapper:
            return mapper.update(person)

    def delete_person(self, person):
        """Die gegebenen Person aus unserem System löschen."""
        with PersonMapper() as mapper:
            mapper.delete(person)

    """aktivitaet-spezifische Methoden"""

    def create_aktivitaet(self, name, beschreibung, projektID):
        """Eine Aktivitaet anlegen"""
        p = Aktivitaet()
        p.set_name(name)
        p.set_beschreibung(beschreibung)
        p.set_projektID(projektID)

        with AktivitaetMapper() as mapper:
            return mapper.insert(p)

    def get_aktivitaet_by_id(self, id):
        """"Alle Aktivitaeten mit der gegebenen ID auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_by_key(id)

    def get_aktivitaet_by_name(self, name):
        """"Alle Aktivitaeten mit der gegebenen Name auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_by_name(name)

    def get_aktivitaet_by_projektID(self, projektID):
        """"Alle Aktivitaeten mit der gegebenen ProjektID auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_by_projektID(projektID)

    def get_all_aktivitaet(self):
        """Alle Aktivitaet auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_all()

    def update_aktivitaet(self, aktivitaet):
        """Die gegebene Aktivitaet speichern."""
        with AktivitaetMapper() as mapper:
            return mapper.update(aktivitaet)

    def delete_aktivitaet(self, aktivitaet):
        """Die gegebenen Aktivitaet aus unserem System löschen."""
        with AktivitaetMapper() as mapper:
            mapper.delete(aktivitaet)

    """projekt-spezifische Methoden"""

    def create_projekt(self, name, auftraggeber, beschreibung, personID):
        """Ein Projekt anlegen"""
        p = Projekt()
        p.set_name(name)
        p.set_auftraggeber(auftraggeber)
        p.set_beschreibung(beschreibung)
        p.set_personID(personID)

        with ProjektMapper() as mapper:
            return mapper.insert(p)

    def get_projekt_by_id(self, id):
        """Das Projekt mit der gegebenen ID auslesen."""
        with ProjektMapper() as mapper:
            return mapper.find_by_key(id)

    def get_projekt_by_name(self, name):
        """Alle Projekte mit gegebener name auslesen."""
        with ProjektMapper() as mapper:
            return mapper.find_by_name(name)

    def get_projekt_by_personID(self, personID):
        """Alle Projekte mit gegebener personID auslesen."""
        with ProjektMapper() as mapper:
            return mapper.find_by_personID(personID)

    def get_all_projekt(self):
        """Alle Projekte auslesen."""
        with ProjektMapper() as mapper:
            return mapper.find_all()

    def add_person_to_projekt(self, projektID, personID):
        """Fügt eine Person zu einem Projekt hinzu."""
        with ProjektMapper() as mapper:
            return mapper.fuegt_person_zu_projekt_hinzu(projektID, personID)

    def update_projekt(self, projekt):
        """Die gegebene Projekte speichern."""
        with ProjektMapper() as mapper:
            return mapper.update(projekt)

    def delete_projekt(self, projekt):
        """Die gegebenen Projekte aus unserem System löschen."""
        with ProjektMapper() as mapper:
            mapper.delete(projekt)

    def delete_person_aus_projekt(self, personID, projektID):
        """Die gegebenen Person aus Projekt löschen."""
        with ProjektMapper() as mapper:
            mapper.delete_person_aus_projekt(personID, projektID)

    """zeitintervall-spezifische Methoden"""

    def create_zeitintervall(self, datum, startzeit, endzeit, aktivitaetID, personID):
        """Eine Zeitintervall anlegen"""
        p = Zeitintervall()
        p.set_datum(datum)
        p.set_startzeit(startzeit)
        p.set_endzeit(endzeit)
        p.set_aktivitaetID(aktivitaetID)
        p.set_personID(personID)

        with ZeitintervallMapper() as mapper:
            return mapper.insert(p)

    def get_zeitintervall_by_id(self, id):
        """Die Zeitintervall mit der gegebenen ID auslesen."""
        with ZeitintervallMapper() as mapper:
            return mapper.find_by_key(id)

    def get_zeitintervall_by_aktivitaetID(self, aktivitaetID):
        """Die Zeitintervall mit der gegebenen aktivitaetID auslesen."""
        with ZeitintervallMapper() as mapper:
            return mapper.find_by_aktivitaetID(aktivitaetID)

    def get_zeitintervall_by_personID(self, personID):
        """Die Zeitintervall mit der gegebenen personID auslesen."""
        with ZeitintervallMapper() as mapper:
            return mapper.find_by_personID(personID)

    def get_all_zeitintervall(self):
        """Alle Zeitintervallen auslesen."""
        with ZeitintervallMapper() as mapper:
            return mapper.find_all()

    def update_zeitintervall(self, zeitintervall):
        """Die gegebene Zeitintervall speichern."""
        with ZeitintervallMapper() as mapper:
            return mapper.update(zeitintervall)

    def delete_zeitintervall(self, zeitintervall):
        """Die gegebenen Zeitintervall aus unserem System löschen."""
        with ZeitintervallMapper() as mapper:
            mapper.delete(zeitintervall)

    """ereignis-spezifische Methoden"""

    def create_ereignis(self, type, datum, startzeit, endzeit, personID):
        ereignis = Ereignis()
        ereignis.set_type(type)
        ereignis.set_datum(datum)
        ereignis.set_startzeit(startzeit)
        ereignis.set_endzeit(endzeit)
        ereignis.set_personID(personID)

        with EreignisMapper() as mapper:
            return mapper.insert(ereignis)

    def get_ereignis_by_type(self, type):
        with EreignisMapper() as mapper:
            return mapper.find_by_type(type)

    def get_ereignis_by_personID(self, personID):
        with EreignisMapper() as mapper:
            return mapper.find_by_personID(personID)

    def get_ereignis_by_id(self, id):
        with EreignisMapper() as mapper:
            return mapper.find_by_key(id)

    def get_all_ereignisse(self):
        with EreignisMapper() as mapper:
            return mapper.find_all()

    def update_ereignis(self, ereignis):
        with EreignisMapper() as mapper:
            return mapper.update(ereignis)

    def delete_ereignis(self, ereignis):
        with EreignisMapper() as mapper:
            return mapper.delete(ereignis)

    """ereignis-spezifische Methoden"""

    def get_arbeit_konto(self, personID):
        with ArbeitKontoMapper() as mapper:
            return mapper.find_arbeit_konto_by_key(personID)