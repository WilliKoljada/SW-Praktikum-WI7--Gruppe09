from .bo.Person import Person
from .bo.Aktivitaet import Aktivitaet
from .bo.Arbeitszeitkonto import Arbeitszeitkonto
from .bo.Projektarbeit import Projektarbeit
from .bo.Projekt import Projekt
from .bo.Zeitintervallbuchung import Zeitintervallbuchung
from .bo.Zeitintervall import Zeitintervall
from .bo.Buchung import Buchung
from .bo.Ereignis import Ereignis
from .bo.Ereignisbuchung import Ereignisbuchung


from .db.PersonMapper import PersonMapper
from .db.ProjektMapper import ProjektMapper
from .db.ProjektarbeitMapper import ProjektarbeitMapper
from .db.AktivitaetMapper import AktivitaetMapper
from .db.ArbeitszeitkontoMapper import ArbeitszeitkontoMapper
from .db.ZeitintervallMapper import ZeitintervallMapper
from .db.ZeitintervallbuchungMapper import ZeitintervallbuchungMapper
from .db.EreignisMapper import EreignisMapper
from .db.BuchungMapper import BuchungMapper
from .db.EreignisbuchungMapper import EreignisbuchungMapper

class Administration(object):

    def __init__(self):
        pass

    """person-spezifische Methoden"""

    def create_person(self, creation_time , vorname, nachname, email, benutzername):
        """Eine Person anlegen"""
        p = Person()
        p.set_id(1)
        p.set_creation_time(creation_time)
        p.set_vorname(vorname)
        p.set_nachname(nachname)
        p.set_email(email)
        p.set_benutzername(benutzername)

        with PersonMapper() as mapper:
            return mapper.insert(p)

    def get_person_by_vorname(self, vorname):
        """"Alle Personen mit Namen name auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_vorname(vorname)

    def get_person_by_id(self, id):
        """Die Person mit der gegebenen ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_id(id)

    def get_person_by_nachname(self, nachname):
        """Alle Personen mit gegebener Rolle auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_person_by_nachname(nachname)

    def get_person_by_email(self, email):
        """Die Person mit der gegebenen email auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_email(email)

    def get_person_by_benutzername(self, benutzername):
        """Die Person mit der gegebenen Google ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_benutzername(benutzername)

    def get_user_by_google_user_id(self, id):
        """Den Benutzer mit der gegebenen Google ID auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_by_google_user_id(id)

    def get_all_person(self):
        """Alle Personen auslesen."""
        with PersonMapper() as mapper:
            return mapper.find_all()

    def save_person(self, person):
        """Die gegebene Person speichern."""
        with PersonMapper() as mapper:
            return mapper.update(person)

    def delete_person(self, person):
        """Die gegebenen Person aus unserem System löschen."""
        with PersonMapper() as mapper:
            mapper.delete(person)


    """aktivitaet-spezifische Methoden"""

    def create_aktivitaet(self, id, creation_time, bezeichnung, kapazitaet_in_personentagen):
        """Eine Aktivitaet anlegen"""
        p = Aktivitaet()
        p.set_id(1)
        p.set_creation_time(creation_time)
        p.set_bezeichnung(bezeichnung)
        p.set_kapazitaet_in_personentagen(kapazitaet_in_personentagen)

        with AktivitaetMapper() as mapper:
            return mapper.insert(p)

    def get_aktivitaet_by_id(self, id):
        """"Alle Aktivitaeten mit der gegebenen ID auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_by_id(id)

    def get_aktivitaet_by_creation_time(self, creation_time):
        """Die Aktivitaeten mit der gegebenen Zeit der Aenderung auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_by_creation_time(creation_time)

    def get_aktivitaet_by_bezeichnung(self, bezeichnung):
        """Alle Aktivitaeten mit gegebener Bezeichnung auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_aktivitaet_by_bezeichnung(bezeichnung)

    def get_aktivitaet_by_kapazitaet_in_personentagen(self, kapazitaet_in_personentagen):
        """Die Aktivitaet mit der gegebenen Kapazitaet auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_by_kapazitaet_in_personentagen(kapazitaet_in_personentagen)

    def get_all_aktivitaet(self):
        """Alle Aktivitaet auslesen."""
        with AktivitaetMapper() as mapper:
            return mapper.find_all()

    def save_aktivitaet(self, aktivitaet):
        """Die gegebene Aktivitaet speichern."""
        with AktivitaetMapper() as mapper:
            return mapper.update(aktivitaet)

    def delete_aktivitaet(self, aktivitaet):
        """Die gegebenen Aktivitaet aus unserem System löschen."""
        with AktivitaetMapper() as mapper:
            mapper.delete(aktivitaet)


    """arbeitszeitkonto-spezifische Methoden"""

    def create_arbeitszeitkonto(self, id, creation_time):
        """Ein Arbeitszeitkonto anlegen"""
        p = Arbeitszeitkonto()
        p.set_id(1)
        p.set_creation_time(creation_time)


        with Arbeitszeitkonto() as mapper:
            return mapper.insert(p)

    def get_arbeitszeitkonto_by_id(self, id):
        """"Alle Arbeitszeitkonten mit der gegebenen ID auslesen."""
        with ArbeitszeitkontoMapper() as mapper:
            return mapper.find_by_id(id)

    def get_arbeitszeitkonto_by_creation_time(self, creation_time):
        """Die Arbeitszeitkonten mit der gegebenen Zeit der Aenderung auslesen."""
        with ArbeitszeitkontoMapper() as mapper:
            return mapper.find_by_creation_time(creation_time)


    def get_all_arbeitszeitkonto(self):
        """Alle Arbeitszeitkonten auslesen."""
        with ArbeitszeitkontoMapper() as mapper:
            return mapper.find_all()

    def save_arbeitszeitkonto(self, arbeitszeitkonto):
        """Die gegebenen Arbeitszeitkonten speichern."""
        with ArbeitszeitkontoMapper() as mapper:
            return mapper.update(arbeitszeitkonto)

    def delete_arbeitszeitkonto(self, arbeitszeitkonto):
        """Die gegebenen Arbeitszeitkonten aus unserem System löschen."""
        with ArbeitszeitkontoMapper() as mapper:
            mapper.delete(arbeitszeitkonto)


    """projektarbeit-spezifische Methoden"""


    def create_projektarbeit(self, id, bezeichnung):
        """Eine Projektarbeit anlegen"""
        p = Projektarbeit()
        p.set_id(1)
        p.set_bezeichnung(bezeichnung)

        with ProjektarbeitMapper() as mapper:
            return mapper.insert(p)


    def get_projektarbeit_by_id(self, id):
        """Die Projektarbeit mit der gegebenen ID auslesen."""
        with ProjektarbeitMapper() as mapper:
            return mapper.find_by_id(id)


    def get_projektarbeit_by_bezeichnung(self, bezeichnung):
        """Alle Projektarbeiten mit gegebener Rolle auslesen."""
        with ProjektarbeitMapper() as mapper:
            return mapper.find_projektarbeit_by_bezeichnung(bezeichnung)


    def get_all_projektarbeit(self):
        """Alle Projektarbeiten auslesen."""
        with ProjektarbeitMapper() as mapper:
            return mapper.find_all()


    def save_projektarbeit(self, projektarbeit):
        """Die gegebene Projektarbeiten speichern."""
        with ProjektarbeitMapper() as mapper:
            return mapper.update(projektarbeit)


    def delete_projektarbeit(self, projektarbeit):
        """Die gegebenen Projektarbeiten aus unserem System löschen."""
        with ProjektarbeitMapper() as mapper:
            mapper.delete(projektarbeit)

    """projekt-spezifische Methoden"""

    def create_projekt(self, creation_time , id, auftraggeber, bezeichnung):
        """Ein Projekt anlegen"""
        p = Projekt()
        p.set_id(1)
        p.set_creation_time(creation_time)
        p.set_auftraggeber(auftraggeber)
        p.set_bezeichnung(bezeichnung)

        with ProjektMapper() as mapper:
            return mapper.insert(p)

    def get_projekt_by_auftraggeber(self, auftraggeber):
        """"Alle Projekte mit Namen name auslesen."""
        with ProjektMapper() as mapper:
            return mapper.find_by_auftraggeber(auftraggeber)

    def get_projekt_by_id(self, id):
        """Das Projekt mit der gegebenen ID auslesen."""
        with ProjektMapper() as mapper:
            return mapper.find_by_id(id)

    def get_projekt_by_bezeichnung(self, bezeichnung):
        """Alle Projekte mit gegebener Rolle auslesen."""
        with ProjektMapper() as mapper:
            return mapper.find_projekt_by_bezeichnung(bezeichnung)

    def get_all_projekt(self):
        """Alle Projekte auslesen."""
        with ProjektMapper() as mapper:
            return mapper.find_all()

    def save_projekt(self, projekt):
        """Die gegebene Projekte speichern."""
        with ProjektMapper() as mapper:
            return mapper.update(projekt)

    def delete_projekt(self, projekt):
        """Die gegebenen Projekte aus unserem System löschen."""
        with ProjektMapper() as mapper:
            mapper.delete(projekt)


    """zeitintervallbuchung-spezifische Methoden"""


    def create_zeitintervallbuchung(self, creation_time):
        """Eine Zeitintervallbuchung anlegen"""
        p = Zeitintervallbuchung()
        p.set_id(1)
        p.set_creation_time(creation_time)

        with ZeitintervallbuchungMapper() as mapper:
            return mapper.insert(p)


    def get_zeitintervallbuchung_by_id(self, id):
        """Die Zeitintervallbuchung mit der gegebenen ID auslesen."""
        with ZeitintervallbuchungMapper() as mapper:
            return mapper.find_by_id(id)


    def get_all_zeitintervallbuchung(self):
        """Alle Zeitintervallbuchungen auslesen."""
        with ZeitintervallbuchungMapper() as mapper:
            return mapper.find_all()


    def save_zeitintervallbuchung(self, zeitintervallbuchung):
        """Die gegebene Zeitintervallbuchung speichern."""
        with ZeitintervallbuchungMapper() as mapper:
            return mapper.update(zeitintervallbuchung)


    def delete_zeitintervallbuchung(self, zeitintervallbuchung):
        """Die gegebenen Zeitintervallbuchung aus unserem System löschen."""
        with ZeitintervallbuchungMapper() as mapper:
            mapper.delete(zeitintervallbuchung)


    """zeitintervall-spezifische Methoden"""


    def create_zeitintervall(self, creation_time, projekt_runtime):
        """Eine Zeitintervall anlegen"""
        p = Zeitintervall()
        p.set_id(1)
        p.set_creation_time(creation_time)
        p.set_projekt_runtime(projekt_runtime)

        with ZeitintervallMapper() as mapper:
            return mapper.insert(p)


    def get_zeitintervall_by_id(self, id):
        """Die Zeitintervall mit der gegebenen ID auslesen."""
        with ZeitintervallMapper() as mapper:
            return mapper.find_by_id(id)


    def get_zeitintervall_by_projekt_runtime(self, projekt_runtime):
        """Die Zeitintervall mit der gegebenen ID auslesen."""
        with ZeitintervallMapper() as mapper:
            return mapper.find_by_projekt_runtime(projekt_runtime)


    def get_all_zeitintervall(self):
        """Alle Zeitintervallen auslesen."""
        with ZeitintervallMapper() as mapper:
            return mapper.find_all()


    def save_zeitintervall(self, zeitintervall):
        """Die gegebene Zeitintervall speichern."""
        with ZeitintervallMapper() as mapper:
            return mapper.update(zeitintervall)


    def delete_zeitintervall(self, zeitintervall):
        """Die gegebenen Zeitintervall aus unserem System löschen."""
        with ZeitintervallMapper() as mapper:
            mapper.delete(zeitintervall)

    """buchung-spezifische Methoden"""

    def create_buchung (self, buchungs_id):
        buchung = Buchung()
        buchung.set_id(1)
        buchung.set_ersteller(buchungs_id)

        with BuchungMapper as mapper:
            return mapper.insert(buchung)

    def get_buchungs_id(self, number):
        """Die Buchung mit der gegebenen ID auslesen."""
        with BuchungMapper() as mapper:
            return mapper.find_by_id(number)

    def get_buchung_by_key (self, number):
        with BuchungMapper() as mapper:
            return mapper.find_by_key(number)

    def get_by_bezeichung (self, bezeichnung):
        with BuchungMapper() as mapper:
            return mapper.find_by_bezeichnung(bezeichnung)

    def save_buchung (self, number):
        with BuchungMapper() as mapper:
            return mapper.update(number)

    def delete_buchung(self, buchung):
        with BuchungMapper() as mapper:
            return mapper.delete(buchung)

    """ereignis-spezifische Methoden"""

    def create_ereignis (self, zeitpunkt_ereigniseintritt):
        ereignis = Ereignis()
        ereignis.set_zeitpunkt_ereigniseintritt(zeitpunkt_ereigniseintritt)

        with EreignisMapper() as mapper:
            return mapper.insert(ereignis)

    def get_all_ereignisse (self):
        with EreignisMapper() as mapper:
            return mapper.find_all

    def save_ereignis (self, ereignis):
        with EreignisMapper() as mapper:
            return mapper.update(ereignis)

    def delete_ereignis(self, ereignis):
        with EreignisMapper() as mapper:
            return mapper.delete(ereignis)

    """zeitintervallbuchung-spezifische Methoden"""


    def create_Ereignisbuchung(self, creation_time):
        """Eine Ereignisbuchung anlegen"""
        p = Ereignisbuchung()
        p.set_id(1)
        p.set_creation_date(creation_time)

        with EreignisbuchungMapper() as mapper:
            return mapper.insert(p)


    def get_ereignisbuchung_by_id(self, id):
        """Die Ereignisbuchung mit der gegebenen ID auslesen."""
        with EreignisbuchungMapper() as mapper:
            return mapper.find_by_id(id)


    def get_all_ereignisbuchung(self):
        """Alle Ereignisbuchung auslesen."""
        with EreignisbuchungMapper() as mapper:
            return mapper.find_all()


    def save_ereignisbuchung(self, ereignisbuchung):
        """Die gegebene Ereignisbuchung speichern."""
        with EreignisbuchungMapper() as mapper:
            return mapper.update(ereignisbuchung)


    def delete_ereignisbuchung(self, ereignisbuchung):
        """Die gegebenen Ereignisbuchung aus unserem System löschen."""
        with EreignisbuchungMapper() as mapper:
            mapper.delete(ereignisbuchung)