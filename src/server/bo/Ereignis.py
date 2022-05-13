from src.server.bo import BusinessObject as bo


# User Klasse
class Ereignis (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._ereignis_id = 0
        self._zeitpunkt_ereigniseintritt = ""


    def get_ereignis_id(self):
        return self._ereignis_id

    def set_projekt_id(self, value):
        self._ereignis_id = value

    def get_zeitpunkt_ereigniseintritt(self):
        return self._zeitpunkt_ereigniseintritt

    def set_zeitpunkt_ereigniseintritt(self, value):
        self._zeitpunkt_ereigniseintritt = value





    # User Object aus Dict erstellen
    @staticmethod
    def from_dict(dictionary=dict()):
        obj = Ereignis()
        obj.set_id(dictionary["id"])
        obj.set_creation_date(Ereignis.date_format(dictionary["creation_date"]))
        obj.set_zeitpunkt_ereigniseintritt(dictionary["zeitpunkt_ereigniseintritt"])

        return obj