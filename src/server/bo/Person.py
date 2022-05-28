from src.server.bo import BusinessObject as bo



class Person (bo.BusinessObject):

    def __init__(self):
        super().__init__() # creation_time und id wird nicht mehr im Bo reingeschrieben, da es vererbt wird.
        self._vorname = None
        self._nachname = None
        self._email = 0
        self._benutzername = False

    def get_vorname (self):
        "Auslesen des vornamens"
        return self._vorname

    def set_vorname(self, vorname):
        "Festlegen des vorname"
        self._vorname = vorname

    def get_nachname (self):
        "Auslesen des nachname"
        return self._nachname

    def set_nachname (self, nachname):
        "Festlegen des nachname"
        self._nachname = nachname

    def get_email (self):
        "Auslesen der email"
        return self._email

    def set_email(self, email):
        "Festlegen der email"
        self._email = email

    def get_benutzername(self):
        "Auslesen des benutzername"
        return self._benutzername

    def set_is_benutzername(self, benutzername):
        "Akzeptieren der benutzername"
        self._is_benutzername = benutzername


    # Person aus dictionary erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Person()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(dictionary["creation_time"])
        obj.set_vorname(dictionary["vorname"])
        obj.set_nachname(dictionary["nachname"])
        obj.set_email(dictionary["email"])
        obj.set_benutzername(dictionary["benutzername"])
        return obj