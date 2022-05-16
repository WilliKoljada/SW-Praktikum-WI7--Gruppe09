from server.bo.Person import Person

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