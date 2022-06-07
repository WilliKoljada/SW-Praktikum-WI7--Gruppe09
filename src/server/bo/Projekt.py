from src.server.bo import BusinessObject as bo



class Projekt (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._bezeichnung = ""
        self._auftraggeber = ""
        self.ersteller_ID = 0

    def get_bezeichnung(self):
        return self._bezeichnung

    def set_bezeichnung(self, value):
        self._bezeichnung = value

    def get_auftraggeber(self):
        return self._auftraggeber

    def set_auftraggeber(self, value):
        self._auftraggeber = value

    def get_ersteller_ID(self):
        return self.ersteller_ID
    
    def set_ersteller_ID(self, ersteller_ID):
        self._ersteller_ID = ersteller_ID



    # User Object aus Dict erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Projekt()
        obj.set_id(dictionary["id"])
        obj.set_creation_date((dictionary["creation_date"]))
        obj.set_bezeichnung(dictionary["bezeichnung"])
        obj.set_auftraggeber(dictionary["auftraggeber"])
        obj.set_ersteller_ID(dictionary["ersteller_ID"])

        return obj