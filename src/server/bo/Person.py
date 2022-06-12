from server.bo import BusinessObject as bo



class Person (bo.BusinessObject):

    def __init__(self):
        super().__init__() # creation_date und id wird nicht mehr im Bo reingeschrieben, da es vererbt wird.
        self._vorname = ''
        self._nachname = ''
        self._email = ''
        self._benutzername = ''
        self._google_id = ''

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
        self._benutzername = benutzername

    def get_google_user_id (self):
        return self._google_id

    def set_google_user_id (self, google_id):
        self._google_id = google_id


    # Person aus dictionary erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Person()
        obj.set_id(dictionary["id"])
        obj.set_vorname(dictionary["vorname"])
        obj.set_nachname(dictionary["nachname"])
        obj.set_email(dictionary["email"])
        obj.set_is_benutzername(dictionary["benutzername"])

        return obj
