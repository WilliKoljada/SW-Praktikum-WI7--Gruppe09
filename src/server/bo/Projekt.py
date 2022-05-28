from src.server.bo import BusinessObject as bo



class Projekt (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._bezeichnung = ""
        self._auftraggeber = ""

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
        obj.set_creation_date(Projekt.date_format(dictionary["creation_time"]))
        obj.set_id(dictionary["projekt_id"])
        obj.set_bezeichnung(dictionary["bezeichnung"])
        obj.set_auftraggeber(dictionary["auftraggeber"])

        return obj