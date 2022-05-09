from src.server.bo import BusinessObject as bo


# User Klasse
class Projekt (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._projekt_id = ""
        self._bezeichnung = ""
        self._auftraggeber = ""


    def get_projekt_id(self):
        return self._projekt_id

    def set_projekt_id(self, value):
        self._projekt_id = value

    def get_bezeichnung(self):
        return self._bezeichnung

    def set_bezeichnung(self, value):
        self._bezeichnung = value

    def get_auftraggeber(self):
        return self._auftraggeber

    def set_auftraggeber(self, value):
        self._auftraggeber = value



    # User Object aus Dict erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Projekt()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(Projekt.date_format(dictionary["creation_date"]))
        obj.set_projekt_id(dictionary["projekt_id"])
        obj.set_bezeichnung(dictionary["bezeichnung"])
        obj.set_auftraggeber(dictionary["auftraggeber"])

        return obj