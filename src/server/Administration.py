from server.bo.Person import Person
from server.bo.Aktivitaet import Aktivitaet
from server.bo.Arbeitszeitkonto import Arbeitszeitkonto

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